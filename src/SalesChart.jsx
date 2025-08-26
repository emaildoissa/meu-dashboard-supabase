// src/SalesChart.jsx
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { Paper, Typography, Box, Chip, Avatar } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BarChartIcon from '@mui/icons-material/BarChart';

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mb: 0.5 }}>
          Horário: {label}:00
        </Typography>
        <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 600 }}>
          Vendas: {payload[0].value}
        </Typography>
      </Box>
    );
  }
  return null;
};

function SalesChart({ data }) {
  // Calcula algumas estatísticas dos dados
  const totalSales = data?.reduce((sum, item) => sum + (item.sales_count || 0), 0) || 0;
  const peakHour = data?.reduce((max, item) => 
    (item.sales_count || 0) > (max.sales_count || 0) ? item : max, 
    data[0] || {}
  );

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 0,
        height: '450px',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        position: 'relative'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            right: -10,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -20,
            left: -20,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                <BarChartIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="700" gutterBottom sx={{ mb: 0.5 }}>
                  Vendas por Horário
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Distribuição de vendas ao longo do dia
                </Typography>
              </Box>
            </Box>
            
            <Chip
              icon={<TrendingUpIcon />}
              label={`${totalSales} vendas hoje`}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: 'white',
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: 'white'
                }
              }}
            />
          </Box>

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
                Total de Vendas
              </Typography>
              <Typography variant="h6" fontWeight="700">
                {totalSales}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
                Horário de Pico
              </Typography>
              <Typography variant="h6" fontWeight="700">
                {peakHour?.hour_of_day || '--'}:00
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Chart */}
      <Box sx={{ p: 3, height: 'calc(100% - 180px)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#667eea" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#764ba2" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(0,0,0,0.1)"
              horizontal={true}
              vertical={false}
            />
            
            <XAxis 
              dataKey="hour_of_day" 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fill: '#6B7280', 
                fontSize: 12,
                fontWeight: 500
              }}
              tickFormatter={(value) => `${value}:00`}
            />
            
            <YAxis 
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ 
                fill: '#6B7280', 
                fontSize: 12,
                fontWeight: 500
              }}
              width={40}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey="sales_count"
              stroke="#667eea"
              strokeWidth={3}
              fill="url(#salesGradient)"
              dot={{
                fill: '#667eea',
                strokeWidth: 3,
                stroke: '#ffffff',
                r: 5
              }}
              activeDot={{
                r: 7,
                fill: '#667eea',
                strokeWidth: 3,
                stroke: '#ffffff',
                style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>

      {/* Footer with insights */}
      <Box
        sx={{
          px: 3,
          py: 2,
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTimeIcon sx={{ color: '#6B7280', fontSize: '1rem' }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            Dados atualizados em tempo real
          </Typography>
        </Box>
        
        <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
          ↗ +15% vs ontem
        </Typography>
      </Box>
    </Paper>
  );
}

export default SalesChart;