import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  AppBar,
  Toolbar,
  Paper,
} from '@mui/material';
import { useOrders } from '../../context/OrderContext';
import { getImageUrl } from '../../utils/imageUtils';

const menuItems = [
  {
    id: 1,
    name: 'Feijoada',
    description: 'Um ensopado robusto de feijão preto com suculentas carnes de porco, acompanhado de arroz, couve crocante e rodelas de laranja que realçam seu sabor marcante.',
    price: { fixed: 45.00 },
    image: getImageUrl('feijoada'),
    category: 'top brasl'
  },
  {
    id: 2,
    name: 'Muqueca Brasil',
    description: 'Um vibrante ensopado de peixe e frutos do mar, mergulhado em leite de coco e azeite de dendê, com toques de tomate e coentro que explodem em sabores tropicais.',
    price: { fixed: 150.00 },
    image: getImageUrl('muqueca'),
    category: 'top brasil'
  },
  {
    id: 3,
    name: 'Churrasco',
    description: 'Carnes grelhadas à perfeição, com um aroma defumado irresistível, que se transformam em uma verdadeira explosão de sabor a cada mordida.',
    price: { fixed: 35.80 },
    image: getImageUrl('churrasco'),
    category: 'churrascos'
  },
  {
    id: 4,
    name: 'Bacalhau à Brás',
    description: 'Bacalhau desfiado delicadamente misturado a ovos cremosos e batata palha crocante, finalizado com azeitonas e salsa para um equilíbrio perfeito de sabores.',
    price: { fixed: 25.90 },
    image: getImageUrl('bacalhau'),
    category: 'frutos do mar'
  },
  {
    id: 5,
    name: 'Lasanha',
    description: 'Camadas de massa al dente, molho suculento e carne temperada, intercaladas com queijo derretido, criando uma experiência reconfortante e irresistível.',
    price: { fixed: 25.00 },
    image: getImageUrl('lasanha'),
    category: 'top brasil'
  }
];

const categories = ['Todos', 'churrascos', 'frutos do mar', 'top brasil'];

function Cardapio() {
  const { table } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedItems, setSelectedItems] = useState([]);
  const { addOrder } = useOrders();

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price) => {
    if (price.fixed) {
      return `R$ ${price.fixed.toFixed(2)}`;
    }
    return `R$ ${price.min.toFixed(2)} ~ R$ ${price.max.toFixed(2)}`;
  };

  const handleSelectItem = (item) => {
    const itemPrice = item.price.fixed || item.price.min;
    
    // Check if item is already in selectedItems
    const existingItemIndex = selectedItems.findIndex(i => i.id === item.id);
    
    if (existingItemIndex >= 0) {
      // Item already exists, increase quantity
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity += 1;
      setSelectedItems(updatedItems);
    } else {
      // Add new item
      setSelectedItems([...selectedItems, {
        id: item.id,
        name: item.name,
        price: itemPrice,
        quantity: 1
      }]);
    }
    
    alert(`${item.name} adicionado ao pedido!`);
  };

  const handleSendOrder = () => {
    if (selectedItems.length === 0) return;
    
    const newOrder = {
      id: Date.now().toString(),
      tableId: table,
      items: selectedItems,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    addOrder(newOrder);
    setSelectedItems([]);
    alert('Pedido enviado para a cozinha!');
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <Box sx={{ pb: 8 }}> {/* Increased padding bottom to make room for the footer */}
      <AppBar position="sticky" color="default" sx={{ mb: 2 }}>
        <Toolbar>
          <Box sx={{ width: '100%' }}>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
              Cervejaria St. Oicle
            </Typography>
            <TextField
              fullWidth
              placeholder="Pesquisar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'contained' : 'outlined'}
                  onClick={() => setSelectedCategory(category)}
                  sx={{
                    minWidth: 'auto',
                    whiteSpace: 'nowrap',
                    color: selectedCategory === category ? 'white' : 'primary',
                    backgroundColor: selectedCategory === category ? 'primary.main' : 'transparent'
                  }}
                >
                  {category}
                </Button>
              ))}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Container>
        <Typography variant="h4" component="h1" sx={{ my: 3, textAlign: 'center', fontWeight: 'bold' }}>
          Pratos do Dia
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          {filteredItems.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" component="div">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {item.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatPrice(item.price)}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 2 }}
                    onClick={() => handleSelectItem(item)}
                  >
                    Selecionar
                  </Button>
                </CardContent>
                <CardMedia
                  component="img"
                  sx={{ width: 150, height: 150, objectFit: 'cover' }}
                  image={item.image}
                  alt={item.name}
                />
              </Box>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Sticky footer showing total */}
      {selectedItems.length > 0 && (
        <Paper 
          elevation={3} 
          sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'background.paper',
            zIndex: 1000
          }}
        >
          <Typography variant="h6" component="div">
            Total a Pagar: R$ {calculateTotal().toFixed(2)}
          </Typography>
          <Button 
            variant="contained" 
            color="success"
            onClick={handleSendOrder}
          >
            Enviar Pedido
          </Button>
        </Paper>
      )}
    </Box>
  );
}

export default Cardapio;