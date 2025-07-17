// src/KpiCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

const formatCurrency = (value = 0) => {
    // Usando a versão sem casas decimais que você preferiu
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
    }).format(value);
};

function KpiCard({ title, value, icon, format = 'number', color = 'primary.main' }) {
  const displayValue = format === 'currency' ? formatCurrency(value) : (value || 0);

  return (
    <Card sx={{ height: '100%' }} elevation={2}>
      <CardContent>
        {/* Usamos Flexbox para alinhar o ícone e o texto lado a lado */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Caixa para o texto */}
          <Box>
            <Typography color="text.secondary" variant="body1">
              {title}
            </Typography>
            <Typography variant="h4" component="p" fontWeight="600">
              {displayValue}
            </Typography>
          </Box>

          {/* O Avatar cria o círculo colorido para o ícone */}
          <Avatar 
            sx={{ 
                backgroundColor: color, 
                color: 'white',
                height: 56, 
                width: 56 
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

export default KpiCard;