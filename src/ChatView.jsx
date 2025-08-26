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

// --- CONFIGURAÇÕES DA API ---
const EVOLUTION_API_URL = 'https://evolution.automacao.free.nf/message/sendText/Galaxy A01 Core';
const EVOLUTION_API_KEY = '848F0DEDF11B-466F-80F0-24D7FA9BF801';

const formatConversationId = (id) => {
  if (!id) return '';
  return id.split('@')[0];
};

// Função para enviar mensagem via Evolution API
const sendMessageToEvolution = async (phone, message) => {
  try {
    const response = await fetch(EVOLUTION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_API_KEY
      },
      body: JSON.stringify({
        number: phone,
        text: message
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao enviar mensagem via Evolution API:', error);
    throw error;
  }
};

// Função para salvar mensagem no Supabase
const saveMessageToSupabase = async (phone, userMessage, botMessage = null, messageDirection = 'sent') => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{
        phone: phone,
        user_message: userMessage,
        bot_message: botMessage,
        message_direction: messageDirection,
        active: true,
        app: 'delivery',
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Erro ao salvar mensagem no Supabase:', error);
    throw error;
  }
};

function ChatView() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('online'); // online, offline, error
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  
  // Hook para detectar tela pequena
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Função para mostrar notificação
  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  useEffect(() => {
    async function fetchConversations() {
      try {
        const { data, error } = await supabase.rpc('get_chat_sessions');
        if (error) {
          console.error("Erro ao buscar conversas:", error);
          setConnectionStatus('error');
          showNotification('Erro ao carregar conversas', 'error');
        } else {
          setConversations(data);
          setConnectionStatus('online');
        }
      } catch (error) {
        console.error("Erro de conexão:", error);
        setConnectionStatus('offline');
        showNotification('Problema de conexão', 'warning');
      }
    }
    
    fetchConversations();

    // Atualizar conversas a cada 30 segundos
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    async function fetchAndProcessMessages() {
      setLoadingMessages(true);
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('phone', activeConversationId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Erro ao buscar mensagens:', error);
          showNotification('Erro ao carregar mensagens', 'error');
          setMessages([]);
        } else {
          const linearizedMessages = [];
          data.forEach(row => {
            if (row.user_message) {
              linearizedMessages.push({ 
                id: `user-${row.id}`, 
                content: row.user_message, 
                direction: 'received', 
                timestamp: row.created_at 
              });
            }
            if (row.bot_message) {
              linearizedMessages.push({ 
                id: `bot-${row.id}`, 
                content: row.bot_message, 
                direction: 'bot', 
                timestamp: row.created_at 
              });
            }
          });
          setMessages(linearizedMessages);
        }
      } catch (error) {
        console.error('Erro de conexão ao buscar mensagens:', error);
        showNotification('Problema de conexão', 'warning');
      } finally {
        setLoadingMessages(false);
      }
    }

    fetchAndProcessMessages();

    // Atualizar mensagens a cada 10 segundos
    const interval = setInterval(fetchAndProcessMessages, 10000);
    return () => clearInterval(interval);
  }, [activeConversationId]);

  const handleSendMessage = async (text) => {
    if (!activeConversationId) {
      showNotification("Por favor, selecione uma conversa", 'warning');
      return;
    }

    if (!text.trim()) {
      showNotification("Digite uma mensagem", 'warning');
      return;
    }

    // Adiciona mensagem localmente imediatamente para feedback visual
    const tempMessage = { 
      id: `temp-${Date.now()}`, 
      content: text, 
      direction: 'sent', 
      timestamp: new Date().toISOString() 
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      // 1. Enviar via Evolution API
      console.log('Enviando mensagem via Evolution API...');
      await sendMessageToEvolution(activeConversationId, text);
      
      // 2. Salvar no Supabase
      console.log('Salvando mensagem no Supabase...');
      await saveMessageToSupabase(activeConversationId, text);
      
      showNotification('Mensagem enviada com sucesso!', 'success');
      
      // Atualizar a lista de conversas para refletir a nova mensagem
      const { data } = await supabase.rpc('get_chat_sessions');
      if (data) setConversations(data);

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      
      // Remove a mensagem temporária em caso de erro
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      
      // Mostra erro específico
      let errorMessage = 'Erro ao enviar mensagem';
      if (error.message.includes('API')) {
        errorMessage = 'Erro na API do WhatsApp';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Erro de conexão';
      }
      
      showNotification(errorMessage, 'error');
      throw error; // Re-throw para o ChatInput tratar
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'online': return 'success';
      case 'offline': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'error': return 'Erro';
      default: return 'Conectando...';
    }
  };

  return (
    <>
      <Box 
        sx={{ 
          height: 'calc(100vh - 64px)', // Altura total menos a AppBar
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 0,
          overflow: 'hidden'
        }}
      >
        {/* Lista de Conversas */}
        <Box 
          sx={{ 
            width: isMobile ? '100%' : '320px',
            height: isMobile ? '40%' : '100%',
            flexShrink: 0,
            borderRight: isMobile ? 'none' : '1px solid #e0e0e0',
            borderBottom: isMobile ? '1px solid #e0e0e0' : 'none',
          }}
        >
          <ConversationList 
            conversations={conversations} 
            onSelectConversation={setActiveConversationId} 
            activeConversationId={activeConversationId} 
          />
        </Box>

        {/* Área do Chat */}
        <Box 
          sx={{ 
            flex: 1,
            height: isMobile ? '60%' : '100%',
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0, // Importante para evitar overflow
          }}
        >
          {activeConversationId ? (
            <Paper 
              elevation={0}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 0,
                border: 'none'
              }}
            >
              {/* Cabeçalho do Chat */}
              <Box 
                sx={{ 
                  p: 2, 
                  borderBottom: '1px solid #e0e0e0',
                  backgroundColor: '#fafafa',
                  flexShrink: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography variant="h6" fontWeight="500" noWrap>
                  {formatConversationId(activeConversationId)}
                </Typography>
                
                <Chip 
                  label={getStatusText()} 
                  color={getStatusColor()} 
                  size="small"
                  variant="outlined"
                />
              </Box>

              {/* Área das Mensagens */}
              {loadingMessages ? (
                <Box 
                  sx={{ 
                    flex: 1,
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center' 
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <ChatViewer messages={messages} />
              )}

              {/* Input de Mensagem */}
              <Box sx={{ flexShrink: 0 }}>
                <ChatInput 
                  onSendMessage={handleSendMessage}
                  disabled={connectionStatus === 'error'}
                  placeholder={connectionStatus === 'error' 
                    ? "Erro de conexão - verifique sua internet" 
                    : "Digite uma mensagem..."
                  }
                />
              </Box>
            </Paper>
          ) : (
            <Paper 
              elevation={0}
              sx={{ 
                flex: 1,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#f8f9fa',
                borderRadius: 0
              }}
            >
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Selecione uma conversa para começar
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  Escolha uma conversa da lista ao lado para visualizar as mensagens e poder responder
                </Typography>
                
                {connectionStatus !== 'online' && (
                  <Alert severity={connectionStatus === 'error' ? 'error' : 'warning'} sx={{ mt: 2 }}>
                    {connectionStatus === 'error' 
                      ? 'Problema de conexão com o servidor'
                      : 'Conexão instável'
                    }
                  </Alert>
                )}
              </Box>
            </Paper>
          )}
        </Box>
      </Box>

      {/* Snackbar para notificações */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ChatView;