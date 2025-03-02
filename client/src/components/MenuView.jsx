import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Typography, Card, CardContent, CardMedia, Grid, Button,
  TextField, Box, List, ListItem, ListItemText, Divider, Alert, Paper
} from '@mui/material';
import { useOrders } from '../context/OrderContext';

// Example dishes for the menu
const menuItems = [
  {
    id: 1,
    name: 'Filé Mignon ao Molho Madeira',
    description: 'Filé mignon grelhado com molho madeira, acompanha arroz e batatas.',
    price: 45.90,
    image: 'https://via.placeholder.com/300x200?text=File+Mignon'
  },
  {
    id: 2,
    name: 'Salmão Grelhado',
    description: 'Salmão grelhado com ervas finas, acompanha legumes e purê de batata.',
    price: 52.50,
    image: 'https://via.placeholder.com/300x200?text=Salmao+Grelhado'
  },
  {
    id: 3,
    name: 'Risoto de Funghi',
    description: 'Risoto cremoso com funghi e parmesão.',
    price: 38.90,
    image: 'https://via.placeholder.com/300x200?text=Risoto+Funghi'
  }
];

function MenuView() {
  const { table } = useParams();
  const { addOrder, orders } = useOrders();
  const [selectedItems, setSelectedItems] = useState([]);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes in seconds
  const [orderSent, setOrderSent] = useState(false);
  
  // Check if session is valid when component mounts
  useEffect(() => {
    const sessionStartTime = localStorage.getItem(`table_${table}_session_start`);
    
    if (sessionStartTime) {
      const elapsedTime = (Date.now() - parseInt(sessionStartTime)) / 1000;
      if (elapsedTime > 90 * 60) { // 90 minutes in seconds
        setSessionExpired(true);
      } else {
        setTimeLeft(90 * 60 - Math.floor(elapsedTime));
      }
    } else {
      // Start new session
      localStorage.setItem(`table_${table}_session_start`, Date.now().toString());
    }
    
    // Set up timer to update time left
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setSessionExpired(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [table]);
  
  // Format time left as MM:SS
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleAddItem = (item) => {
    const existingItem = selectedItems.find(i => i.id === item.id);
    
    if (existingItem) {
      setSelectedItems(selectedItems.map(i => 
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };
  
  const handleRemoveItem = (itemId) => {
    const existingItem = selectedItems.find(i => i.id === itemId);
    
    if (existingItem && existingItem.quantity > 1) {
      setSelectedItems(selectedItems.map(i => 
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      ));
    } else {
      setSelectedItems(selectedItems.filter(i => i.id !== itemId));
    }
  };
  
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setSelectedItems(selectedItems.map(i => 
      i.id === itemId ? { ...i, quantity: newQuantity } : i
    ));
  };
  
  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const handleSubmitOrder = () => {
    if (selectedItems.length === 0) return;
    
    const orderItems = selectedItems.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));
    
    addOrder({
      table,
      items: orderItems,
      total: calculateTotal()
    });
    
    setOrderSent(true);
    setSelectedItems([]);
    
    // Reset order sent message after 5 seconds
    setTimeout(() => setOrderSent(false), 5000);
  };
  
  // Find orders for this table
  const tableOrders = orders.filter(order => order.table === table);
  
  if (sessionExpired) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Sua sessão expirou. Por favor, solicite ao garçom um novo QR code.
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography variant="h4" gutterBottom>Cardápio - Mesa {table}</Typography>
        <Typography variant="body2" color="textSecondary">
          Tempo restante: {formatTimeLeft()}
        </Typography>
      </Box>
      
      {orderSent && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Pedido enviado com sucesso! A cozinha já está preparando.
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>Pratos do Dia</Typography>
          <Grid container spacing={2}>
            {menuItems.map((item) => (
              <Grid item xs={12} sm={6} md={6} key={item.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.image}
                    alt={item.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      R$ {item.price.toFixed(2)}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => handleAddItem(item)}
                      >
                        Adicionar
                      </Button>
                      
                      {selectedItems.find(i => i.id === item.id) && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Button 
                            size="small"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            -
                          </Button>
                          <Typography sx={{ mx: 1 }}>
                            {selectedItems.find(i => i.id === item.id)?.quantity || 0}
                          </Typography>
                          <Button 
                            size="small"
                            onClick={() => handleAddItem(item)}
                          >
                            +
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>Seu Pedido</Typography>
            
            {selectedItems.length === 0 ? (
              <Typography variant="body1" color="textSecondary">
                Nenhum item selecionado.
              </Typography>
            ) : (
              <>
                <List>
                  {selectedItems.map((item) => (
                    <React.Fragment key={item.id}>
                      <ListItem>
                        <ListItemText
                          primary={item.name}
                          secondary={`R$ ${item.price.toFixed(2)} cada`}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                          <Button 
                            size="small"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            -
                          </Button>
                          <TextField
                            size="small"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                            inputProps={{ min: 1, style: { textAlign: 'center', width: '40px' } }}
                            sx={{ mx: 1 }}
                          />
                          <Button 
                            size="small"
                            onClick={() => handleAddItem(item)}
                          >
                            +
                          </Button>
                        </Box>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">
                    Total: R$ {calculateTotal().toFixed(2)}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    sx={{ mt: 2 }}
                    onClick={handleSubmitOrder}
                  >
                    Enviar Pedido
                  </Button>
                </Box>
              </>
            )}
          </Paper>
          
          {tableOrders.length > 0 && (
            <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
              <Typography variant="h5" gutterBottom>Seus Pedidos Ativos</Typography>
              <List>
                {tableOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <ListItem>
                      <ListItemText
                        primary={`Pedido #${order.id.slice(-4)}`}
                        secondary={
                          <>
                            <Typography variant="body2">
                              Status: {order.status === 'pending' ? 'Pendente' : 
                                      order.status === 'preparing' ? 'Preparando' : 'Pronto'}
                            </Typography>
                            <Typography variant="body2">
                              {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default MenuView;