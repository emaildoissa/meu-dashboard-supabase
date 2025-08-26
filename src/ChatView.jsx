// src/ChatView.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import ChatViewer from './ChatViewer';
import ChatInput from './ChatInput';
import ConversationList from './ConversationList';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  useTheme, 
  useMediaQuery,
  Alert,
  Snackbar,
  Chip
} from '@mui/material';

function ChatView() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  // Busca inicial das conversas
  useEffect(() => {
    const fetchConversations = async () => {
      const { data, error } = await supabase.rpc('get_chat_sessions');
      if (error) {
        console.error("Erro ao buscar conversas:", error);
        showNotification('Erro ao carregar conversas', 'error');
      } else {
        setConversations(data);
      }
    };
    fetchConversations();
  }, []);

  // Efeito para buscar mensagens e ativar a escuta em tempo real (Realtime)
  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    const fetchInitialMessages = async () => {
      setLoadingMessages(true);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('phone', activeConversationId)
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

    // **MELHORIA DE PERFORMANCE: Usando Supabase Realtime**
    const channel = supabase.channel(`chat_${activeConversationId}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `phone=eq.${activeConversationId}` },
        (payload) => {
          const newMessage = payload.new;
          const formattedNewMessage = [
            newMessage.user_message && { id: `user-${newMessage.id}`, content: newMessage.user_message, direction: 'received', timestamp: newMessage.created_at },
            newMessage.bot_message && { id: `bot-${newMessage.id}`, content: newMessage.bot_message, direction: 'bot', timestamp: newMessage.created_at }
          ].filter(Boolean);

          setMessages(currentMessages => [...currentMessages, ...formattedNewMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversationId]);

  // **CORREÇÃO DE SEGURANÇA: Chamando a Edge Function**
  const handleSendMessage = async (text) => {
    if (!activeConversationId) return;

    const tempMessage = { id: `temp-${Date.now()}`, content: `[Admin] ${text}`, direction: 'bot', timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, tempMessage]);

    try {
      // Invoca a função segura que criamos
      const { error } = await supabase.functions.invoke('send-admin-message', {
        body: { phone: activeConversationId, message: text },
      });

      if (error) throw error;
      showNotification('Mensagem enviada!', 'success');
    } catch (error) {
      console.error("Falha ao enviar mensagem:", error);
      showNotification(`Erro: ${error.message}`, 'error');
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      throw error;
    }
  };

  return (
    <>
      <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
        <Box sx={{ width: isMobile ? '100%' : '320px', height: isMobile ? '40%' : '100%', flexShrink: 0, borderRight: isMobile ? 'none' : '1px solid #e0e0e0', borderBottom: isMobile ? '1px solid #e0e0e0' : 'none' }}>
          <ConversationList conversations={conversations} onSelectConversation={setActiveConversationId} activeConversationId={activeConversationId} />
        </Box>
        <Box sx={{ flex: 1, height: isMobile ? '60%' : '100%', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {activeConversationId ? (
            <Paper elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 0 }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
                <Typography variant="h6" fontWeight="500">{activeConversationId.split('@')[0]}</Typography>
              </Box>
              {loadingMessages ? (
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <ChatViewer messages={messages} />
              )}
              <ChatInput onSendMessage={handleSendMessage} />
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