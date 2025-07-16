// src/ChatView.jsx
import React from 'react';
import ChatViewer from './ChatViewer';
import { Box } from '@mui/material';

function ChatView() {
  return (
    // Adicionamos um Box para controlar melhor o tamanho e alinhamento
    <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
      <ChatViewer />
    </Box>
  );
}

export default ChatView;