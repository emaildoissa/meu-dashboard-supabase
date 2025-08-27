// src/PurchasesTable.jsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

const formatCurrency = (value) => {
  if (value == null || isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const StatusChip = ({ status }) => {
    let color = 'default', label = status ? String(status) : 'Indefinido';
    const lowerCaseStatus = label.toLowerCase();
    if (lowerCaseStatus === 'pago') { color = 'success'; label = 'Pago'; }
    else if (lowerCaseStatus === 'em analise' || lowerCaseStatus === 'em análise') { color = 'warning'; label = 'Em Análise'; }
    else if (lowerCaseStatus === 'pendente') { color = 'info'; label = 'Pendente'; }
    return <Chip label={label} color={color} size="small" />;
};

// Adicionamos a nova prop onRowClick
function PurchasesTable({ data, onViewDetails, onEditItem, onDeleteItem, onRowClick }) {
  if (!data || data.length === 0) return <p>Nenhuma compra encontrada.</p>;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="purchases table">
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Valor</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Telefone</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              hover // Adiciona efeito visual ao passar o mouse
              onClick={() => onRowClick(row)} // *** AÇÃO ADICIONADA AQUI ***
              sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{`#${row.id}`}</TableCell>
              <TableCell>{formatCurrency(row.value)}</TableCell>
              <TableCell><StatusChip status={row.pay ? 'Pago' : row.status} /></TableCell>
              <TableCell>{row.phone}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell align="right">
                <Tooltip title="Ver Detalhes"><IconButton onClick={(e) => { e.stopPropagation(); onViewDetails(row); }}><VisibilityIcon /></IconButton></Tooltip>
                <Tooltip title="Editar"><IconButton onClick={(e) => { e.stopPropagation(); onEditItem(row); }}><EditIcon /></IconButton></Tooltip>
                <Tooltip title="Excluir"><IconButton onClick={(e) => { e.stopPropagation(); onDeleteItem(row); }}><DeleteIcon /></IconButton></Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PurchasesTable;