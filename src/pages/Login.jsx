// src/pages/Login.jsx
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../supabaseClient';
import { Box, Typography } from '@mui/material';

function Login() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f5f7fa'
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '420px', p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom fontWeight="700">
          Acessar Painel
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Faça login para gerenciar seus pedidos e conversas.
        </Typography>
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              button: { borderRadius: '8px', borderColor: '#e0e0e0' },
              input: { borderRadius: '8px' },
            },
          }}
          providers={['google']} // Deixei apenas Google, pode adicionar outros como 'github'
          localization={{
            variables: {
              sign_in: {
                email_label: 'Seu email',
                password_label: 'Sua senha',
                button_label: 'Entrar',
                social_provider_text: 'Entrar com {{provider}}',
                link_text: 'Já tem uma conta? Entre'
              },
              sign_up: {
                email_label: 'Seu email',
                password_label: 'Crie uma senha',
                button_label: 'Cadastrar',
                social_provider_text: 'Cadastrar com {{provider}}',
                link_text: 'Não tem uma conta? Cadastre-se'
              }
            }
          }}
        />
      </Box>
    </Box>
  );
}

export default Login;