// src/App.jsx
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import DashboardLayout from './DashboardLayout';
import Login from './pages/Login';
import UpdatePassword from './pages/UpdatePassword';
import { CircularProgress, Box } from '@mui/material';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estado para controlar se estamos no fluxo de reset de palavra-passe
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  useEffect(() => {
    // **LÓGICA CRUCIAL:** Verifica o hash da URL *antes* de qualquer outra coisa.
    if (window.location.hash.includes('type=recovery')) {
      setIsPasswordRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      // Se o utilizador atualizou a palavra-passe, o evento é 'USER_UPDATED'.
      // Neste ponto, limpamos o estado e o hash para voltar ao login normal.
      if (_event === 'USER_UPDATED' && isPasswordRecovery) {
        setIsPasswordRecovery(false);
        // Limpa o token da URL para não entrar em loop
        window.location.replace(window.location.origin);
      }
    });

    // Carregamento inicial da sessão
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isPasswordRecovery]); // Adicionado isPasswordRecovery como dependência

  // Se estiver a carregar a sessão pela primeira vez
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>;
  }

  // **NOVA LÓGICA DE RENDERIZAÇÃO**
  // 1. Prioridade máxima: se for recuperação de palavra-passe, mostra a tela para isso.
  if (isPasswordRecovery) {
    return <UpdatePassword />;
  }

  // 2. Se não houver sessão, mostra a tela de Login.
  if (!session) {
    return <Login />;
  }

  // 3. Se houver sessão (e não for recuperação), mostra o Dashboard.
  // Passamos todos os dados necessários como props para o DashboardLayout
  return (
    <DashboardLoader session={session} />
  );
}

// Componente separado para carregar os dados do dashboard, SÓ QUANDO NECESSÁRIO
function DashboardLoader({ session }) {
    const [pedidosData, setPedidosData] = useState([]);
    const [kpiData, setKpiData] = useState({});
    const [chartData, setChartData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
          // ... (código de fetchData que já tínhamos) ...
          try {
            const hojeInicio = new Date();
            hojeInicio.setHours(0, 0, 0, 0);
            const hojeFim = new Date();
            hojeFim.setHours(23, 59, 59, 999);
            const hojeInicioISO = hojeInicio.toISOString();
            const hojeFimISO = hojeFim.toISOString();

            const [pedidosResult, totalVendasHojeResult, faturamentoHojeResult, chartResult] = await Promise.all([
              supabase.from('purchase').select('*').order('id', { ascending: false }),
              supabase.from('purchase').select('id', { count: 'exact', head: true }).eq('pay', true).gte('created_at', hojeInicioISO).lte('created_at', hojeFimISO),
              supabase.from('purchase').select('value').eq('pay', true).gte('created_at', hojeInicioISO).lte('created_at', hojeFimISO),
              supabase.rpc('get_sales_by_hour')
            ]);

            const results = [pedidosResult, totalVendasHojeResult, faturamentoHojeResult, chartResult];
            for (const result of results) { if (result.error) throw result.error; }

            setPedidosData(pedidosResult.data);
            setKpiData({ totalVendas: totalVendasHojeResult.count || 0, faturamentoTotal: faturamentoHojeResult.data.reduce((sum, row) => sum + (Number(row.value) || 0), 0) });
            setChartData(chartResult.data);
          } catch (fetchError) {
            setError('Não foi possível buscar os dados do dashboard.');
          } finally {
            setLoadingData(false);
          }
        }
        fetchData();
    }, [session]);

    if (loadingData) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><Typography color="error">{error}</Typography></Box>;
    }

    return <DashboardLayout data={pedidosData} kpiData={kpiData} chartData={chartData} />;
}

export default App;