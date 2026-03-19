'use client';

import React, { useRef, MouseEvent } from 'react';
import { usePDFStore } from '@/store/usePDFStore';
import { AddElementCommand } from '@/lib/commands';
import { PDFElement } from '@/lib/types';

interface InteractionLayerProps {
    pageNum: number;
    dimensions: { width: number; height: number };
    zoom: number;
}

export const InteractionLayer: React.FC<InteractionLayerProps> = ({ pageNum, dimensions, zoom }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const allElements = usePDFStore((s) => s.elements);
    const elements = allElements.filter((e) => e.page === pageNum);

    const activeTool = usePDFStore((s) => s.activeTool);
    const selectedElement = usePDFStore((s) => s.selectedElement);
    const setSelectedElement = usePDFStore((s) => s.setSelectedElement);
    const performAction = usePDFStore((s) => s.performAction);

    // Translate click to page-relative percentage
    const handleContainerClick = (e: MouseEvent<HTMLDivElement>) => {
        // If the tool is 'select', clicking empty space clears selection.
        if (activeTool === 'select') {
            // Allow bubbling from elements to be stopped. If it reached here, empty space clicked.
            if (e.target === containerRef.current) {
                setSelectedElement(null);
            }
            return;
        }

        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        // Calculate click coordinates relative to the top-left of the bounding box
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Convert to percentage (0 to 1) relative to scaled dimensions
        const pctX = clickX / dimensions.width;
        const pctY = clickY / dimensions.height;

        const id = crypto.randomUUID();

        if (activeTool === 'text') {
            const textElement: PDFElement = {
                id,
                type: 'text',
                page: pageNum,
                x: pctX,
                y: pctY,
                properties: { content: 'Text Box' }
            };
            performAction(new AddElementCommand(textElement));
            // Auto-switch to select or keep it (typically auto-switch to select UX)
            usePDFStore.getState().setActiveTool('select');
            setSelectedElement(id);
        } else if (activeTool === 'shape') {
            const shapeElement: PDFElement = {
                id,
                type: 'shape',
                page: pageNum,
                x: pctX,
                y: pctY,
                // Using fixed logical size, but to support scaling, they might also be percentages.
                // For now, shape will have a fixed width/height but coordinate mapping is percentage.
                properties: { fill: 'blue' } // 100x50px specified in requirements
            };
            performAction(new AddElementCommand(shapeElement));
            usePDFStore.getState().setActiveTool('select');
            setSelectedElement(id);
        }
    };

    const handleElementClick = (e: MouseEvent<HTMLDivElement>, id: string) => {
        if (activeTool === 'select') {
            e.stopPropagation(); // prevent background click deselect
            setSelectedElement(id);
        }
    };

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-20 cursor-crosshair"
            onClick={handleContainerClick}
            style={{
                cursor: activeTool === 'select' ? 'default' : 'crosshair'
            }}
        >
            {elements.map(el => {
                // Calculate absolute position based on zoom-scaled container dimensions
                const leftPos = el.x * dimensions.width;
                const topPos = el.y * dimensions.height;
                const isSelected = selectedElement === el.id;

                return (
                    <div
                        key={el.id}
                        className={`absolute whitespace-nowrap cursor-pointer transition-colors ${isSelected ? 'ring-2 ring-blue-500 rounded bg-blue-500/10' : ''}`}
                        style={{
                            left: leftPos,
                            top: topPos,
                            // Apply basic styling based on element type
                            ...(el.type === 'shape' ? { width: 100 * zoom, height: 50 * zoom, backgroundColor: el.properties.fill } : {})
                        }}
                        onClick={(e) => handleElementClick(e, el.id)}
                    >
                        {el.type === 'text' && (
                            <span
                                className="text-red-600 font-bold drop-shadow-md pointer-events-none"
                                style={{ fontSize: `${16 * zoom}px` }}
                            >
                                {el.properties.content}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
