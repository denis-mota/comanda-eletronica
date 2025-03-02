import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const OrderContext = createContext();
const socket = io('http://localhost:3000');

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    socket.on('initialOrders', (initialOrders) => {
      setOrders(initialOrders);
    });

    socket.on('orderAdded', (order) => {
      setOrders(prev => [...prev, order]);
    });

    socket.on('orderUpdated', (updatedOrder) => {
      setOrders(prev => prev.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      ));
    });

    socket.on('orderDeleted', (orderId) => {
      setOrders(prev => prev.filter(order => order.id !== orderId));
    });

    return () => {
      socket.off('initialOrders');
      socket.off('orderAdded');
      socket.off('orderUpdated');
      socket.off('orderDeleted');
    };
  }, []);

  const addOrder = (newOrder) => {
    socket.emit('newOrder', newOrder);
  };

  const updateOrderStatus = (orderId, status) => {
    socket.emit('updateOrderStatus', { orderId, status });
  };

  const deleteOrder = (orderId) => {
    socket.emit('deleteOrder', orderId);
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, deleteOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}