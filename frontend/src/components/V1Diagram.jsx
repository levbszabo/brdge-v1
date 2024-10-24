// src/components/V1Diagram.jsx

import React, { memo, useState } from 'react';
import ReactFlow, { Background, Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';

const CustomNode = memo(({ data, isConnectable }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            style={{
                padding: '8px',
                borderRadius: '5px',
                background: data.color,
                color: '#333',
                border: '1px solid #222',
                width: 120,
                fontSize: '10px',
                fontWeight: 'bold',
                textAlign: 'center',
                boxShadow: isHovered ? '0 0 10px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'box-shadow 0.3s ease',
                position: 'relative',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {data.label}
            {isHovered && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'white',
                    padding: '4px',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    width: '150px',
                    fontSize: '8px',
                }}>
                    {data.description}
                </div>
            )}
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
            <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
        </div>
    );
});

const nodeTypes = {
    custom: CustomNode,
};

const V1Diagram = () => {
    const nodes = [
        { id: '1', type: 'custom', position: { x: 100, y: 0 }, data: { label: 'Presenter', color: '#D3F9D8', description: 'Uploads and organizes content' } },
        { id: '2', type: 'custom', position: { x: 100, y: 120 }, data: { label: 'AI Agent', color: '#E8F4FD', description: 'Processes and structures information' } },
        { id: '3', type: 'custom', position: { x: 100, y: 240 }, data: { label: 'Viewer', color: '#FFF3E0', description: 'Accesses polished, consistent content' } },
    ];

    const edges = [
        { id: 'e1-2', source: '1', target: '2', animated: true, label: 'Offload', style: { stroke: '#4CAF50' } },
        { id: 'e2-3', source: '2', target: '3', animated: true, label: 'Present', style: { stroke: '#2196F3' } },
    ];

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <p>
                    Create powerful presentations that speak for you—literally. With Static AI, turn your documents into engaging walkthroughs, letting your content shine without requiring you to be there. It's like having your best presentation skills on autopilot, delivering consistency and clarity every single time
                </p>

            </div>
            <div style={{ width: '100%', height: '350px', position: 'relative' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    fitView
                    style={{ background: 'white' }}
                    minZoom={0.5}
                    maxZoom={2}
                    attributionPosition="hidden"
                >
                    <Background color="#aaa" gap={16} />
                </ReactFlow>
            </div>
        </div>
    );
};

export default V1Diagram;
