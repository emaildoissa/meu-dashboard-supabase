// src/PedidosChatView.jsx
import React, { useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import PurchasesTable from './PurchasesTable';
import ChatView from './ChatView'; // Vamos reutilizar o ChatView aqui
import DetailsModal from './DetailsModal';
import EditModal from './EditModal';
import { supabase } from './supabaseClient';
import { Snackbar, Alert } from '@mui/material';

function PedidosChatView({ data: initialData }) {
  const [pedidos, setPedidos] = useState(initialData);
  const [selectedPedido, setSelectedPedido] = useState(null);

  const [detailsItem, setDetailsItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleRowClick = (pedido) => {
    setSelectedPedido(pedido);
  };

  // Funções de controle dos modais
  const handleViewDetails = (item) => setDetailsItem(item);
  const handleCloseDetailsModal = () => setDetailsItem(null);
  const handleEditItem = (item) => setEditingItem(item);
  const handleCloseEditModal = () => setEditingItem(null);

  const handleSaveItem = async (updatedItem) => {
    const { error } = await supabase
      .from('purchase')
      .update({ description: updatedItem.description, value: Number(updatedItem.value), pay: updatedItem.pay, payment_stat: updatedItem.payment_stat })
      .eq('id', updatedItem.id);

    if (error) {
      showNotification(`Erro ao atualizar: ${error.message}`, 'error');
    } else {
      setPedidos(pedidos.map(p => (p.id === updatedItem.id ? updatedItem : p)));
      showNotification('Pedido atualizado com sucesso!');
      handleCloseEditModal();
    }
  };

  const handleDeleteItem = async (itemToDelete) => {
    if (!window.confirm(`Tem certeza que deseja excluir o pedido #${itemToDelete.id}?`)) return;

    const { error } = await supabase.from('purchase').delete().eq('id', itemToDelete.id);

    if (error) {
      showNotification(`Erro ao excluir: ${error.message}`, 'error');
    } else {
      setPedidos(pedidos.filter(p => p.id !== itemToDelete.id));
      if (selectedPedido?.id === itemToDelete.id) {
        setSelectedPedido(null);
      }
      showNotification('Pedido excluído com sucesso!');
    }
  };

  return (
    <>
      <Grid container spacing={0} sx={{ height: '100%' }}>
        {/* Coluna da Esquerda: Tabela de Pedidos */}
        <Grid item xs={12} md={7} sx={{ height: '100%', overflowY: 'auto', borderRight: { md: '1px solid #e0e0e0' } }}>
          <Paper elevation={0} sx={{ p: { xs: 1, sm: 2 }, borderRadius: 0, height: '100%' }}>
            <PurchasesTable
              data={pedidos}
              onRowClick={handleRowClick}
              onViewDetails={handleViewDetails}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
            />
          </Paper>
        </Grid>

        {/* Coluna da Direita: Chat */}
        <Grid item xs={12} md={5} sx={{ height: '100%', display: { xs: selectedPedido ? 'block' : 'none', md: 'block' } }}>
          {selectedPedido ? (
            <ChatView preselectedPhone={`${selectedPedido.phone}@s.whatsapp.net`} />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', p: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" color="text.secondary" textAlign="center">
                Selecione um pedido na tabela para ver a conversa.
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Modais */}
      <DetailsModal item={detailsItem} open={!!detailsItem} onClose={handleCloseDetailsModal} />
      <EditModal item={editingItem} open={!!editingItem} onClose={handleCloseEditModal} onSave={handleSaveItem} />

      {/* Notificações */}
      <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification(prev => ({ ...prev, open: false }))}>
        <Alert onClose={() => setNotification(prev => ({ ...prev, open: false }))} severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default PedidosChatView;