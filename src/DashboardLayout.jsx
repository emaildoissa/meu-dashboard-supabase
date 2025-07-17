// src/DashboardLayout.jsx
import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, CircularProgress } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ChatIcon from '@mui/icons-material/Chat';
import DashboardView from './DashboardView';
import PedidosView from './PedidosView';
import ChatView from './ChatView';

const drawerWidth = 240;

// Agora ele recebe 'loading' e 'error'
function DashboardLayout({ data, kpiData, loading, error }) {
  const [activeView, setActiveView] = useState('dashboard');

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const drawer = (
    <div>
      <Toolbar><Typography variant="h6" noWrap>Menu</Typography></Toolbar>
      <List>
        <ListItem disablePadding><ListItemButton selected={activeView === 'dashboard'} onClick={() => handleViewChange('dashboard')}><ListItemIcon><DashboardIcon /></ListItemIcon><ListItemText primary="Dashboard" /></ListItemButton></ListItem>
        <ListItem disablePadding><ListItemButton selected={activeView === 'pedidos'} onClick={() => handleViewChange('pedidos')}><ListItemIcon><ShoppingCartIcon /></ListItemIcon><ListItemText primary="Pedidos" /></ListItemButton></ListItem>
        <ListItem disablePadding><ListItemButton selected={activeView === 'chat'} onClick={() => handleViewChange('chat')}><ListItemIcon><ChatIcon /></ListItemIcon><ListItemText primary="Chat" /></ListItemButton></ListItem>
      </List>
    </div>
  );

  // Componente para centralizar o status (loading ou erro)
  const StatusDisplay = ({ children }) => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 128px)' }}>
      {children}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' } }}>
        {drawer}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: (theme) => theme.palette.grey[100], minHeight: '100vh' }}>
        <Toolbar /> 
        
        {/* LÓGICA DE EXIBIÇÃO CORRETA */}
        {loading ? (
          <StatusDisplay>
            <CircularProgress />
          </StatusDisplay>
        ) : error ? (
          <StatusDisplay>
            <Typography color="error" variant="h6">{error}</Typography>
          </StatusDisplay>
        ) : (
          // Se não houver erro e não estiver carregando, mostra o conteúdo normal
          <>
            {activeView === 'dashboard' && <DashboardView kpiData={kpiData} />}
            {activeView === 'pedidos' && <PedidosView data={data} />}
            {activeView === 'chat' && <ChatView />}
          </>
        )}
      </Box>
    </Box>
  );
}

export default DashboardLayout;