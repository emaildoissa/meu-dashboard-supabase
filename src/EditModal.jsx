// src/EditModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Avatar,
  IconButton,
  Divider,
  InputAdornment,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import PaymentIcon from '@mui/icons-material/Payment';
import SaveIcon from '@mui/icons-material/Save';

function EditModal({ item, open, onClose, onSave }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Quando o 'item' (prop) mudar, atualiza o estado do nosso formulário
  useEffect(() => {
    setFormData(item || {});
    setErrors({});
  }, [item]);

  // Validação dos campos
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    
    if (!formData.value || formData.value <= 0) {
      newErrors.value = 'Valor deve ser maior que zero';
    }
    
    if (!formData.payment_stat?.trim()) {
      newErrors.payment_stat = 'Status é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para lidar com mudanças nos campos de texto
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Remove erro do campo quando usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Função para lidar com o Switch (booleano)
  const handleSwitchChange = (event) => {
    const { name, checked } = event.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSaveClick = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  // Se não houver item, não renderiza nada para evitar erros
  if (!item) {
    return null;
  }

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
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
              <EditIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="700">
                Editar Pedido #{item.id}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Atualize as informações do pedido
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
            label="Modo de Edição"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: 'white',
              fontWeight: 600
            }}
          />
        </Box>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <Box 
            component="form" 
            noValidate 
            autoComplete="off" 
            sx={{ 
              '& .MuiTextField-root': { mb: 3 }
            }}
          >
            {/* Descrição */}
            <TextField
              fullWidth
              label="Descrição do Produto"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#f093fb',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#f093fb',
                  },
                }
              }}
            />

            {/* Valor */}
            <TextField
              fullWidth
              label="Valor do Pedido"
              name="value"
              type="number"
              value={formData.value || 0}
              onChange={handleChange}
              error={!!errors.value}
              helperText={errors.value}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#f093fb',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#f093fb',
                  },
                }
              }}
            />

            {/* Status */}
            <TextField
              fullWidth
              label="Status do Pagamento"
              name="payment_stat"
              value={formData.payment_stat || ''}
              onChange={handleChange}
              error={!!errors.payment_stat}
              helperText={errors.payment_stat}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PaymentIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#f093fb',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#f093fb',
                  },
                }
              }}
            />

            <Divider sx={{ my: 2 }} />

            {/* Switch para pedido pago */}
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                backgroundColor: formData.pay ? '#f0f9ff' : '#f9fafb'
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.pay || false}
                    onChange={handleSwitchChange}
                    name="pay"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#f093fb',
                        '&:hover': {
                          backgroundColor: 'rgba(240, 147, 251, 0.04)',
                        },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#f093fb',
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle1" fontWeight="600">
                      Pedido Pago
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Marque se o pagamento foi confirmado
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions 
        sx={{ 
          p: 3, 
          pt: 0,
          gap: 2
        }}
      >
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
          onClick={handleSaveClick}
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{
            borderRadius: '12px',
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            boxShadow: '0 4px 12px rgba(240, 147, 251, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #e879f9 0%, #ef4444 100%)',
              boxShadow: '0 6px 16px rgba(240, 147, 251, 0.5)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Salvar Alterações
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditModal;