// src/PedidosView.jsx
import React, { useState } from 'react';
import PurchasesTable from './PurchasesTable';
import DetailsModal from './DetailsModal';

function PedidosView({ data }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <>
      <PurchasesTable data={data} onViewDetails={handleViewDetails} />
      <DetailsModal
        item={selectedItem}
        open={!!selectedItem}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default PedidosView;