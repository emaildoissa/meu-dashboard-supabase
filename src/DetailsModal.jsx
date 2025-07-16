// src/DetailsModal.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
} from '@mui/material';

// Função para formatar o valor como moeda brasileira (BRL)
const formatCurrency = (value) => {
  // Adiciona uma verificação para garantir que o valor não é nulo/indefinido
  if (value == null) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

function DetailsModal({ item, open, onClose }) {
  // Se não houver item, o modal não renderiza nada para evitar erros
  if (!item) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Detalhes da Compra #{item.id}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Descrição</Typography>
          <Typography variant="body1" color="text.secondary">
            {item.description || 'Não informado'}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1" fontWeight="bold">Valor:</Typography>
          <Typography variant="body1">{formatCurrency(item.valor)}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1" fontWeight="bold">Status:</Typography>
          <Typography variant="body1">{item.payment_status || 'Pending'}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1" fontWeight="bold">Telefone:</Typography>
          <Typography variant="body1">{item.phone || 'Não informado'}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" fontWeight="bold">Invoice Number:</Typography>
          <Typography variant="body1">{item.invoice_number || 'N/A'}</Typography>
        </Box>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DetailsModal;