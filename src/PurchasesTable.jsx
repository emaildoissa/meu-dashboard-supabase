// src/PurchasesTable.jsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip, // Usaremos para o "Status"
  IconButton, // Para os botões de ação
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Função para formatar o valor como moeda brasileira (BRL)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Componente para o Status (deixa o código mais limpo)
const StatusChip = ({ status }) => {
    // No seu caso, todos são 'Pending', mas podemos preparar para o futuro
    const color = status === 'Pending' ? 'warning' : 'success';
    return <Chip label={status} color={color} size="small" />;
};


function PurchasesTable({ data }) {
  // Se não houver dados, mostramos uma mensagem
  if (!data || data.length === 0) {
    return <p>Nenhuma compra encontrada.</p>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="purchases table">
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell>ID</TableCell>
            
            <TableCell>Valor</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Telefone</TableCell>
            <TableCell>Pago</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                #{row.id}
              </TableCell>
              {/* Usamos a função de formatação aqui */}
              <TableCell>{formatCurrency(row.valor)}</TableCell>
              <TableCell>
                {/* Aqui usamos o componente de Chip */}
                <StatusChip status={row.payment_status || 'Em Analise'} />
              </TableCell>
              <TableCell>{row.phone}</TableCell>
              
              <TableCell>
                <StatusChip status={row.pay || 'Não'} />
                </TableCell>
                <TableCell>{row.description}</TableCell>
              <TableCell align="right">
                <Tooltip title="Ver Detalhes">
                    <IconButton onClick={() => alert(`Ver item #${row.id}`)}>
                        <VisibilityIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Editar">
                    <IconButton onClick={() => alert(`Editar item #${row.id}`)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PurchasesTable;