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
  Chip,
  Avatar,
  IconButton,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PhoneIcon from '@mui/icons-material/Phone';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ErrorIcon from '@mui/icons-material/Error';

// Função para formatar o valor como moeda brasileira (BRL)
const formatCurrency = (value) => {
  if (value == null) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Função para obter o ícone e cor do status
const getStatusInfo = (status) => {
  const statusLower = status?.toLowerCase() || '';
  
  if (statusLower.includes('pago') || statusLower.includes('paid')) {
    return {
      icon: <CheckCircleIcon />,
      color: 'success',
      label: 'Pago',
      bgColor: '#e8f5e8'
    };
  } else if (statusLower.includes('análise') || statusLower.includes('pending')) {
    return {
      icon: <PendingIcon />,
      color: 'warning',
      label: 'Em Análise',
      bgColor: '#fff8e1'
    };
  } else {
    return {
      icon: <ErrorIcon />,
      color: 'error',
      label: 'Pendente',
      bgColor: '#ffebee'
    };
  }
};

function DetailsModal({ item, open, onClose }) {
  // Se não houver item, o modal não renderiza nada para evitar erros
  if (!item) {
    return null;
  }

  const statusInfo = getStatusInfo(item.payment_status);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '20px',
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      {/* Header com gradiente */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />

        <DialogTitle 
          sx={{ 
            pb: 0,
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              <ShoppingCartIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="700">
                Detalhes da Compra #{item.id}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Informações completas do pedido
              </Typography>
            </Box>
          </Box>
          
          <IconButton
            onClick={onClose}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box sx={{ px: 3, pb: 3, position: 'relative', zIndex: 1 }}>
          <Chip
            icon={statusInfo.icon}
            label={statusInfo.label}
            color={statusInfo.color}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: 'white',
              fontWeight: 600,
              '& .MuiChip-icon': {
                color: 'white'
              }
            }}
          />
        </Box>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {/* Descrição do produto em destaque */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%)',
            p: 3,
            position: 'relative'
          }}
        >
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              color: '#7c3aed',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <ShoppingCartIcon fontSize="small" />
            Descrição do Produto
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#4c1d95',
              fontSize: '1.1rem',
              lineHeight: 1.6,
              fontWeight: 500
            }}
          >
            {item.description || 'Não informado'}
          </Typography>
        </Box>

        {/* Informações em cards */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {/* Valor */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  borderRadius: '16px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      sx={{
                        backgroundColor: '#dcfce7',
                        color: '#16a34a',
                        width: 40,
                        height: 40
                      }}
                    >
                      <AttachMoneyIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Valor Total
                      </Typography>
                      <Typography variant="h6" fontWeight="700" color="text.primary">
                        {formatCurrency(item.valor)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  borderRadius: '16px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  backgroundColor: statusInfo.bgColor,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      sx={{
                        backgroundColor: `${statusInfo.color}.light`,
                        color: `${statusInfo.color}.main`,
                        width: 40,
                        height: 40
                      }}
                    >
                      {statusInfo.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Status do Pedido
                      </Typography>
                      <Typography variant="h6" fontWeight="700" color="text.primary">
                        {item.payment_status || 'Pending'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Telefone */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  borderRadius: '16px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      sx={{
                        backgroundColor: '#dbeafe',
                        color: '#2563eb',
                        width: 40,
                        height: 40
                      }}
                    >
                      <PhoneIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Telefone de Contato
                      </Typography>
                      <Typography variant="h6" fontWeight="700" color="text.primary">
                        {item.phone || 'Não informado'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Invoice Number */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  borderRadius: '16px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      sx={{
                        backgroundColor: '#fef3c7',
                        color: '#d97706',
                        width: 40,
                        height: 40
                      }}
                    >
                      <ReceiptIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Número da Nota Fiscal
                      </Typography>
                      <Typography variant="h6" fontWeight="700" color="text.primary">
                        {item.invoice_number || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: '12px',
            px: 3,
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            borderColor: '#e5e7eb',
            color: '#6b7280',
            '&:hover': {
              borderColor: '#d1d5db',
              backgroundColor: '#f9fafb'
            }
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{
            borderRadius: '12px',
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DetailsModal;