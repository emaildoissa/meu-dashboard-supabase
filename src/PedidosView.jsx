// src/PedidosView.jsx
import React, { useState, useEffect } from 'react';
import PurchasesTable from './PurchasesTable';
import DetailsModal from './DetailsModal';
import EditModal from './EditModal';
import { supabase } from './supabaseClient';
import { Snackbar, Alert } from '@mui/material'; // Importar componentes de notificação

function PedidosView({ data: initialData }) {
  const [pedidos, setPedidos] = useState(initialData);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  // Sincroniza o estado se os dados iniciais mudarem
  useEffect(() => {
    setPedidos(initialData);
  }, [initialData]);

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleViewDetails = (item) => setSelectedItem(item);
  const handleCloseModal = () => setSelectedItem(null);
  const handleEditItem = (item) => setEditingItem(item);
  const handleCloseEditModal = () => setEditingItem(null);

  // --- MELHORIA: ATUALIZAÇÃO EM TEMPO REAL ---
  const handleSaveItem = async (updatedItem) => {
    const { error } = await supabase
      .from('purchase')
      .update({
        description: updatedItem.description,
        value: Number(updatedItem.value),
        pay: updatedItem.pay,
        payment_stat: updatedItem.payment_stat
      })
      .eq('id', updatedItem.id);

    if (error) {
      showNotification(`Erro ao atualizar: ${error.message}`, 'error');
    } else {
      // Atualiza o estado localmente, sem recarregar a página
      setPedidos(pedidos.map(p => (p.id === updatedItem.id ? updatedItem : p)));
      showNotification('Pedido atualizado com sucesso!');
      handleCloseEditModal();
    }
  };

  // --- MELHORIA: DELEÇÃO EM TEMPO REAL ---
  const handleDeleteItem = async (itemToDelete) => {
    const isConfirmed = window.confirm(`Tem certeza que deseja excluir o pedido #${itemToDelete.id}?`);
    if (!isConfirmed) return;

    const { error } = await supabase
      .from('purchase')
      .delete()
      .eq('id', itemToDelete.id);

    if (error) {
      showNotification(`Erro ao excluir: ${error.message}`, 'error');
    } else {
      // Remove o item do estado local, sem recarregar a página
      setPedidos(pedidos.filter(p => p.id !== itemToDelete.id));
      showNotification('Pedido excluído com sucesso!');
    }
  };

  return (
    <>
      <PurchasesTable 
        data={pedidos} // Usa o estado local em vez da prop inicial
        onViewDetails={handleViewDetails} 
        onEditItem={handleEditItem} 
        onDeleteItem={handleDeleteItem} 
      />

      <DetailsModal
        item={selectedItem}
        open={!!selectedItem}
        onClose={handleCloseModal}
      />

      <EditModal 
        item={editingItem}
        open={!!editingItem}
        onClose={handleCloseEditModal}
        onSave={handleSaveItem}
      />

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

export default PedidosView;