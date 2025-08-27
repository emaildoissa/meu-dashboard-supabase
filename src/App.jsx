// src/App.jsx
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import DashboardLayout from './DashboardLayout';
import { CircularProgress, Box, Typography } from '@mui/material';

function App() {
  const [pedidosData, setPedidosData] = useState([]);
  const [kpiData, setKpiData] = useState({});
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const dia = String(hoje.getDate()).padStart(2, '0');
        const hojeDateString = `${ano}-${mes}-${dia}`;

        const [
          pedidosResult,
          totalVendasHojeResult,
          faturamentoHojeResult,
          chartResult
        ] = await Promise.all([
          supabase.from('purchase').select('*').order('id', { ascending: false }),
          supabase.from('purchase').select('id', { count: 'exact', head: true }).eq('pay', true).gte('created_at', `${hojeDateString}T00:00:00.000Z`).lte('created_at', `${hojeDateString}T23:59:59.999Z`),
          supabase.from('purchase').select('value').eq('pay', true).gte('created_at', `${hojeDateString}T00:00:00.000Z`).lte('created_at', `${hojeDateString}T23:59:59.999Z`),
          supabase.rpc('get_sales_by_hour')
        ]);

        const results = [pedidosResult, totalVendasHojeResult, faturamentoHojeResult, chartResult];
        for (const result of results) {
          if (result.error) throw result.error;
        }

        const totalVendas = totalVendasHojeResult.count || 0;
        const faturamentoTotal = faturamentoHojeResult.data.reduce((sum, row) => sum + (Number(row.value) || 0), 0);

        setPedidosData(pedidosResult.data);
        setKpiData({ totalVendas, faturamentoTotal });
        setChartData(chartResult.data);

      } catch (fetchError) {
        setError('Não foi possível buscar os dados do dashboard.');
        console.error("--- ERRO DETALHADO ---:", fetchError);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={50} />
        <Typography>Carregando dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <div className="App">
      <DashboardLayout 
        data={pedidosData} 
        kpiData={kpiData}
        chartData={chartData}
      />
    </div>
  );
}

export default App;