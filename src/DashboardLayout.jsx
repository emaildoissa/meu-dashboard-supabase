// src/DashboardLayout.jsx
import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, 
  Typography, AppBar, IconButton, Badge, useTheme, useMediaQuery, Chip 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ChatIcon from '@mui/icons-material/Chat'; // Re-adicionado
import RefreshIcon from '@mui/icons-material/Refresh';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';

// Importações das nossas telas e componentes
import PedidosView from './PedidosView'; 
import ChatView from './ChatView';
import KpiCard from './KpiCard'; // Assumindo que KpiCard e SalesChart são importados em um DashboardView
import SalesChart from './SalesChart';
import DashboardView from './DashboardView';

const drawerWidth = 280;

function DashboardLayout({ data, kpiData, chartData }) {
  const [activeView, setActiveView] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleViewChange = (view) => {
    setActiveView(view);
    if (isMobile) setMobileOpen(false);
  };
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // **MUDANÇA AQUI:** O menu "Chat" está de volta
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, view: 'dashboard', description: 'Visão geral dos negócios' },
    { text: 'Pedidos', icon: <ShoppingCartIcon />, view: 'pedidos', description: 'Gerenciar pedidos existentes', badge: data?.length || 0 },
    { text: 'Chat', icon: <ChatIcon />, view: 'chat', description: 'Monitorar conversas ativas' }
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)' }}>
        <Box sx={{ p: 3, color: 'white' }}>
            <Typography variant="h4" fontWeight="700">Dashboard</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>Sistema de Gestão</Typography>
        </Box>
        <List sx={{ flex: 1, px: 2, py: 2 }}>
            {menuItems.map((item) => (
                <ListItem key={item.view} disablePadding>
                    <ListItemButton selected={activeView === item.view} onClick={() => handleViewChange(item.view)} sx={{ borderRadius: '16px', py: 1.5 }}>
                        <ListItemIcon sx={{ color: 'white' }}>
                            {item.badge ? <Badge badgeContent={item.badge} color="error">{item.icon}</Badge> : item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} sx={{ color: 'white' }} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar position="fixed" elevation={0} sx={{ width: { md: `calc(100% - ${drawerWidth}px)` }, ml: { md: `${drawerWidth}px` }, backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <Toolbar>
          {isMobile && (<IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}><MenuIcon /></IconButton>)}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
            {menuItems.find(item => item.view === activeView)?.text}
          </Typography>
          <IconButton color="default"><Badge badgeContent={3} color="error"><NotificationsIcon /></Badge></IconButton>
          <IconButton color="default" onClick={() => window.location.reload()}><RefreshIcon /></IconButton>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' } }}>{drawer}</Drawer>
        <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' } }} open>{drawer}</Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
        <Toolbar />
        <Box sx={{ height: 'calc(100vh - 64px)', p: activeView !== 'chat' ? 3 : 0, overflowY: 'auto', overflowX: 'hidden' }}>
          {/* **MUDANÇA AQUI:** Lógica para renderizar a view correta */}
          {activeView === 'dashboard' && <DashboardView kpiData={kpiData} chartData={chartData} />}
          {activeView === 'pedidos' && <PedidosView data={data} />}
          {activeView === 'chat' && <ChatView />}
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardLayout;