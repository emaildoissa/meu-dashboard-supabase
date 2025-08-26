// src/ChatView.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import ChatViewer from './ChatViewer';
import ChatInput from './ChatInput';
import ConversationList from './ConversationList';
import { Box, Typography, Paper, CircularProgress, useTheme, useMediaQuery, Alert, Snackbar, Chip, Button, Tooltip } from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SmartToyIcon from '@mui/icons-material/SmartToy';

function ChatView() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  useEffect(() => {
    const fetchConversations = async () => {
      const { data, error } = await supabase.rpc('get_chat_sessions');
      if (error) {
        console.error("Erro ao buscar conversas:", error);
      } else {
        setConversations(data);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!activeConversation?.conversation_id) {
      setMessages([]);
      return;
    }

    const fetchInitialMessages = async () => {
      setLoadingMessages(true);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('phone', activeConversation.conversation_id)
        .order('created_at', { ascending: true });

      if (error) {
        showNotification('Erro ao carregar mensagens', 'error');
      } else {
        const formatted = data.flatMap(row => [
          row.user_message && { id: `user-${row.id}`, content: row.user_message, direction: 'received', timestamp: row.created_at },
          row.bot_message && { id: `bot-${row.id}`, content: row.bot_message, direction: 'bot', timestamp: row.created_at }
        ]).filter(Boolean);
        setMessages(formatted);
      }
      setLoadingMessages(false);
    };

    fetchInitialMessages();

    const channel = supabase.channel(`chat_${activeConversation.conversation_id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `phone=eq.${activeConversation.conversation_id}` },
        (payload) => {
          const newMessage = payload.new;
          const formattedNewMessage = [
            newMessage.user_message && { id: `user-${newMessage.id}`, content: newMessage.user_message, direction: 'received', timestamp: newMessage.created_at },
            newMessage.bot_message && { id: `bot-${newMessage.id}`, content: newMessage.bot_message, direction: 'bot', timestamp: newMessage.created_at }
          ].filter(Boolean);
          setMessages(currentMessages => [...currentMessages, ...formattedNewMessage]);
        }
      ).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversation]);

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
  };

  const handleSendMessage = async (text) => {
    if (!activeConversation?.conversation_id) return;

    try {
      const { error } = await supabase.functions.invoke('send-admin-message', {
        body: { phone: activeConversation.conversation_id, message: text },
      });
      if (error) throw error;
    } catch (error) {
      showNotification(`Erro: ${error.message}`, 'error');
      throw error;
    }
  };

  const handleStatusToggle = async () => {
    const currentStatus = activeConversation?.status || 'bot';
    const newStatus = currentStatus === 'bot' ? 'human' : 'bot';

    try {
        const { error } = await supabase.functions.invoke('update-chat-status', {
            body: { phone: activeConversation.conversation_id, newStatus: newStatus }
        });

        if (error) throw error;

        // Atualiza o estado localmente para refletir a mudança na UI
        setActiveConversation(prev => ({ ...prev, status: newStatus }));
        setConversations(prev => prev.map(c => 
            c.conversation_id === activeConversation.conversation_id ? { ...c, status: newStatus } : c
        ));
        showNotification(`Controle ${newStatus === 'human' ? 'assumido' : 'devolvido ao robô'}.`, 'success');
    } catch(error) {
        showNotification(`Erro ao alterar status: ${error.message}`, 'error');
    }
  };

  const isHumanControl = activeConversation?.status === 'human';

  return (
    <>
      <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
        <Box sx={{ width: isMobile ? '100%' : '320px', height: isMobile ? '40%' : '100%', flexShrink: 0, borderRight: isMobile ? 'none' : '1px solid #e0e0e0', borderBottom: isMobile ? '1px solid #e0e0e0' : 'none' }}>
          <ConversationList conversations={conversations} onSelectConversation={handleSelectConversation} activeConversationId={activeConversation?.conversation_id} />
        </Box>
        <Box sx={{ flex: 1, height: isMobile ? '60%' : '100%', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {activeConversation ? (
            <Paper elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 0 }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" fontWeight="500">{activeConversation.conversation_id.split('@')[0]}</Typography>
                  <Chip 
                    label={isHumanControl ? 'Controle Humano' : 'Controlado pela IA'}
                    color={isHumanControl ? 'warning' : 'success'}
                    size="small"
                    icon={isHumanControl ? <VpnKeyIcon /> : <SmartToyIcon />}
                  />
                </Box>
                <Tooltip title={isHumanControl ? 'Devolver controle para a IA' : 'Assumir controle da conversa'}>
                  <Button variant="contained" size="small" color={isHumanControl ? 'success' : 'warning'} onClick={handleStatusToggle}>
                    {isHumanControl ? 'Devolver ao Robô' : 'Assumir Controle'}
                  </Button>
                </Tooltip>
              </Box>
              {loadingMessages ? (
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <ChatViewer messages={messages} />
              )}
              <ChatInput onSendMessage={handleSendMessage} disabled={!isHumanControl} placeholder={isHumanControl ? "Digite sua mensagem..." : "Assuma o controle para enviar mensagens"}/>
            </Paper>
          ) : (
            <Paper elevation={0} sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" color="text.secondary">Selecione uma conversa</Typography>
            </Paper>
          )}
        </Box>
      </Box>
      <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setNotification(prev => ({ ...prev, open: false }))} severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ChatView;