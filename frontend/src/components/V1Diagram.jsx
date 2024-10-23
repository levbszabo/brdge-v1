// src/components/V1Diagram.jsx

import React from 'react';
import ReactFlow, { Background, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';

const V1Diagram = () => {
    const nodes = [
        {
            id: '1',
            type: 'input',
            data: { label: 'Document Upload' },
            position: { x: 50, y: 50 },
            style: { background: '#D3F9D8', border: '1px solid #4CAF50', borderRadius: 8, padding: 10, fontSize: 12 },
        },
        {
            id: '2',
            data: { label: 'AI Processing' },
            position: { x: 50, y: 150 },
            style: { background: '#E8F4FD', border: '1px solid #2196F3', borderRadius: 8, padding: 10, fontSize: 12 },
        },
        {
            id: '3',
            data: { label: 'Static AI Presentation' },
            position: { x: 50, y: 250 },
            style: { background: '#FFF3E0', border: '1px solid #FF9800', borderRadius: 8, padding: 10, fontSize: 12 },
        },
        {
            id: '4',
            data: { label: 'Viewers' },
            position: { x: 200, y: 250 },
            style: { background: '#F3E5F5', border: '1px solid #9C27B0', borderRadius: 8, padding: 10, fontSize: 12 },
        },
    ];

    const edges = [
        { id: 'e1-2', source: '1', target: '2', animated: true, label: 'One-time upload', style: { stroke: '#4CAF50' } },
        { id: 'e2-3', source: '2', target: '3', animated: true, label: 'Generate', style: { stroke: '#2196F3' } },
        { id: 'e3-4', source: '3', target: '4', animated: true, label: 'View anytime', style: { stroke: '#FF9800' }, markerEnd: { type: MarkerType.ArrowClosed } },
    ];

    return (
        <div style={{ height: '300px', width: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                style={{ background: 'transparent' }}
                nodesDraggable={false}
                nodesConnectable={false}
                zoomOnScroll={false}
                panOnScroll={false}
                preventScrolling={true}
            >
                <Background color="#f0f0f0" gap={16} size={1} />
            </ReactFlow>
        </div>
    );
};

export default V1Diagram;
