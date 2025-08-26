// src/ChatViewer.jsx
import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';

// Funções de ajuda para deixar o código mais limpo
const getMessageAlignment = (direction) => {
  const lowerCaseDirection = String(direction).toLowerCase();
  if (lowerCaseDirection === 'sent' || lowerCaseDirection === 'bot') {
    return 'flex-end'; // Alinha à direita
  }
  return 'flex-start'; // Alinha à esquerda
};

const getBubbleColor = (direction) => {
  const lowerCaseDirection = String(direction).toLowerCase();
  if (lowerCaseDirection === 'sent') return '#007bff'; // Azul para mensagens enviadas
  if (lowerCaseDirection === 'bot') return '#28a745'; // Verde para bot
  return '#6c757d'; // Cinza para mensagens recebidas
};

const getTextColor = (direction) => {
  const lowerCaseDirection = String(direction).toLowerCase();
  if (lowerCaseDirection === 'sent' || lowerCaseDirection === 'bot') {
    return '#ffffff'; // Texto branco para mensagens enviadas e do bot
  }
  return '#ffffff'; // Texto branco para mensagens recebidas também
};

function ChatViewer({ messages }) {
  const scrollRef = useRef(null);

  // Efeito para rolar para o final quando novas mensagens chegam
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [messages]);

  // Se não há mensagens, mostra uma mensagem amigável
  if (!messages || messages.length === 0) {
    return (
      <Box 
        sx={{ 
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          backgroundColor: '#f8f9fa'
        }}
      >
        <Typography variant="body1" color="text.secondary" textAlign="center">
          Nenhuma mensagem ainda.
          <br />
          Inicie uma conversa digitando uma mensagem abaixo.
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      ref={scrollRef}
      sx={{ 
        flex: 1,
        overflowY: 'auto', 
        p: 2, 
        backgroundColor: '#f8f9fa',
        // Customização da barra de rolagem
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#c1c1c1',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#a8a8a8',
        },
      }}
    >
      {messages.map((msg, index) => {
        const cleanContent = msg.content ? msg.content.replace(/\u00A0/g, ' ') : '';
        const showTimestamp = index === 0 || 
          (index > 0 && new Date(msg.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() > 300000); // 5 minutos
        
        return (
          <React.Fragment key={msg.id}>
            {/* Timestamp separador (se necessário) */}
            {showTimestamp && (
              <Box sx={{ textAlign: 'center', my: 2 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    px: 2,
                    py: 0.5,
                    borderRadius: '12px',
                    color: 'text.secondary'
                  }}
                >
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : ''}
                </Typography>
              </Box>
            )}

            {/* Contêiner de cada linha de mensagem */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: getMessageAlignment(msg.direction),
                mb: 1.5,
                px: 1
              }}
            >
              {/* O balão da mensagem */}
              <Paper 
                elevation={2}
                sx={{
                  p: '12px 16px',
                  borderRadius: '18px',
                  backgroundColor: getBubbleColor(msg.direction),
                  color: getTextColor(msg.direction),
                  maxWidth: '75%',
                  minWidth: '60px',
                  position: 'relative',
                  // Sombra mais suave
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
                  // Pequena animação de entrada
                  animation: 'slideIn 0.3s ease-out',
                  '@keyframes slideIn': {
                    from: {
                      opacity: 0,
                      transform: 'translateY(10px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                <Typography 
                  variant="body1"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    lineHeight: 1.4,
                    fontSize: '0.95rem'
                  }}
                >
                  {cleanContent}
                </Typography>
                
                {/* Timestamp da mensagem */}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block',
                    textAlign: 'right', 
                    fontSize: '0.7rem', 
                    mt: 0.5,
                    opacity: 0.8,
                    color: 'inherit'
                  }}
                >
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) : ''}
                </Typography>
              </Paper>
            </Box>
          </React.Fragment>
        );
      })}
      
      {/* Espaço extra no final para melhor visualização */}
      <Box sx={{ height: '20px' }} />
    </Box>
  );
}

export default ChatViewer;