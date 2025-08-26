// src/DashboardLayout.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography, 
  AppBar, 
  IconButton,
  Badge,
  useTheme,
  useMediaQuery,
  Divider,
  Chip,
  Avatar,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ChatIcon from '@mui/icons-material/Chat';
import RefreshIcon from '@mui/icons-material/Refresh';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import DashboardView from './DashboardView';
import PedidosView from './PedidosView';
import ChatView from './ChatView';

const drawerWidth = 280;

// Componente KPI Card otimizado para melhor visualização
function KPICard({ title, value, subtitle, icon, color, trend, trendValue }) {
  return (
    <Card 
      sx={{ 
        height: 120, // Altura reduzida e fixa
        background: `linear-gradient(135deg, ${color}08 0%, ${color}03 100%)`,
        border: `1px solid ${color}15`,
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px ${color}20`
        }
      }}
    >
      <CardContent sx={{ p: 2.5, pb: '20px !important', height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', height: '100%' }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: color, fontSize: '1.6rem', lineHeight: 1.1, mb: 1 }}>
                {value}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                {subtitle}
              </Typography>
              {trend && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                  {trend === 'up' ? (
                    <TrendingUpIcon sx={{ fontSize: '0.9rem', color: '#10b981' }} />
                  ) : (
                    <TrendingDownIcon sx={{ fontSize: '0.9rem', color: '#ef4444' }} />
                  )}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: '0.65rem', 
                      color: trend === 'up' ? '#10b981' : '#ef4444',
                      fontWeight: 600
                    }}
                  >
                    {trendValue}%
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: `0 4px 12px ${color}30`,
              fontSize: '1.1rem'
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// Componente DashboardView melhorado
function EnhancedDashboardView({ kpiData, chartData }) {
  return (
    <Box>
      {/* KPI Cards Grid - Layout mais compacto */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <KPICard
            title="Vendas Hoje"
            value="3"
            subtitle="3 vendas hoje"
            icon={<ShowChartIcon />}
            color="#667eea"
            trend="up"
            trendValue="8.2"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KPICard
            title="Horário de Pico"
            value="11:00:00"
            subtitle="Melhor performance"
            icon={<TrendingUpIcon />}
            color="#f093fb"
            trend="up"
            trendValue="12.5"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KPICard
            title="Pedidos Realizados"
            value="19"
            subtitle="Total processados"
            icon={<ShoppingCartIcon />}
            color="#4facfe"
            trend="up"
            trendValue="15.3"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KPICard
            title="Faturamento"
            value="R$ 9"
            subtitle="Receita do dia"
            icon={<AttachMoneyIcon />}
            color="#43e97b"
            trend="up"
            trendValue="5.8"
          />
        </Grid>
      </Grid>

      {/* Seção de Gráficos - Layout mais organizado */}
      <Grid container spacing={3}>
        {/* Gráfico Principal - Ocupa mais espaço mas com altura controlada */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ 
            borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            height: 400 // Altura fixa menor
          }}>
            <CardContent sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                Distribuição de vendas ao longo do dia
              </Typography>
              
              <Box sx={{ 
                height: 320, // Altura do gráfico ajustada
                background: 'linear-gradient(135deg, #667eea10 0%, transparent 100%)',
                borderRadius: '12px',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Aqui você pode integrar seu gráfico existente */}
                <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                  <ShowChartIcon sx={{ fontSize: '3rem', opacity: 0.3, mb: 1 }} />
                  <Typography variant="body2">
                    Gráfico de vendas por horário
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                    Horário: 11:00:00 | Vendas: 2
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Card de Resumo Lateral */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ 
            borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            height: 400,
            background: 'linear-gradient(135deg, #667eea08 0%, #f093fb05 100%)'
          }}>
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                Resumo do Período
              </Typography>
              
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Métricas resumidas */}
                <Box sx={{ 
                  p: 2, 
                  borderRadius: '12px', 
                  background: 'rgba(102, 126, 234, 0.05)',
                  border: '1px solid rgba(102, 126, 234, 0.1)'
                }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    TOTAL DE VENDAS
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea' }}>
                    3
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Vendas registradas hoje
                  </Typography>
                </Box>

                <Box sx={{ 
                  p: 2, 
                  borderRadius: '12px', 
                  background: 'rgba(240, 147, 251, 0.05)',
                  border: '1px solid rgba(240, 147, 251, 0.1)'
                }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    HORÁRIO DE PICO
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#f093fb' }}>
                    11:00
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Melhor período de vendas
                  </Typography>
                </Box>

                <Box sx={{ 
                  p: 2, 
                  borderRadius: '12px', 
                  background: 'rgba(79, 172, 254, 0.05)',
                  border: '1px solid rgba(79, 172, 254, 0.1)'
                }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    PEDIDOS ATIVOS
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#4facfe' }}>
                    19
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Aguardando processamento
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function DashboardLayout({ data, kpiData, chartData }) {
  const [activeView, setActiveView] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleViewChange = (view) => {
    setActiveView(view);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      view: 'dashboard',
      description: 'Visão geral dos negócios',
      color: '#667eea'
    },
    {
      text: 'Pedidos',
      icon: <ShoppingCartIcon />,
      view: 'pedidos',
      description: 'Gerenciar pedidos',
      badge: data?.length || 0,
      color: '#f093fb'
    },
    {
      text: 'Chat',
      icon: <ChatIcon />,
      view: 'chat',
      description: 'Conversas do WhatsApp',
      color: '#4facfe'
    }
  ];

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    }}>
      {/* Logo/Header */}
      <Box 
        sx={{ 
          p: 3,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative background */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -10,
            left: -10,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" fontWeight="700" gutterBottom sx={{ fontSize: '1.75rem' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.9rem' }}>
            Sistema de Gestão
          </Typography>
          <Chip 
            label="v1.0.0" 
            size="small" 
            sx={{ 
              mt: 1.5, 
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: 'white',
              fontWeight: 500
            }} 
          />
        </Box>
      </Box>

      {/* Menu Items */}
      <List sx={{ flex: 1, px: 2, py: 2 }}>
        {menuItems.map((item, index) => (
          <ListItem key={item.view} disablePadding sx={{ mb: 1.5 }}>
            <ListItemButton
              selected={activeView === item.view}
              onClick={() => handleViewChange(item.view)}
              sx={{
                borderRadius: '16px',
                py: 2,
                px: 2.5,
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: activeView === item.view 
                  ? 'rgba(255,255,255,0.15)' 
                  : 'transparent',
                backdropFilter: activeView === item.view ? 'blur(10px)' : 'none',
                border: activeView === item.view 
                  ? '1px solid rgba(255,255,255,0.2)' 
                  : '1px solid transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                },
                '&:before': activeView === item.view ? {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #ffd89b 0%, #19547b 100%)',
                  borderRadius: '3px 3px 0 0'
                } : {},
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: activeView === item.view ? 'translateX(4px)' : 'translateX(0)',
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: 'white',
                  minWidth: 45,
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    background: activeView === item.view 
                      ? `linear-gradient(135deg, ${item.color} 0%, rgba(255,255,255,0.2) 100%)`
                      : 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: activeView === item.view 
                      ? '0 4px 12px rgba(0,0,0,0.15)' 
                      : 'none'
                  }}
                >
                  {item.badge !== undefined ? (
                    <Badge 
                      badgeContent={item.badge} 
                      color="error" 
                      max={99}
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.75rem',
                          height: '18px',
                          minWidth: '18px'
                        }
                      }}
                    >
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </Box>
              </ListItemIcon>
              
              <ListItemText 
                primary={
                  <Typography 
                    variant="subtitle1" 
                    fontWeight={activeView === item.view ? 600 : 500}
                    sx={{ 
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  >
                    {item.text}
                  </Typography>
                }
                secondary={
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.8rem'
                    }}
                  >
                    {item.description}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Box
          sx={{
            p: 2,
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TrendingUpIcon sx={{ color: '#4ade80', mr: 1, fontSize: '1.2rem' }} />
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
              Status do Sistema
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Todos os serviços operacionais
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* AppBar */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          zIndex: theme.zIndex.drawer + 1,
          boxShadow: '0 1px 20px rgba(0,0,0,0.05)'
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          {/* Menu button for mobile */}
          {isMobile && (
            <IconButton
              color="primary"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2,
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': { backgroundColor: 'primary.dark' }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Page Title */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h5" 
              color="text.primary" 
              sx={{ 
                fontWeight: 700,
                fontSize: '1.5rem'
              }}
            >
              {menuItems.find(item => item.view === activeView)?.text || 'Dashboard'}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {menuItems.find(item => item.view === activeView)?.description || ''}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              sx={{
                position: 'relative',
                backgroundColor: 'rgba(0,0,0,0.04)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.08)' }
              }}
            >
              <Badge 
                badgeContent={3} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.75rem',
                    height: '18px',
                    minWidth: '18px',
                    animation: 'pulse 2s infinite'
                  }
                }}
              >
                <NotificationsIcon color="action" />
              </Badge>
            </IconButton>
            
            <IconButton 
              onClick={() => window.location.reload()}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          overflow: 'hidden'
        }}
      >
        <Toolbar />
        
        <Box 
          sx={{ 
            height: 'calc(100vh - 64px)',
            p: activeView === 'chat' ? 0 : 3,
            overflow: activeView === 'chat' ? 'hidden' : 'auto'
          }}
        >
          {activeView === 'dashboard' && <EnhancedDashboardView kpiData={kpiData} chartData={chartData} />}
          {activeView === 'pedidos' && <PedidosView data={data} />}
          {activeView === 'chat' && <ChatView />}
        </Box>
      </Box>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </Box>
  );
}

export default DashboardLayout;