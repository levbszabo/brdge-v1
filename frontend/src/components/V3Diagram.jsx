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

const V3Diagram = () => {
    const nodes = [
        { id: '1', type: 'custom', position: { x: 50, y: 0 }, data: { label: 'Presenter', color: '#D3F9D8', description: 'Handles complex queries and updates knowledge' } },
        { id: '2', type: 'custom', position: { x: 50, y: 120 }, data: { label: 'AI Agent', color: '#E8F4FD', description: 'Processes information and interacts with viewers' } },
        { id: '3', type: 'custom', position: { x: 50, y: 240 }, data: { label: 'Viewer', color: '#FFF3E0', description: 'Interacts with AI and receives expert input' } },
        { id: '4', type: 'custom', position: { x: 250, y: 120 }, data: { label: 'Knowledge Base', color: '#FFCDD2', description: 'Dynamically updated information repository' } },
    ];

    const edges = [
        { id: 'e1-2', source: '1', target: '2', animated: true, label: 'Offload', style: { stroke: '#4CAF50' } },
        { id: 'e2-3', source: '2', target: '3', animated: true, label: 'Present/Ask', style: { stroke: '#2196F3' } },
        { id: 'e1-4', source: '1', target: '4', animated: true, label: 'Update', style: { stroke: '#F44336' } },
        { id: 'e4-2', source: '4', target: '2', animated: true, label: 'Inform', style: { stroke: '#F44336' } },
    ];

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <p>
                    The ultimate blend of human and machine collaboration. Cybernetic AI not only handles questions but also smartly distinguishes complex queries, forwarding them back to the presenter for deeper insights. It continuously learns and updates the Brdge knowledge base, evolving with each interaction to enhance the quality and relevance of future presentations.
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

export default V3Diagram;
