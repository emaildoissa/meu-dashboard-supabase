// src/DashboardLayout.jsx
import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ChatIcon from '@mui/icons-material/Chat';

// Importando os componentes de visão que vamos criar a seguir
import PedidosView from './PedidosView';
import ChatView from './ChatView';

const drawerWidth = 240; // Largura da nossa sidebar

function DashboardLayout({ data }) {
  const [activeView, setActiveView] = useState('pedidos'); // Estado para controlar a visão ativa

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Menu
        </Typography>
      </Toolbar>
      <List>
        <ListItem disablePadding>
          <ListItemButton selected={activeView === 'pedidos'} onClick={() => handleViewChange('pedidos')}>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Pedidos" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton selected={activeView === 'chat'} onClick={() => handleViewChange('chat')}>
            <ListItemIcon>
              <ChatIcon />
            </ListItemIcon>
            <ListItemText primary="Chat" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Espaço para o conteúdo não ficar embaixo de uma barra de topo, se houver */}
        <Toolbar /> 
        
        {/* Renderização Condicional do Conteúdo */}
        {activeView === 'pedidos' && <PedidosView data={data} />}
        {activeView === 'chat' && <ChatView />}
      </Box>
    </Box>
  );
}

export default DashboardLayout;