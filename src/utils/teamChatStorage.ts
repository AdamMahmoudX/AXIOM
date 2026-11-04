export interface TeamChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

const STORAGE_KEY = 'axiomx_team_chat';
export const GENERAL_CHANNEL_ID = 'general';

export const loadTeamChatMessages = (channelId?: string): TeamChatMessage[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TeamChatMessage[];
    if (!Array.isArray(parsed)) return [];
    return channelId ? parsed.filter((message) => message.channelId === channelId) : parsed;
  } catch {
    return [];
  }
};

export const appendTeamChatMessage = (message: TeamChatMessage): void => {
  if (typeof window === 'undefined') return;
  const all = loadTeamChatMessages();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...all, message]));
};

export const getChannelMessages = (channelId: string): TeamChatMessage[] =>
  loadTeamChatMessages(channelId).sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
