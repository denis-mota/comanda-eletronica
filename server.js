const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Store orders in memory (in a real app, this would be a database)
let orders = [];

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send current orders to newly connected clients
    socket.emit('initialOrders', orders);

    // Handle new order
    socket.on('newOrder', (order) => {
        const newOrder = {
            ...order,
            id: Date.now().toString(),
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        orders.push(newOrder);
        io.emit('orderAdded', newOrder);
    });

    // Handle order status update
    socket.on('updateOrderStatus', ({ orderId, status }) => {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            io.emit('orderUpdated', order);
        }
    });

    // Handle order deletion
    socket.on('deleteOrder', (orderId) => {
        orders = orders.filter(o => o.id !== orderId);
        io.emit('orderDeleted', orderId);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// REST API endpoints
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

app.post('/api/orders', (req, res) => {
    const newOrder = {
        ...req.body,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    io.emit('orderAdded', newOrder);
    res.status(201).json(newOrder);
});

app.put('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const order = orders.find(o => o.id === id);
    
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    io.emit('orderUpdated', order);
    res.json(order);
});

app.delete('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const orderIndex = orders.findIndex(o => o.id === id);
    
    if (orderIndex === -1) {
        return res.status(404).json({ error: 'Order not found' });
    }

    orders.splice(orderIndex, 1);
    io.emit('orderDeleted', id);
    res.status(204).send();
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});