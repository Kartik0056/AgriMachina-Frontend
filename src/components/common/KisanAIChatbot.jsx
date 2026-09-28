import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { initialGreeting } from './chatbot/chatbotData';
import ChatLauncher from './chatbot/ChatLauncher';
import ChatHeader from './chatbot/ChatHeader';
import ChatMessages from './chatbot/ChatMessages';
import ChatInput from './chatbot/ChatInput';

const KisanAIChatbot = () => {
  const [isLauncherHovered, setIsLauncherHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [currentLang, setCurrentLang] = useState('hi');
  const [messages, setMessages] = useState([initialGreeting]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (textToSend = null) => {
    const text = textToSend || inputVal;
    if (!text || !text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    try {
      const res = await api.post('/ai/chat', { message: text.trim(), lang: currentLang });
      if (res.data.success && (res.data.data || res.data.text)) {
        const botData = res.data.data || {};
        const newBotMsg = {
          id: Date.now() + 1,
          sender: 'bot',
          text: botData.text || res.data.text || '',
          actionLink: botData.actionLink || res.data.actionLink || null,
          products: botData.products || res.data.products || [],
          supportActions: botData.supportActions || res.data.supportActions || [],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, newBotMsg]);
      } else {
        throw new Error('Fallback required');
      }
    } catch {
      const fallbackMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: `🙏 **Namaste Kisan Bhai!**\n\nHamara **Kisan AI Assistant** aapki seva me hajir hai. Kheti ki machinery (Power Weeders, Brush Cutters, Solar Pumps), 0% EMI Loan, aur Govt. SMAM Subsidy ke baare me poochhein.`,
        actionLink: { label: 'Explore Agriculture Store', url: '/products' },
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <ChatLauncher
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isLauncherHovered={isLauncherHovered}
        setIsLauncherHovered={setIsLauncherHovered}
      />

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: isMinimized ? '0' : isMaximized ? '0' : '24px',
            right: isMinimized ? '24px' : isMaximized ? '0' : '24px',
            left: isMaximized ? '0' : 'auto',
            top: isMaximized ? '0' : 'auto',
            width: isMaximized ? '100vw' : isMinimized ? '340px' : '440px',
            height: isMaximized ? '100vh' : isMinimized ? '46px' : '600px',
            maxHeight: isMaximized ? '100vh' : '90vh',
            maxWidth: isMaximized ? '100vw' : 'calc(100vw - 32px)',
            background: 'var(--bg-surface)',
            borderRadius: isMaximized ? '0px' : isMinimized ? '14px 14px 0 0' : '18px',
            boxShadow: '0 25px 60px -10px rgba(6, 36, 22, 0.45), 0 0 0 1px rgba(0,0,0,0.1)',
            zIndex: 999999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: isMaximized ? 'none' : '1.5px solid #22c55e',
            transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <ChatHeader
            isMinimized={isMinimized}
            setIsMinimized={setIsMinimized}
            isMaximized={isMaximized}
            setIsMaximized={setIsMaximized}
            setIsOpen={setIsOpen}
            currentLang={currentLang}
            setCurrentLang={setCurrentLang}
          />

          {!isMinimized && (
            <>
              <ChatMessages
                messages={messages}
                isTyping={isTyping}
                setIsOpen={setIsOpen}
                messagesEndRef={messagesEndRef}
              />

              <ChatInput
                currentLang={currentLang}
                inputVal={inputVal}
                setInputVal={setInputVal}
                handleSendMessage={handleSendMessage}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default KisanAIChatbot;
