// src/KpiCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, LinearProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const formatCurrency = (value = 0) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value = 0) => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

function KpiCard({ 
  title, 
  value, 
  icon, 
  format = 'number', 
  color = 'primary.main',
  gradient,
  trend = '+12',
  progress = 75
}) {
  const displayValue = format === 'currency' 
    ? formatCurrency(value) 
    : formatNumber(value);

  const isPositiveTrend = trend.startsWith('+');

  return (
    <Card 
      sx={{ 
        height: '180px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '20px',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        }
      }} 
      elevation={0}
    >
      {/* Animated background gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '120px',
          height: '120px',
          background: gradient || color,
          borderRadius: '50%',
          transform: 'translate(40px, -40px)',
          opacity: 0.08,
          transition: 'all 0.4s ease',
          '.MuiCard-root:hover &': {
            transform: 'translate(30px, -30px) scale(1.1)',
            opacity: 0.12,
          }
        }}
      />

      {/* Decorative top border */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: gradient || color,
        }}
      />
      
      <CardContent 
        sx={{ 
          height: '100%', 
          position: 'relative', 
          zIndex: 1,
          p: 3,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'space-between',
          mb: 2
        }}>
          {/* Title */}
          <Box sx={{ flex: 1 }}>
            <Typography 
              color="text.secondary" 
              variant="body2"
              sx={{ 
                fontWeight: 600,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                mb: 0.5
              }}
            >
              {title}
            </Typography>
          </Box>

          {/* Icon */}
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '15px',
              background: gradient || color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease',
              '.MuiCard-root:hover &': {
                transform: 'rotate(5deg) scale(1.1)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
              }
            }}
          >
            {icon}
          </Box>
        </Box>

        {/* Value */}
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="h3" 
            component="p" 
            sx={{ 
              fontWeight: 800,
              color: 'text.primary',
              fontSize: { xs: '2rem', sm: '2.5rem' },
              lineHeight: 1,
              mb: 0.5
            }}
          >
            {displayValue}
          </Typography>
        </Box>

        {/* Trend and Progress */}
        <Box sx={{ mt: 'auto' }}>
          {/* Progress bar */}
          <Box sx={{ mb: 1.5 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(0,0,0,0.08)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  background: gradient || color,
                }
              }}
            />
          </Box>

          {/* Trend indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {isPositiveTrend ? (
                <TrendingUpIcon sx={{ color: 'success.main', fontSize: '1rem' }} />
              ) : (
                <TrendingDownIcon sx={{ color: 'error.main', fontSize: '1rem' }} />
              )}
              <Typography 
                variant="caption" 
                sx={{ 
                  color: isPositiveTrend ? 'success.main' : 'error.main',
                  fontWeight: 700,
                  fontSize: '0.8rem'
                }}
              >
                {trend}%
              </Typography>
            </Box>
            
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                fontWeight: 500,
                fontSize: '0.75rem'
              }}
            >
              vs mês anterior
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Floating decoration */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 15,
          right: 15,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: gradient || color,
          opacity: 0.3,
          animation: 'pulse 2s infinite',
        }}
      />

      {/* CSS for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.6;
          }
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
        }
      `}</style>
    </Card>
  );
}

export default KpiCard;