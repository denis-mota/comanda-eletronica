import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
} from '@mui/material';
import { useOrders } from '../context/OrderContext';

function Kitchen() {
  const { orders, updateOrderStatus } = useOrders();

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'preparing':
        return 'info';
      case 'ready':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
        Pedidos da Cozinha
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Mesa {order.tableId || order.table}
                  </Typography>
                  <Chip
                    label={order.status === 'pending' ? 'Pendente' :
                           order.status === 'preparing' ? 'Preparando' : 'Pronto'}
                    color={getStatusColor(order.status)}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Horário: {formatTime(order.createdAt)}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Itens:
                  </Typography>
                  {order.items.map((item, index) => (
                    <Typography key={index} variant="body1">
                      {item.quantity}x {item.name}
                    </Typography>
                  ))}
                </Box>

                <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                  {order.status === 'pending' && (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                    >
                      Iniciar Preparo
                    </Button>
                  )}
                  {order.status === 'preparing' && (
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                    >
                      Marcar como Pronto
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Kitchen;