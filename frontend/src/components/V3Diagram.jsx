import React from 'react';
import ReactFlow, { Background, MarkerType } from 'reactflow';
import { useTheme, useMediaQuery } from '@mui/material';
import 'reactflow/dist/style.css';

const V3Diagram = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const getNodeStyle = (color) => ({
        background: color,
        border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: 8,
        padding: isMobile ? 4 : 8,
        fontSize: isMobile ? 10 : 12,
        width: isMobile ? 100 : 150,
        textAlign: 'center',
    });

    const nodes = [
        {
            id: '1',
            data: { label: 'User Content' },
            position: { x: isMobile ? 10 : 50, y: isMobile ? 10 : 50 },
            style: getNodeStyle('#D3F9D8'),
        },
        {
            id: '2',
            data: { label: 'AI Agent\n(with probability estimation)' },
            position: { x: isMobile ? 10 : 50, y: isMobile ? 100 : 200 },
            style: getNodeStyle('#E8F4FD'),
        },
        {
            id: '3',
            data: { label: 'Human Expert' },
            position: { x: isMobile ? 150 : 300, y: isMobile ? 10 : 50 },
            style: getNodeStyle('#F3E5F5'),
        },
        {
            id: '4',
            data: { label: 'Viewer' },
            position: { x: isMobile ? 150 : 300, y: isMobile ? 100 : 200 },
            style: getNodeStyle('#FFCDD2'),
        },
        {
            id: '5',
            data: { label: 'Brdge Knowledge Base' },
            position: { x: isMobile ? 80 : 175, y: isMobile ? 55 : 125 },
            style: getNodeStyle('#FFF3E0'),
        },
    ];

    const getEdgeStyle = (color) => ({
        stroke: color,
        strokeWidth: isMobile ? 1 : 2,
    });

    const edges = [
        { id: 'e1-5', source: '1', target: '5', animated: true, label: 'Initial content', style: getEdgeStyle('#4CAF50'), labelStyle: { fontSize: isMobile ? 8 : 10 } },
        { id: 'e5-2', source: '5', target: '2', animated: true, label: 'Inform', style: getEdgeStyle('#FF9800'), labelStyle: { fontSize: isMobile ? 8 : 10 } },
        { id: 'e2-4', source: '2', target: '4', animated: true, label: 'Present', style: getEdgeStyle('#2196F3'), markerEnd: { type: MarkerType.ArrowClosed, color: '#2196F3' }, labelStyle: { fontSize: isMobile ? 8 : 10 } },
        { id: 'e4-2', source: '4', target: '2', animated: true, label: 'Ask questions', style: getEdgeStyle('#F44336'), markerEnd: { type: MarkerType.ArrowClosed, color: '#F44336' }, labelStyle: { fontSize: isMobile ? 8 : 10 } },
        { id: 'e2-3', source: '2', target: '3', animated: true, style: { ...getEdgeStyle('#9C27B0'), strokeDasharray: '5,5' }, label: 'Difficult questions', labelStyle: { fill: '#9C27B0', fontWeight: 700, fontSize: isMobile ? 8 : 10 } },
        { id: 'e3-5', source: '3', target: '5', animated: true, label: 'Update knowledge', style: getEdgeStyle('#9C27B0'), markerEnd: { type: MarkerType.ArrowClosed, color: '#9C27B0' }, labelStyle: { fontSize: isMobile ? 8 : 10 } },
    ];

    return (
        <div style={{ height: isMobile ? '200px' : '300px', width: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                style={{ background: 'transparent' }}
                nodesDraggable={false}
                nodesConnectable={false}
                zoomOnScroll={false}
                panOnScroll={false}
                preventScrolling={false}
                attributionPosition="hidden"
                minZoom={0.5}
                maxZoom={2}
            >
                <Background color="#f0f0f0" gap={isMobile ? 8 : 16} size={1} />
            </ReactFlow>
        </div>
    );
};

export default V3Diagram;
