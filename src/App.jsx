// src/App.jsx - Versão Final com Carregamento em Tela Cheia e Verificação de Erro Completa

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
        const [
            pedidosResult, 
            totalVendasResult, 
            faturamentoResult, 
            chartResult
        ] = await Promise.all([
          supabase.from('purchase').select('*').order('id', { ascending: false }),
          supabase.from('purchase').select('id', { count: 'exact', head: true }),
          supabase.from('purchase').select('value').eq('pay', true),
          supabase.rpc('get_sales_by_hour') 
        ]);

        // --- CORREÇÃO APLICADA AQUI ---
        // Agora verificamos o erro de TODAS as 4 buscas.
        if (pedidosResult.error || totalVendasResult.error || faturamentoResult.error || chartResult.error) {
          // Se qualquer uma delas der erro, jogamos o erro para o 'catch'.
          throw pedidosResult.error || totalVendasResult.error || faturamentoResult.error || chartResult.error;
        }

        const totalVendas = totalVendasResult.count;
        const faturamentoTotal = faturamentoResult.data.reduce((sum, row) => sum + (Number(row.value) || 0), 0);
        
        setPedidosData(pedidosResult.data);
        setKpiData({ totalVendas, faturamentoTotal });
        setChartData(chartResult.data);

      } catch (fetchError) {
        setError('Não foi possível buscar os dados.'); 
        console.error("Erro detalhado:", fetchError); // Adicionado para facilitar o debug
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // O resto do componente continua o mesmo...
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
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