import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, TextField, Grid, Card, CardContent, List, ListItem, ListItemText, ButtonGroup, IconButton, Tabs, Tab } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import DeleteIcon from '@mui/icons-material/Delete';
import { useOrders } from '../context/OrderContext';
import QRCodeGenerator from '../components/QRCodeGenerator';

function Home() {
  const navigate = useNavigate();
  const { orders, addOrder, updateOrderStatus, deleteOrder } = useOrders();
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

export default Home;