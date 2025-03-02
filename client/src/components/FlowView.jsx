import React, { useCallback } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState } from 'reactflow';
import { useOrders } from '../context/OrderContext';
import 'reactflow/dist/style.css';

const nodeTypes = {
  orderNode: ({ data }) => (
    <div className="order-node" style={{
      padding: '10px',
      borderRadius: '5px',
      background: 'white',
      border: '1px solid #ddd',
      minWidth: '150px'
    }}>
      <div style={{ fontWeight: 'bold' }}>Mesa {data.table}</div>
      <div>Status: {data.status}</div>
      <div style={{ fontSize: '0.9em', marginTop: '5px' }}>
        {data.items.map((item, index) => (
          <div key={index}>{item.name} x{item.quantity}</div>
        ))}
      </div>
    </div>
  )
};

function FlowView() {
  const { orders } = useOrders();

  const createNodes = useCallback(() => {
    const pendingNodes = [];
    const preparingNodes = [];
    const readyNodes = [];

    orders.forEach((order, index) => {
      const node = {
        id: order.id,
        type: 'orderNode',
        data: order,
        position: { x: 0, y: index * 150 }
      };

      switch (order.status) {
        case 'pending':
          node.position.x = 100;
          pendingNodes.push(node);
          break;
        case 'preparing':
          node.position.x = 400;
          preparingNodes.push(node);
          break;
        case 'ready':
          node.position.x = 700;
          readyNodes.push(node);
          break;
      }
    });

    return [...pendingNodes, ...preparingNodes, ...readyNodes];
  }, [orders]);

  const createEdges = useCallback(() => {
    return orders.map(order => ({
      id: `${order.id}-edge`,
      source: order.id,
      target: order.id,
      type: 'smoothstep',
      animated: true
    }));
  }, [orders]);

  const [nodes, setNodes, onNodesChange] = useNodesState(createNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(createEdges());

  React.useEffect(() => {
    setNodes(createNodes());
    setEdges(createEdges());
  }, [orders, createNodes, createEdges, setNodes, setEdges]);

  return (
    <div style={{ width: '100%', height: '80vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default FlowView;