import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import supabase from '../lib/supabase';
import { IChat, IChatMessage, IFileMeta, IMessageGroup, IMessageType, IUser } from '../types/types';
import { useAxiosAuth } from './useAxiosAuth';
import useSound from 'use-sound';
import sound from '../assets/audio/message-2.wav';
import { groupMessages } from '../utils/message.utils';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../context/AuthContext';

interface UseChatMessagesProps {
  chatId: string;
  updatesOnly?: boolean;
  chat?: IChat;
}

export const useChatMessages = ({ chatId, updatesOnly = false, chat }: UseChatMessagesProps) => {
  // State management
  const [groups, setGroups] = useState<IMessageGroup[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [participants, setParticipants] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState<IChatMessage[]>(chat?.unread_messages || []);
  const { currentUser } = useAuth();
  
  // Refs and hooks
  const initialLoadRef = useRef(true);
  const [playSound] = useSound(sound);
  const api = useAxiosAuth();

  // Derived state
  const lastMessage = useMemo(() => {
    const allMessages = groups.flatMap(g => g.messages);
    return allMessages[allMessages.length - 1];
  }, [groups]);

  // Helper functions
  const getFileBlob = async (blobUrl: string, type: IMessageType, meta?: IFileMeta) => {
    try {
      const response = await fetch(blobUrl);
      const file = await response.blob();
      const fileName = type === 'audio' ? 
        `${Date.now()}.wav` 
        : meta&& `${Date.now()}_${meta.name}`
      
      return { file, fileName, fileSize: file.size };
    } catch (error) {
      console.error('Supabase upload failed:', error);
      throw error;
    }
  };

  const updateMessageStatus = useCallback((messageId: string, status: 'delivered' | 'seen' | 'failed') => {
    setGroups(prev => prev.map(group => ({
      ...group,
      messages: group.messages.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      )
    })));
  }, []);

  const markMessagesAsSeen = async () => {
    if (updatesOnly) return;
    await api.patch(`/chats/${chatId}/messages/seen`, null, {
      params: { cursor }
    })
  };

  const refetchParticipants = async()=>{
    const {data} = await api.get(`/chats/${chatId}/participants`)
    setParticipants(prev =>{
      const idSet = new Set(prev.map(obj => obj.id));
      const uniqueNewObjects = data.users.filter((obj:IUser) => !idSet.has(obj.id));
      return [...prev, ...uniqueNewObjects];
    });
    return data.users
  }

  // Message loading
  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/chats/${chatId}/messages`, {
        params: { cursor, limit: 20, initial: !cursor }
      });
      const newParticipants = await refetchParticipants()
      setGroups(prev => {
        const allMessages = cursor 
          ? [...data.messages, ...prev.flatMap(group => group.messages)]
          : data.messages;
        
        return groupMessages(allMessages, newParticipants);
      });

      if (!cursor) initialLoadRef.current = true;
      setCursor(data.nextCursor);
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [chatId, cursor, participants, isLoading, api]);

  // Message sending
  const sendMessage = useCallback(async ({
    content,
    type,
    messagesEndRef,
    meta
  }: {
    content: string;
    type: IMessageType;
    messagesEndRef?: React.RefObject<HTMLDivElement | null>;
    meta?: IFileMeta;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return toast.error('Authentication required');
    if (!meta && !content && (type === 'document' || type === 'image')) {
      return toast.error('No file to upload');
    }

    // Generate IDs
    const localId = `local-${Date.now()}`;
    const provisionalDbId = uuidv4();

    // Create optimistic message
    const optimisticMessage: IChatMessage = {
      id: provisionalDbId,
      localId,
      content: type==='text'?content:`${type.slice(0,1).toUpperCase()}${type.slice(1)}`,
      file: type !== 'text' ? {
        id: `f-${localId}`,
        bucket: '',
        path: content,
        name: meta?.name || '',
        type: type as 'audio' | 'image' | 'document',
        size: meta?.size || 0,
        uploaded_at: new Date().toISOString(),
        meta
      } : undefined,
      type,
      chatId,
      senderId: currentUser!.id,
      createdAt: new Date().toISOString(),
      status: 'sending'
    };

    // Optimistic update
    setGroups(prev => groupMessages(
      [...prev.flatMap(g => g.messages), optimisticMessage],
      participants
    ));

    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });

    try {
      let filePath = '';
      let fileBlob = type !== 'text' ? await getFileBlob(content, type, meta) : null;

      // Handle file upload if needed
      if (fileBlob) {
        const uploadPath = `${chatId}/${type === 'audio' ? 'audio' : `${type}s`}/${fileBlob.fileName}`;
        const uploadResult = await supabase.storage
          .from('chats_uploads')
          .upload(uploadPath, fileBlob.file);

        if (uploadResult.error) throw uploadResult.error;
        filePath = uploadResult.data.path;
      }

      // Insert file metadata if needed
      const { data: fileData } = await api.post(`/chats/${chatId}/messages`, {
          id: provisionalDbId,
          content: type==='text'? content :`${type.slice(0,1).toUpperCase()}${type.slice(1)}`,
          chatId,
          type,
          senderId: currentUser!.id,
          status: 'delivered',
          ...(type !== 'text' && {file: {
            path: filePath,
            bucket: 'chats_uploads',
            name: fileBlob?.fileName,
            size: fileBlob?.fileSize,
            type,
            meta: {
              width: meta?.width,
              height: meta?.height,
              duration: meta?.duration
            },
          }})
        });

      if (!fileData.success) throw fileData.message;

      // Update status to delivered
      updateMessageStatus(provisionalDbId, 'delivered');
    } catch (error) {
      updateMessageStatus(provisionalDbId, 'failed');
      console.error('Message sending failed:', error);
      toast.error('Failed to send message');
    }
  }, [chatId, participants, currentUser, updateMessageStatus]);

  // Message handling
  const handleNewMessage = useCallback(async (newMessage: IChatMessage) => {
    const messageExists = groups.some(group => 
      group.messages.some(m => m.id === newMessage.id)
    );

    if (messageExists|| (newMessage.senderId === currentUser?.id&&!updatesOnly)) return;

    playSound();
    if (!updatesOnly) await markMessagesAsSeen()

    if(newMessage.file_id) {
      const {data: fileData} = await api.get(`/chats/files/${newMessage.id}`)
      if(!fileData.success) return toast.error(fileData.message)
      newMessage.file = fileData.file
    }

    if (updatesOnly && chat) {
      if(newMessage.senderId !== currentUser?.id) setUnreadMessages(prev => [...prev, newMessage]);
      return setGroups(groupMessages(
        [newMessage],
        chat.users
      ));
    }
    
    setGroups(prev => groupMessages(
      [...prev.flatMap(g => g.messages), newMessage],
      participants
    ));

  }, [groups, updatesOnly, chatId, chat, participants, currentUser?.id, playSound]);

  const handleSeenUpdate = useCallback((messageUpdate: IChatMessage) => {
    if (updatesOnly) {
      setUnreadMessages(prev => prev.filter(m => m.id !== messageUpdate.id));
    }
    updateMessageStatus(messageUpdate.id, 'seen');
  }, [updatesOnly, updateMessageStatus]);

  // Effects
  useEffect(() => {
    if ((updatesOnly && !chat?.users?.length) || 
        (!updatesOnly && participants.length < 1)) {
      return;
    }

    const channel = supabase
      .channel(`${updatesOnly ? 'chat_updates' : 'chat'}:${chatId}`)
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
      
    const updateChannel = supabase
      .channel(`${updatesOnly ? 'seen_updates' : 'seen_main'}:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `chatId=eq.${chatId}`
        },
        (payload) => handleSeenUpdate(payload.new as IChatMessage)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(updateChannel);
    };
  }, [chatId, participants.length, updatesOnly, chat]);

  useEffect(() => {
    const reset = async () => {
      setGroups(updatesOnly && chat ? 
        (chat.lastMessage ? groupMessages([chat.lastMessage], chat.users) : []) 
        : []);
      setCursor(null);
      setParticipants([]);
      setIsLoading(true);
      initialLoadRef.current = true;
    };

    reset().then(() => {
      if (updatesOnly) {
        setIsLoading(false);
      } else {
        loadMessages().then(()=>markMessagesAsSeen());
      }
    });
  }, [chatId, updatesOnly, chat]);

  return { 
    groups,
    setGroups,
    setCursor,
    loadMore: loadMessages, 
    sendMessage,
    hasMore: !!cursor,
    participants,
    isLoading,
    lastMessage,
    unreadMessages
  };
};