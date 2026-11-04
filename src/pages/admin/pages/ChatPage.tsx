import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Hash, MessageSquare, Send, Users } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { useEmployees } from '../../../context/EmployeeContext';
import {
  GENERAL_CHANNEL_ID,
  TeamChatMessage,
  appendTeamChatMessage,
  getChannelMessages,
} from '../../../utils/teamChatStorage';

interface ChatChannel {
  id: string;
  labelEn: string;
  labelAr: string;
  subtitleEn: string;
  subtitleAr: string;
}

const ChatPage: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { employees } = useEmployees();
  const isRTL = language === 'ar';
  const [activeChannelId, setActiveChannelId] = useState(GENERAL_CHANNEL_ID);
  const [messages, setMessages] = useState<TeamChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const channels = useMemo<ChatChannel[]>(() => {
    const general: ChatChannel = {
      id: GENERAL_CHANNEL_ID,
      labelEn: 'General',
      labelAr: 'العام',
      subtitleEn: 'Team-wide channel',
      subtitleAr: 'قناة الفريق',
    };

    const directChannels = employees
      .filter((employee) => employee.status === 'active' && employee.id !== user?.id)
      .map((employee) => ({
        id: `dm-${employee.id}`,
        labelEn: employee.fullName,
        labelAr: employee.fullName,
        subtitleEn: employee.jobTitle,
        subtitleAr: employee.jobTitle,
      }));

    return [general, ...directChannels];
  }, [employees, user?.id]);

  const activeChannel = channels.find((channel) => channel.id === activeChannelId) ?? channels[0];

  useEffect(() => {
    if (!activeChannel) return;
    setMessages(getChannelMessages(activeChannel.id));
  }, [activeChannel, activeChannelId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!draft.trim() || !user || !activeChannel) return;

    const message: TeamChatMessage = {
      id: `msg-${Date.now()}`,
      channelId: activeChannel.id,
      senderId: user.id,
      senderName: user.fullName || user.username,
      text: draft.trim(),
      timestamp: new Date().toISOString(),
    };

    appendTeamChatMessage(message);
    setMessages((prev) => [...prev, message]);
    setDraft('');
  };

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-4">
      <aside className="lg:w-72 bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
        <div className={`p-4 border-b border-white/10 ${isRTL ? 'text-end' : 'text-start'}`}>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            {language === 'ar' ? 'الشات الداخلي' : 'Internal Chat'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {language === 'ar' ? 'محادثات الفريق (محلي)' : 'Team conversations (local)'}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {channels.map((channel) => {
            const isActive = channel.id === activeChannelId;
            const Icon = channel.id === GENERAL_CHANNEL_ID ? Hash : Users;
            return (
              <button
                key={channel.id}
                type="button"
                onClick={() => setActiveChannelId(channel.id)}
                className={`w-full p-3 rounded-xl text-start transition-colors ${
                  isActive
                    ? 'bg-blue-500/15 border border-blue-500/30'
                    : 'hover:bg-white/5 border border-transparent'
                } ${isRTL ? 'text-end' : 'text-start'}`}
              >
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-gray-500'}`} />
                  <span className="text-sm font-medium text-white truncate">
                    {language === 'ar' ? channel.labelAr : channel.labelEn}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {language === 'ar' ? channel.subtitleAr : channel.subtitleEn}
                </p>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col min-h-[420px]">
        <div className={`p-4 border-b border-white/10 ${isRTL ? 'text-end' : 'text-start'}`}>
          <h3 className="text-lg font-semibold text-white">
            {activeChannel ? (language === 'ar' ? activeChannel.labelAr : activeChannel.labelEn) : '—'}
          </h3>
          <p className="text-xs text-gray-500">
            {activeChannel
              ? language === 'ar'
                ? activeChannel.subtitleAr
                : activeChannel.subtitleEn
              : ''}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
              {language === 'ar' ? 'لا رسائل بعد — ابدأ المحادثة' : 'No messages yet — start the conversation'}
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.senderId === user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? (isRTL ? 'justify-start' : 'justify-end') : isRTL ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      isOwn
                        ? 'bg-blue-500/20 border border-blue-500/30'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs font-medium text-white">{message.senderName}</span>
                      <span className="text-[10px] text-gray-500">{formatTime(message.timestamp)}</span>
                    </div>
                    <p className={`text-sm text-gray-200 ${isRTL ? 'text-end' : 'text-start'}`}>{message.text}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <div className={`p-4 border-t border-white/10 flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={language === 'ar' ? 'اكتب رسالة...' : 'Type a message...'}
            className={`flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 ${
              isRTL ? 'text-end' : 'text-start'
            }`}
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={!draft.trim()}
            className="px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
            aria-label={language === 'ar' ? 'إرسال' : 'Send'}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default ChatPage;
