// src/PedidosView.jsx
import React, { useState } from 'react';
import PurchasesTable from './PurchasesTable';
import DetailsModal from './DetailsModal';
import { supabase } from './supabaseClient';
import EditModal from './EditModal';


function PedidosView({ data }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };
const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleCloseEditModal = () => {
    setEditingItem(null);
  };

  const handleSaveItem = async (updatedItem) => {
    // Lógica para salvar no Supabase
    const { error } = await supabase
      .from('purchase')
      .update({ 
        description: updatedItem.description,
        value: Number(updatedItem.value), // Garante que o valor seja um número
        pay: updatedItem.pay,
        payment_stat: updatedItem.payment_stat
       })
      .eq('id', updatedItem.id);

    if (error) {
      alert('Erro ao atualizar o pedido: ' + error.message);
    } else {
      alert('Pedido atualizado com sucesso!');
      // Fecha o modal
      handleCloseEditModal();
      // A forma mais simples de ver a atualização é recarregar a página.
      // Podemos melhorar isso depois para ser mais dinâmico.
      window.location.reload();
    }
  };
  const handleDeleteItem = async (itemToDelete) => {
    // Usamos a confirmação padrão do navegador, que é simples e eficaz.
    const isConfirmed = window.confirm(`Tem certeza que deseja excluir o pedido #${itemToDelete.id}? Esta ação não pode ser desfeita.`);

    // Se o usuário não confirmar, a função para aqui.
    if (!isConfirmed) {
      return;
    }

    // Lógica para deletar no Supabase
    const { error } = await supabase
      .from('purchase')
      .delete()
      .eq('id', itemToDelete.id);

    if (error) {
      alert('Erro ao excluir o pedido: ' + error.message);
    } else {
      alert('Pedido excluído com sucesso!');
      // Recarrega a página para mostrar a lista atualizada.
      window.location.reload();
    }
  };
  return (
    <>
      <PurchasesTable data={data} 
      onViewDetails={handleViewDetails} 
      onEditItem={handleEditItem} 
      onDeleteItem={handleDeleteItem} />

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
        onDeleteItem={handleDeleteItem}
      />
    </>
  );
}

export default PedidosView;