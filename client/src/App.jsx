import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, TextField, Box, IconButton, Grid, Card, CardContent, List, ListItem, ListItemText, ButtonGroup, useMediaQuery, Tab, Tabs, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useMemo, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { OrderProvider, useOrders } from './context/OrderContext';
import QRCodeGenerator from './components/QRCodeGenerator';
import MenuView from './components/MenuView';
import Cardapio from './pages/cardapio';
import Home from './pages/Home';
import Kitchen from './pages/Kitchen';

function WaiterView() {
  const { orders, addOrder } = useOrders();
  const [newOrder, setNewOrder] = useState({
    table: '',
    items: [{ name: '', quantity: 1 }]
  });
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addOrder(newOrder);
    setNewOrder({ table: '', items: [{ name: '', quantity: 1 }] });
  };

  return (
    <Container>
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Novo Pedido" />
        <Tab label="QR Codes das Mesas" />
      </Tabs>

      {activeTab === 0 ? (
        <Box>
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h5" color="primary">Mesa {order.tableId || order.table}</Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: order.status === 'preparing' ? 'info.main' :
                                 order.status === 'ready' ? 'success.main' : 'warning.main'
                        }}
                      >
                        {order.status === 'preparing' ? 'Preparando' :
                         order.status === 'ready' ? 'Pronto' : 'Pendente'}
                      </Typography>
                    </Box>
                    <List>
                      {order.items.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={item.name}
                            secondary={`Quantidade: ${item.quantity}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <QRCodeGenerator />
      )}
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
                <Typography variant="h6">Mesa {order.tableId || order.table}</Typography>
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

function AppNavigation() {
  const location = useLocation();
  const [mode, setMode] = useState('light');
  
  
  const theme = useMemo(
    () => createTheme({
      palette: {
        mode,
        primary: {
          main: '#1976d2',
        },
      },
    }),
    [mode],
  );

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };
  
  // Check if current path is cardapio
  const isCardapioPage = location.pathname.includes('/cardapio/');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Comanda Eletrônica
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          {!isCardapioPage && (
            <>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/kitchen">
                Cozinha
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cardapio/:table" element={<Cardapio />} />
        <Route path="/kitchen" element={<Kitchen />} />
      </Routes>
    </ThemeProvider>
  );
}

function App() {
  return (
    <OrderProvider>
      <Router>
        <AppNavigation />
      </Router>
    </OrderProvider>
  );
}

export default App;