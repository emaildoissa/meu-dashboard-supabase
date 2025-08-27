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
  Divider,
  Chip // Adicionado para o status
} from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SmartToyIcon from '@mui/icons-material/SmartToy';

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
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
        <Typography variant="h6" fontWeight="600" color="text.primary">Conversas</Typography>
        <Typography variant="caption" color="text.secondary">
          {conversations.length} conversa{conversations.length !== 1 ? 's' : ''}
        </Typography>
      </Box>
      <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
        {conversations.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="body2">Nenhuma conversa disponível</Typography>
          </Box>
        ) : (
          conversations.map((convo, index) => (
            <React.Fragment key={convo.conversation_id}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={activeConversationId === convo.conversation_id}
                  // *** A CORREÇÃO ESTÁ AQUI: Passamos o objeto 'convo' inteiro ***
                  onClick={() => onSelectConversation(convo)}
                  sx={{ py: 1.5, px: 2, '&.Mui-selected': { backgroundColor: '#f0f4ff' } }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: convo.status === 'human' ? 'warning.main' : 'primary.main' }}>
                      {convo.status === 'human' ? <VpnKeyIcon fontSize="small" /> : getInitials(convo.conversation_id)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={formatConversationId(convo.conversation_id)}
                    secondary={
                      <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <Typography variant="caption" sx={{ color: 'text.secondary', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                           {formatSnippet(convo.last_message_snippet)}
                         </Typography>
                         {convo.status === 'human' && (
                           <Chip label="Humano" color="warning" size="small" sx={{ height: '18px', fontSize: '0.65rem', ml: 1 }} />
                         )}
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
              {index < conversations.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))
        )}
      </List>
    </Paper>
  );
}

export default ConversationList;