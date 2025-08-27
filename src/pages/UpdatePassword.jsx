// src/pages/UpdatePassword.jsx
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../supabaseClient';
import { Box, Typography } from '@mui/material';

function UpdatePassword() {
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
          Crie uma Nova Palavra-passe
        </Typography>
        <Auth
          supabaseClient={supabase}
          view="update_password"
          appearance={{ theme: ThemeSupa }}
          localization={{
            variables: {
              update_password: {
                password_label: 'Nova palavra-passe',
                button_label: 'Salvar nova palavra-passe',
              }
            }
          }}
        />
      </Box>
    </Box>
  );
}

export default UpdatePassword;