import React, { useEffect, useState, useCallback, useRef } from 'react';
import supabase from '../lib/supabase';
import { IChat, IChatMessage, IMessageGroup, IMessageType, IUser } from '../types/types';
import { useAxiosAuth } from './useAxiosAuth';
import useSound from 'use-sound';
import sound from '../assets/audio/message-2.wav';
import { groupMessages } from '../utils/message.utils'
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../context/AuthContext';

export const useChatMessages = ({chatId, updatesOnly = false, chat}:{chatId: string, updatesOnly?:boolean, chat?: IChat}) => {
  const [groups, setGroups] = useState<IMessageGroup[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [participants, setParticipants] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true)
  const [lastMessage, setLastMessage] = useState<IChatMessage>()
  const {currentUser} = useAuth()

  const initialLoadRef = useRef(true);
  const [playSound] = useSound(sound);
  const api = useAxiosAuth();
  
  const loadMessages = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await api.get(`/chats/${chatId}/messages`, {
        params: { cursor, limit: 20, initial: !cursor }
      });

      setParticipants(prev => prev.length>0 ? prev : data.participants);
      
      setGroups(prev => {
        if (!cursor) return groupMessages(data.messages, data.participants);
        
        const allMessages = [
          ...data.messages,
          ...prev.flatMap(group => group.messages)
        ];
        
        return groupMessages(allMessages, participants);
      });

      if (!cursor) initialLoadRef.current = true;
      setCursor(data.nextCursor);
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to load messages:', error);
      setIsLoading(false)
    }
  }, [chatId, cursor, groupMessages]);

  
  const getFileBlob = async (blobUrl: string, type: IMessageType) => {
    try {
      // Convert Blob URL to actual Blob
      const response = await fetch(blobUrl);
      const audioBlob = await response.blob();
      
      // Generate unique filename
      const fileName = type==='audio'? `audio_${currentUser!.id}_${Date.now()}.wav`:null;
      
      return {file: audioBlob, fileName, fileSize: audioBlob.size};
    } catch (error) {
      console.error('Supabase upload failed:', error);
      throw error;
    }
  };

  const sendMessage = useCallback(async ({content, type, messagesEndRef, meta}:{content: string, type: IMessageType, messagesEndRef?: React.RefObject<HTMLDivElement|null>, file?:File|null, meta?:{duration?: number, height?:number, width?:number, name?: string, size?: number, type?: string}}) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return toast.error('Authentication required');
      if (!(meta&&content)&&(type==='document'||type==='image')) return toast.error('No file to upload');
  
      // Generate both IDs upfront
      const localId = `local-${Date.now()}`;
      const provisionalDbId = uuidv4(); // Generate real UUID on client
  
      const optimisticMessage: IChatMessage = {
        id: provisionalDbId,    // Use the same UUID we'll send to DB
        localId,               // Track our local reference
        content,
        file: type != 'text'?{
          bucket: '',
          path: content,
          name: meta?.name||'',
          type: type as 'audio'|'image'|'document',
          size: meta?.size||0,
          meta
        }:undefined,
        type,
        chatId,
        senderId: currentUser!.id,
        senderType: user.role as 'client'|'support_agent',
        createdAt: new Date().toISOString(),
        status: 'sending'
      };
      
      // Add to UI immediately
      setGroups(prev =>{
        return  groupMessages([...prev.flatMap(g => g.messages), optimisticMessage],
          participants
        )
      });
  
      messagesEndRef&& messagesEndRef.current?.scrollIntoView()

      try {
        let filePath = '';
        let fileBlob = type!=='audio'? await getFileBlob(content, type) : null
        // Upload file first if needed
        if (type !== 'text' && (fileBlob)) {
          const uploadResult = await supabase.storage
            .from('chats_uploads')
            .upload(`${type==='audio'?'audio': `${type}s`}/${chatId}/${fileBlob.fileName||meta?.name}`, fileBlob?.file);
          
          if (uploadResult.error) throw uploadResult.error;
          filePath = uploadResult.data.path;
        }
        
        const data = type!=='text'? await supabase
          .from('files_metadata')
          .insert({
            path: filePath,
            bucket: 'chats_uploads',
            name: fileBlob?.fileName||meta!.name,
            size: fileBlob?.fileSize,
            type,
            meta:{
              width: meta?.width,
              height: meta?.height,
              duration: meta?.duration
            },
          })
          .select()
          .single()
          :null;

          if (data) {
            if(data.error) throw data.error;
          }

          const { data: message, error: msgError } = await supabase
            .from('chat_messages')
            .insert({
              id: provisionalDbId,
              content,
              chatId,
              type,
              senderId: currentUser!.id,
              senderType: currentUser!.role,
              status: 'delivered',
              ...(data?.data&& {file_id: data.data.id})
            })
            .select()
            .single();
  
          if (msgError) throw msgError;

        // Update UI optimistically
        setGroups(prev => prev.map(group => ({
          ...group,
          messages: group.messages.map(m => 
            m.localId === localId ? { ...m, id: message!.id, status: 'delivered' } : m
          )
        })));
  
        // Update status optimistically
        setGroups(prev => prev.map(group => ({
          ...group,
          messages: group.messages.map(m => 
            m.localId === localId ? { ...m, status: 'delivered' } : m
          )
        })));
  
      } catch (error) {
        setGroups(prev => prev.map(group => ({
          ...group,
          messages: group.messages.map(m => 
            m.localId === localId ? { ...m, status: 'failed' } : m
          )
        })));
        console.error(error)
      }
    }, [chatId, participants, currentUser?.role, groupMessages]);

  useEffect(() => {
    if (!participants.length) return;

    const handleNewMessage = (newMessage: IChatMessage) => {
      setGroups(prev => {
        if(updatesOnly&&chat) return groupMessages([newMessage], chat.participants);

        const existingMessages = prev.flatMap(g => g.messages);
        const exists = existingMessages.some(m => 
          m.id === newMessage.id || (m.localId && m.id === newMessage.id)
        );
        playSound();
        if(exists) return prev;
        return groupMessages([...existingMessages, newMessage], participants);
      });
    };

    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chatId=eq.${chatId}`
        },
        (payload) => handleNewMessage(payload.new as IChatMessage)
      )
      .subscribe();

    return () => {supabase.removeChannel(channel)};
  }, [chatId, participants.length, groupMessages]);

  useEffect(() => {
    const reset = async()=>{
      (updatesOnly&&chat)? setGroups(chat.lastMessage? groupMessages([chat.lastMessage], chat.participants):[])
        : setGroups([]);
      updatesOnly&& await supabase
        .from('chat_messages')
        .update({
          status: 'seen'
        }).eq('chatId', chatId)
        
      setCursor(null);
      setParticipants([]);
      setIsLoading(true);
      initialLoadRef.current = true;
    }
    reset().then(()=>{
      if(updatesOnly) return setIsLoading(false);
      loadMessages()
    })
  }, [chatId]);
  
  useEffect(()=>{
    setLastMessage(()=>{
      let allMsgs = groups?.flatMap(g=>g.messages)
      return allMsgs[allMsgs.length-1];
    })
  },[groups, isLoading])

  return { 
    groups,
    setGroups,
    setCursor,
    loadMore: loadMessages, 
    sendMessage,
    hasMore: !!cursor,
    participants,
    isLoading,
    lastMessage
  };
};