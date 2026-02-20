'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePDFStore } from '@/store/usePDFStore';

interface PDFPageProps {
    pageNum: number;
    pdfRenderer: any; // Type it strictly if needed, any for now to keep things fluid with the hook
}

export const PDFPage: React.FC<PDFPageProps> = ({ pageNum, pdfRenderer }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isRendered, setIsRendered] = useState(false);

    const zoom = usePDFStore((s) => s.zoom);
    const setCurrentPage = usePDFStore((s) => s.setCurrentPage);

    // A4 proportion base
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 800, height: 1131 });

    useEffect(() => {
        let active = true;
        pdfRenderer.getPageSize(pageNum, zoom).then((size: { width: number; height: number }) => {
            if (active) setDimensions(size);
        }).catch(console.error);
        return () => { active = false; };
    }, [pageNum, zoom, pdfRenderer]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
                if (entry.isIntersecting) {
                    // Setting currentPage if intersecting is a bit basic;
                    // in a robust reader, you'd check which page has the maximum visible area.
                    setCurrentPage(pageNum);
                }
            },
            {
                root: null,
                // Virtualization: 1-page height buffer above and below.
                rootMargin: '1200px 0px 1200px 0px',
                threshold: 0
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        return () => observer.disconnect();
    }, [pageNum, setCurrentPage]);

    useEffect(() => {
        if (isVisible && canvasRef.current) {
            let active = true;
            setIsRendered(false);

            const offscreen = canvasRef.current.transferControlToOffscreen();

            pdfRenderer.renderPage(pageNum, offscreen, zoom)
                .then(() => {
                    if (active) setIsRendered(true);
                })
                .catch(console.error);

            return () => { active = false; };
        }
    }, [isVisible, pageNum, zoom, pdfRenderer]);

    return (
        <div
            ref={containerRef}
            className="relative mx-auto my-4 bg-white shadow-xl overflow-hidden transition-all duration-300"
            style={{ width: dimensions.width, height: dimensions.height }}
        >
            {isVisible ? (
                <>
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 max-w-full max-h-full block"
                        style={{ width: dimensions.width, height: dimensions.height }}
                    />
                    {!isRendered && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse z-10">
                            <span className="text-gray-400 font-semibold tracking-wide">Rendering Skeleton {pageNum}...</span>
                        </div>
                    )}
                </>
            ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                    <span className="text-gray-300">Page {pageNum} (Offscreen)</span>
                </div>
            )}
        </div>
    );
};
