// src/ConversationList.jsx
import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Typography, 
  Paper, 
  Avatar, 
  ListItemAvatar,
  Box,
  Divider
} from '@mui/material';

const formatConversationId = (id) => {
  if (!id) return '...';
  return id.split('@')[0];
};

const getInitials = (id) => {
  if (!id) return '?';
  const cleanId = id.split('@')[0];
  return cleanId.slice(-2); 
};

const formatSnippet = (snippet) => {
  if (!snippet) return 'Clique para ver as mensagens';
  return snippet.length > 40 ? `${snippet.substring(0, 37)}...` : snippet;
};

function ConversationList({ conversations, onSelectConversation, activeConversationId }) {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: 0
      }}
    >
      {/* Cabeçalho */}
      <Box 
        sx={{ 
          p: 2, 
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#fafafa'
        }}
      >
        <Typography variant="h6" fontWeight="600" color="text.primary">
          Conversas
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {conversations.length} conversa{conversations.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Lista de Conversas */}
      <List 
        sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          p: 0,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
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
        {conversations.length === 0 ? (
          <Box 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              color: 'text.secondary'
            }}
          >
            <Typography variant="body2">
              Nenhuma conversa disponível
            </Typography>
          </Box>
        ) : (
          conversations.map((convo, index) => (
            <React.Fragment key={convo.conversation_id}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={activeConversationId === convo.conversation_id}
                  onClick={() => onSelectConversation(convo.conversation_id)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                      },
                      '& .MuiListItemText-primary': {
                        color: 'primary.dark',
                        fontWeight: 600,
                      },
                      '& .MuiAvatar-root': {
                        backgroundColor: 'primary.main',
                      }
                    },
                    '&:hover': {
                      backgroundColor: 'grey.50',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        bgcolor: activeConversationId === convo.conversation_id 
                          ? 'primary.main' 
                          : 'grey.400',
                        color: 'white',
                        width: 40,
                        height: 40,
                        fontSize: '0.875rem',
                        fontWeight: 600
                      }}
                    >
                      {getInitials(convo.conversation_id)}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText 
                    primary={
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: activeConversationId === convo.conversation_id ? 600 : 500,
                          color: activeConversationId === convo.conversation_id 
                            ? 'primary.dark' 
                            : 'text.primary',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {formatConversationId(convo.conversation_id)}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'block',
                          mt: 0.25
                        }}
                      >
                        {formatSnippet(convo.last_message_snippet)}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
              {index < conversations.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))
        )}
      </List>
    </Paper>
  );
}

export default ConversationList;