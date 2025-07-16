// src/Dashboard.jsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PurchasesTable from './PurchasesTable'; // Importamos nossa nova tabela
import ChatViewer from './ChatViewer';
import DetailsModal from './DetailsModal'; // Importamos o modal de detalhes

function Dashboard({ data }) {
   const [selectedItem, setSelectedItem] = useState(null);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };
  const totalItems = data.length;
  
  // Podemos manter os cards de resumo, eles são úteis!
  const summaryCards = (
    <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
            <Card>
                <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                        Total de Compras
                    </Typography>
                    <Typography variant="h5" component="div">
                        {totalItems}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
        {/* Você pode adicionar outros cards de resumo aqui, como "Faturamento Total" */}
    </Grid>
  );

 return (
    // Recomendo usar maxWidth="xl" para dar mais espaço
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Cabeçalho com Título e Botão */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => alert('Abrir formulário de criação!')}
        >
          Create
        </Button>
      </Box>

      {/* 2. ESTRUTURA DE GRID PARA DIVIDIR A TELA */}
      <Grid container spacing={3}>
        {/* Coluna da Esquerda: Tabela de Compras */}
        <Grid item xs={12} lg={7}>
          <PurchasesTable data={data} onViewDetails={handleViewDetails} />
        </Grid>
        
        {/* Coluna da Direita: Visualizador do Chat */}
        <Grid item xs={12} lg={5}>
          <ChatViewer />
        </Grid>
      </Grid>
      
      {/* O Modal continua funcionando normalmente */}
      <DetailsModal 
        item={selectedItem}
        open={!!selectedItem}
        onClose={handleCloseModal}
      />
    </Container>
  );
}

export default Dashboard;