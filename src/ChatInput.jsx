// src/ChatInput.jsx
import React, { useState, useRef } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Paper,
  CircularProgress,
  Tooltip,
  Alert,
  Collapse
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

function ChatInput({ onSendMessage, disabled = false, placeholder = "Digite uma mensagem..." }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const textFieldRef = useRef(null);

  const handleSend = async () => {
    if (!message.trim() || sending) return;

    const messageToSend = message.trim();
    setMessage(''); // Limpa o campo imediatamente
    setSending(true);
    setError(null);

    try {
      await onSendMessage(messageToSend);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setError('Erro ao enviar mensagem. Tente novamente.');
      setMessage(messageToSend); // Restaura a mensagem em caso de erro
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
    if (error) setError(null); // Limpa erro quando usuário começa a digitar
  };

  return (
    <Box sx={{ p: 2, backgroundColor: 'white', borderTop: '1px solid #e0e0e0' }}>
      {/* Alert de erro */}
      <Collapse in={!!error}>
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      </Collapse>

      <Paper 
        elevation={1}
        sx={{ 
          display: 'flex', 
          alignItems: 'flex-end',
          p: 1,
          backgroundColor: '#f8f9fa',
          borderRadius: '24px',
          border: '1px solid #e0e0e0',
          '&:focus-within': {
            borderColor: 'primary.main',
            backgroundColor: 'white'
          }
        }}
      >
        {/* Botão de Emoji (futuro) */}
        <Tooltip title="Emojis (em breve)">
          <IconButton 
            size="small" 
            disabled
            sx={{ color: 'text.secondary', mr: 0.5 }}
          >
            <EmojiEmotionsIcon />
          </IconButton>
        </Tooltip>

        {/* Campo de texto */}
        <TextField
          ref={textFieldRef}
          multiline
          maxRows={4}
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled || sending}
          variant="standard"
          InputProps={{
            disableUnderline: true,
          }}
          sx={{
            flex: 1,
            '& .MuiInputBase-input': {
              padding: '8px 12px',
              fontSize: '0.95rem',
              lineHeight: 1.4,
              '&::placeholder': {
                color: 'text.secondary',
                opacity: 1
              }
            }
          }}
        />

        {/* Botão de anexo (futuro) */}
        <Tooltip title="Anexar arquivo (em breve)">
          <IconButton 
            size="small" 
            disabled
            sx={{ color: 'text.secondary', mx: 0.5 }}
          >
            <AttachFileIcon />
          </IconButton>
        </Tooltip>

        {/* Botão de enviar */}
        <Tooltip title={message.trim() ? "Enviar mensagem (Enter)" : "Digite uma mensagem"}>
          <span>
            <IconButton
              onClick={handleSend}
              disabled={!message.trim() || disabled || sending}
              sx={{
                backgroundColor: message.trim() && !sending ? 'primary.main' : 'grey.300',
                color: 'white',
                width: 40,
                height: 40,
                ml: 0.5,
                '&:hover': {
                  backgroundColor: message.trim() && !sending ? 'primary.dark' : 'grey.300',
                },
                '&.Mui-disabled': {
                  backgroundColor: 'grey.300',
                  color: 'grey.500'
                }
              }}
            >
              {sending ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SendIcon fontSize="small" />
              )}
            </IconButton>
          </span>
        </Tooltip>
      </Paper>

      {/* Dica de uso */}
      <Box sx={{ mt: 1, textAlign: 'center' }}>
        <Box 
          component="span" 
          sx={{ 
            fontSize: '0.75rem', 
            color: 'text.secondary',
            fontStyle: 'italic'
          }}
        >
          Pressione Enter para enviar, Shift+Enter para nova linha
        </Box>
      </Box>
    </Box>
  );
}

export default ChatInput;