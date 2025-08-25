import { useEffect, useRef, useState } from 'react';
import supabase from '../lib/supabase';
import { ICurrentUser } from '../types/types';

export type TypingUser =  Omit<ICurrentUser, 'email'|'firstname'|'lastname'|'role'>;

export const useTypingStatus = (chatId: string, currentUser: TypingUser|null, updatesOnly:boolean = false) => {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Update typing status
  const setTyping = async (isTyping: boolean) => {
    if(!currentUser) return
    await supabase
      .from(`typing_status`)
      .upsert(
        { 
          chat_id: chatId, 
          user_id: currentUser.id,
          is_typing: isTyping,
          last_updated: new Date().toISOString()
        },
        { onConflict: 'chat_id , user_id, user_role' }
      );
  };

  // Subscribe to changes and fetch user names
  useEffect(() => {
    if(!currentUser) return;
    const channel = supabase
      .channel(`typing_status:${chatId}:${updatesOnly? 'updates_only': 'main'}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_status',
          filter: `chat_id=eq.${chatId}`
        },
        async (payload) => {
          const { user_id, is_typing } = payload.new as {
            user_id: string,
            is_typing: boolean
          };

          if (user_id === currentUser.id) return;

          const userKey = `user:${user_id}`;[]
          
          if (typingTimeoutRef.current[userKey]) {
            clearTimeout(typingTimeoutRef.current[userKey]);
            delete typingTimeoutRef.current[userKey];
          }

          
          setTypingUsers(prev => {
            const others = prev.filter(u => 
              !(u.id === user_id)
            );

            if (is_typing) {

              typingTimeoutRef.current[userKey] = setTimeout(() => {
                setTypingUsers(prev => prev.filter(u => 
                  !(u.id === user_id))
                );
              }, 5000);

              return [...others, { 
                id: user_id,
              }];
            }

            return others;
          });
        }
      )
      .subscribe();

    // Cleanup stale status every 5 seconds
    return () => {
      supabase    
      .from('typing_status')
      .delete()
      .lt('last_updated', new Date(Date.now() - 5000).toISOString());
      supabase.removeChannel(channel);

      Object.values(typingTimeoutRef.current).forEach(clearTimeout);
      setTyping(false); // Clear status on unmount
    };
  }, [chatId, currentUser?.id]);

  return { typingUsers, setTyping };
};