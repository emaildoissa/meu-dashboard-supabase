// src/ChatViewer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

function ChatViewer() {
  const [messages, setMessages] = useState([]);
  const listEndRef = useRef(null); // Referência para o final da lista

  // Efeito para conectar e ouvir o WebSocket
  useEffect(() => {
    // Conecta-se ao seu servidor "ponte" que está rodando localmente
    const ws = new WebSocket('ws://localhost:3001');

    ws.onopen = () => {
      console.log('Conectado ao servidor de chat!');
    };

    // Onde a mágica acontece: recebe a mensagem do backend
    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      // Adiciona a nova mensagem à lista de mensagens existentes
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    ws.onclose = () => {
      console.log('Desconectado do servidor de chat.');
    };

    // Limpeza: fecha a conexão quando o componente é "desmontado"
    return () => {
      ws.close();
    };
  }, []); // O array vazio [] garante que este efeito rode apenas uma vez

  // Efeito para rolar a lista para baixo a cada nova mensagem
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  return (
    <Paper elevation={3} sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid #eee' }}>
        Chat em Tempo Real 📡
      </Typography>
      
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index}>
              <ListItemText 
                primary={msg.text} 
                secondary={`De: ${msg.from.split('@')[0]} - ${new Date(msg.timestamp).toLocaleTimeString()}`} 
              />
            </ListItem>
          ))}
          {/* Adiciona um elemento invisível no final da lista para a rolagem */}
          <div ref={listEndRef} /> 
        </List>

        {messages.length === 0 && (
            <Typography sx={{ p: 2, color: 'text.secondary', textAlign: 'center' }}>
              Aguardando novas mensagens...
            </Typography>
        )}
      </Box>
    </Paper>
  );
}

export default ChatViewer;