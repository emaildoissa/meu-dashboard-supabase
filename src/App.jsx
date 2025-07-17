// src/App.jsx - Versão Final com Carregamento em Tela Cheia

import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import DashboardLayout from './DashboardLayout';
import { CircularProgress, Box, Typography } from '@mui/material';

function App() {
  const [pedidosData, setPedidosData] = useState([]);
  const [kpiData, setKpiData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [pedidosResult, totalVendasResult, faturamentoResult] = await Promise.all([
          supabase.from('purchase').select('*').order('id', { ascending: false }),
          supabase.from('purchase').select('id', { count: 'exact', head: true }),
          supabase.from('purchase').select('value').eq('pay', true)
        ]);

        if (pedidosResult.error || totalVendasResult.error || faturamentoResult.error) {
          throw pedidosResult.error || totalVendasResult.error || faturamentoResult.error;
        }

        const totalVendas = totalVendasResult.count;
        const faturamentoTotal = faturamentoResult.data.reduce((sum, row) => sum + (Number(row.value) || 0), 0);
        
        setPedidosData(pedidosResult.data);
        setKpiData({ totalVendas, faturamentoTotal });

      } catch (fetchError) {
        setError('Não foi possível buscar os dados.'); 
        console.error(fetchError);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // SE ESTIVER CARREGANDO, RETORNA APENAS ESTE BLOCO
  if (loading) {
    return (
      // Este Box é a chave. Ele cria um contêiner de tela cheia e centraliza o conteúdo.
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', // Centraliza na horizontal
          alignItems: 'center',    // Centraliza na vertical
          minHeight: '100vh'        // Garante que o contêiner tenha a altura da tela
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // SE DER ERRO, RETORNA APENAS ESTE BLOCO
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  // SE NÃO ESTIVER CARREGANDO E NÃO HOUVER ERRO, MOSTRA O DASHBOARD
  return (
    <div className="App">
      <DashboardLayout 
        data={pedidosData} 
        kpiData={kpiData}
      />
    </div>
  );
}

export default App;