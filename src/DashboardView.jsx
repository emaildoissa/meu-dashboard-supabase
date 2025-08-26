// src/DashboardView.jsx
import React from 'react';
import { Grid, Typography, Box, Paper } from '@mui/material';
import KpiCard from './KpiCard';
import SalesChart from './SalesChart'; 
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

function DashboardView({ kpiData, chartData }) {
  // Calcula algumas métricas adicionais
  const averageOrderValue = kpiData.totalVendas > 0 
    ? kpiData.faturamentoTotal / kpiData.totalVendas 
    : 0;

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            color: 'text.primary',
            mb: 1
          }}
        >
          Visão Geral do Negócio
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ fontSize: '1.1rem' }}
        >
          Acompanhe o desempenho das suas vendas em tempo real
        </Typography>
      </Box>
      
      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={4}>
          <KpiCard
            title="Faturamento Total"
            value={kpiData.faturamentoTotal}
            format="currency"
            icon={<AttachMoneyIcon />}
            color="success.main"
            gradient="linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={4}>
          <KpiCard
            title="Total de Vendas"
            value={kpiData.totalVendas}
            icon={<PointOfSaleIcon />}
            color="primary.main"
            gradient="linear-gradient(135deg, #2196f3 0%, #1565c0 100%)"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={4}>
          <KpiCard
            title="Ticket Médio"
            value={averageOrderValue}
            format="currency"
            icon={<TrendingUpIcon />}
            color="warning.main"
            gradient="linear-gradient(135deg, #ff9800 0%, #f57c00 100%)"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Sales Chart */}
        <Grid item xs={12}>
          <SalesChart data={chartData} />
        </Grid>

        {/* Additional Stats Cards */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 3, 
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '16px'
            }}
          >
            <Typography variant="h3" fontWeight="700" gutterBottom>
              {kpiData.totalVendas || 0}
            </Typography>
            <Typography variant="h6" align="center">
              Pedidos Realizados
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
              Total de pedidos processados
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 3, 
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              borderRadius: '16px'
            }}
          >
            <Typography variant="h3" fontWeight="700" gutterBottom>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 0,
              }).format(averageOrderValue)}
            </Typography>
            <Typography variant="h6" align="center">
              Valor Médio por Pedido
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
              Ticket médio das vendas
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions or Additional Info */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper 
            elevation={1}
            sx={{ 
              p: 3,
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              border: '1px solid #e9ecef'
            }}
          >
            <Typography variant="h6" gutterBottom color="text.primary" fontWeight="600">
              📊 Resumo do Período
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Maior venda registrada
                </Typography>
                <Typography variant="h6" fontWeight="600">
                  R$ 150,00
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Horário de pico
                </Typography>
                <Typography variant="h6" fontWeight="600">
                  19:00 - 21:00
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Taxa de conversão
                </Typography>
                <Typography variant="h6" fontWeight="600" color="success.main">
                  85%
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardView;