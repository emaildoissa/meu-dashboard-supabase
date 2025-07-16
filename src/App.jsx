import { useState, useEffect  } from 'react'
import { supabase } from './supabaseClient'
import Dashboard from './Dashboard' 
import { Box, CircularProgress, Typography } from '@mui/material'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DashboardLayout from './DashboardLayout'

function App() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      // Substitua 'sua_tabela' pelo nome da sua tabela no Supabase
      const { data: fetchedData, error: fetchError } = await supabase
        .from('purchase')
        .select('*'); // '*' seleciona todas as colunas
         if (fetchError) {
        setError('Não foi possível buscar os dados.');
        console.error(fetchError);
      } else {
        setData(fetchedData);
      }
      setLoading(false);
    }
    fetchData();
  }, []); // O array vazio [] faz com que o useEffect rode apenas uma vez

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div className="App">
      <DashboardLayout data={data} />
    </div>
  );
}

export default App;