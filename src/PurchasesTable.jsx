import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Função para formatar o valor como moeda brasileira (BRL)
const formatCurrency = (value) => {
  // Adicionando uma verificação para garantir que o valor é um número
  if (value == null || isNaN(value)) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Componente para o Status (agora mais inteligente)
const StatusChip = ({ status }) => {
    let color = 'default';
    let label = status ? String(status) : 'Indefinido';

    const lowerCaseStatus = label.toLowerCase();

    if (lowerCaseStatus === 'pago') {
        color = 'success';
        label = 'Pago';
    } else if (lowerCaseStatus === 'em analise' || lowerCaseStatus === 'em análise') {
        color = 'warning';
        label = 'Em Análise';
    } else if (lowerCaseStatus === 'pendente') {
        color = 'info';
        label = 'Pendente';
    }

    return <Chip label={label} color={color} size="small" />;
};

// A função agora recebe 'onViewDetails' para o modal funcionar
function PurchasesTable({ data, onViewDetails }) {
  if (!data || data.length === 0) {
    return <p>Nenhuma compra encontrada.</p>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="purchases table">
        {/* CABEÇALHO CORRIGIDO: Apenas uma coluna "Status" */}
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

        {/* CORPO DA TABELA CORRIGIDO */}
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                #{row.id}
              </TableCell>
              <TableCell>{formatCurrency(row.value)}</TableCell>

              {/* LÓGICA DE STATUS CORRIGIDA E UNIFICADA EM UMA ÚNICA CÉLULA */}
              <TableCell>
                {/* Verifica a coluna 'pago'. Se for 'true', mostra 'Pago'.
                  Senão, mostra o que estiver na coluna 'status'.
                */}
                <StatusChip status={row.pay ? 'Pago' : row.status} />
              </TableCell>

              <TableCell>{row.phone}</TableCell>
              <TableCell>{row.description}</TableCell>
              
              {/* AÇÕES CORRIGIDAS para usar a função do modal */}
              <TableCell align="right">
                <Tooltip title="Ver Detalhes">
                    <IconButton onClick={() => onViewDetails(row)}>
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

// CORRIGIDO: Removido o texto extra após o export
export default PurchasesTable;