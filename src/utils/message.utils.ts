import { IChatMessage, IMessageGroup, IUser } from "../types/types";

export function groupMessages(
  messages: IChatMessage[],
  participants: IUser[],
  
): IMessageGroup[] {
 
  if (!messages.length) return [];
  const GROUP_TIME_THRESHOLD = 5 * 60 * 1000

  const groups: IMessageGroup[] = [];
  let currentGroup: IMessageGroup;

  function createNewGroup(message: IChatMessage, sender: IUser): IMessageGroup {
    return {
      senderId: message.senderId,
      messages: [message],
      showHeader: true,
      timestamp: message.createdAt,
      senderInfo: sender
    };
  }

  messages.forEach((message) => {
    const sender = participants.find(a => a.id === message.senderId);
    if (!sender) return;

    if (groups.length<1) {
      currentGroup = createNewGroup(message, sender);
      groups.push(currentGroup);
      return;
    }

    const timeDiff = new Date(message.createdAt).getTime() - 
                    new Date(currentGroup.timestamp).getTime();

    if (currentGroup.senderId !== message.senderId || 
        timeDiff > GROUP_TIME_THRESHOLD) {
      currentGroup = createNewGroup(message, sender);
      groups.push(currentGroup);
    } else {
      currentGroup.messages.push(message);
    }
  });
  return groups;
}