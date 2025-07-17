// src/DashboardView.jsx
import React from 'react';
import { Grid, Typography } from '@mui/material';
import KpiCard from './KpiCard';

// Importe os ícones
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';

function DashboardView({ kpiData }) {
  return (
    <>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Visão Geral do Negócio
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={4}>
          <KpiCard
            title="Faturamento Total"
            value={kpiData.faturamentoTotal}
            format="currency"
            icon={<AttachMoneyIcon />}
            color="success.main" // Cor verde para dinheiro
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <KpiCard
            title="Total de Vendas"
            value={kpiData.totalVendas}
            icon={<PointOfSaleIcon />}
            color="primary.main" // Cor azul padrão
          />
        </Grid>
        {/* Você pode adicionar um terceiro card aqui no futuro */}
        {/* <Grid item xs={12} sm={6} lg={4}>
          <KpiCard
            title="Novos Clientes"
            value={7} // Exemplo
            icon={<PersonAddIcon />}
            color="warning.main" // Cor laranja
          />
        </Grid> 
        */}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12}>
            {/* Aqui entrará o Gráfico de Vendas no futuro */}
        </Grid>
      </Grid>
    </>
  );
}

export default DashboardView;