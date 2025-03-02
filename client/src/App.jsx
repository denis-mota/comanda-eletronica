import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, TextField, Box, IconButton, Grid, Card, CardContent, List, ListItem, ListItemText, ButtonGroup, useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useMemo, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { OrderProvider, useOrders } from './context/OrderContext';

function WaiterView() {
  const { orders, addOrder } = useOrders();
  const [newOrder, setNewOrder] = useState({
    table: '',
    items: [{ name: '', quantity: 1 }]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addOrder(newOrder);
    setNewOrder({ table: '', items: [{ name: '', quantity: 1 }] });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Novo Pedido</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Número da Mesa"
          value={newOrder.table}
          onChange={(e) => setNewOrder({ ...newOrder, table: e.target.value })}
          margin="normal"
          required
        />
        {newOrder.items.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Nome do Item"
              value={item.name}
              onChange={(e) => {
                const updatedItems = [...newOrder.items];
                updatedItems[index].name = e.target.value;
                setNewOrder({ ...newOrder, items: updatedItems });
              }}
              required
            />
            <TextField
              type="number"
              label="Quantidade"
              value={item.quantity}
              onChange={(e) => {
                const updatedItems = [...newOrder.items];
                updatedItems[index].quantity = parseInt(e.target.value);
                setNewOrder({ ...newOrder, items: updatedItems });
              }}
              InputProps={{ inputProps: { min: 1 } }}
              required
            />
            {index > 0 && (
              <IconButton
                onClick={() => {
                  const updatedItems = newOrder.items.filter((_, i) => i !== index);
                  setNewOrder({ ...newOrder, items: updatedItems });
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))}
        <Button
          variant="outlined"
          onClick={() => setNewOrder({
            ...newOrder,
            items: [...newOrder.items, { name: '', quantity: 1 }]
          })}
          sx={{ mb: 2 }}
        >
          Adicionar Item
        </Button>
        <Button type="submit" variant="contained" fullWidth>
          Fazer Pedido
        </Button>
      </form>

      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>Pedidos Ativos</Typography>
      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Mesa {order.table}</Typography>
                <Typography color="textSecondary">Status: {order.status === 'preparing' ? 'Preparando' : order.status === 'ready' ? 'Pronto' : 'Pendente'}</Typography>
                <List>
                  {order.items.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={item.name}
                        secondary={`Quantity: ${item.quantity}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

function KitchenView() {
  const { orders, updateOrderStatus, deleteOrder } = useOrders();

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Pedidos da Cozinha</Typography>
      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Mesa {order.table}</Typography>
                <Typography color="textSecondary">Status: {order.status === 'preparing' ? 'Preparando' : order.status === 'ready' ? 'Pronto' : 'Pendente'}</Typography>
                <List>
                  {order.items.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={item.name}
                        secondary={`Quantity: ${item.quantity}`}
                      />
                    </ListItem>
                  ))}
                </List>
                <ButtonGroup fullWidth>
                  <Button
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                    color="primary"
                    variant={order.status === 'preparing' ? 'contained' : 'outlined'}
                  >
                    Preparando
                  </Button>
                  <Button
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                    color="secondary"
                    variant={order.status === 'ready' ? 'contained' : 'outlined'}
                  >
                    Pronto
                  </Button>
                </ButtonGroup>
                {order.status === 'ready' && (
                  <Button
                    fullWidth
                    color="error"
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    onClick={() => deleteOrder(order.id)}
                    sx={{ mt: 1 }}
                  >
                    Remover Pedido
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || (prefersDarkMode ? 'dark' : 'light');
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#1976d2' : '#90caf9',
      },
      secondary: {
        main: mode === 'light' ? '#dc004e' : '#f48fb1',
      },
      background: {
        default: mode === 'light' ? '#ffffff' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: mode === 'light' ? '#000000' : '#ffffff',
        secondary: mode === 'light' ? '#666666' : '#b3b3b3',
      },
    },
  }), [mode]);

  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default;
    document.body.style.color = theme.palette.text.primary;
  }, [theme]);

  return (
    <ThemeProvider theme={theme}>
      <OrderProvider>
        <Router>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                Sistema de Pedidos do Restaurante
              </Typography>
              <Button color="inherit" component={Link} to="/">
                Visão do Garçom
              </Button>
              <Button color="inherit" component={Link} to="/kitchen">
                Visão da Cozinha
              </Button>
              <IconButton color="inherit" onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
                {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>
            </Toolbar>
          </AppBar>

          <Container style={{ marginTop: '2rem' }}>
            <Routes>
              <Route path="/" element={<WaiterView />} />
              <Route path="/kitchen" element={<KitchenView />} />
            </Routes>
          </Container>
        </Router>
      </OrderProvider>
    </ThemeProvider>
  );
}

export default App;