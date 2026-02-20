'use client';

import { useCallback, useRef, useMemo } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Point standard parser to the worker. 
// Do not execute during SSR.
if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export const usePDFRenderer = () => {
    const currentDoc = useRef<pdfjsLib.PDFDocumentProxy | null>(null);

    const loadDocument = useCallback(async (url: string) => {
        try {
            const loadingTask = pdfjsLib.getDocument(url);
            const doc = await loadingTask.promise;
            currentDoc.current = doc;
            return { numPages: doc.numPages };
        } catch (e) {
            console.error(e);
            throw e;
        }
    }, []);

    const getPageSize = useCallback(async (pageNum: number, scale: number = 1.0) => {
        if (!currentDoc.current) throw new Error('No PDF loaded');
        const page = await currentDoc.current.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        return { width: viewport.width, height: viewport.height };
    }, []);

    const renderPage = useCallback(async (pageNum: number, canvas: OffscreenCanvas | HTMLCanvasElement, scale: number = 1.0) => {
        if (!currentDoc.current) throw new Error('No PDF loaded');
        const page = await currentDoc.current.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
            canvasContext: canvas.getContext('2d', { alpha: false }) as any,
            viewport: viewport,
        };

        await page.render(renderContext as any).promise;
        return { width: viewport.width, height: viewport.height };
    }, []);

    return useMemo(() => ({ loadDocument, getPageSize, renderPage }), [loadDocument, getPageSize, renderPage]);
};
