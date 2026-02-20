'use client';

import React, { useState } from 'react';
import { usePDFRenderer } from '@/hooks/usePDFRenderer';
import { usePDFStore } from '@/store/usePDFStore';
import { PDFPage } from './PDFPage';

export const PDFViewer = () => {
    const [url, setUrl] = useState<string>('https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf');
    const [isLoaded, setIsLoaded] = useState(false);
    const pdfRenderer = usePDFRenderer();

    const numPages = usePDFStore((s) => s.numPages);
    const setNumPages = usePDFStore((s) => s.setNumPages);

    const handleLoad = async () => {
        if (!url) return;
        try {
            const res = await pdfRenderer.loadDocument(url);
            setNumPages(res.numPages);
            setIsLoaded(true);
        } catch (e) {
            console.error(e);
            alert('Failed to load PDF. Check browser console.');
        }
    };

    return (
        <div className="flex-1 w-full h-full overflow-y-auto bg-gray-200">
            {!isLoaded ? (
                <div className="flex flex-col items-center justify-center p-8 mt-24 max-w-xl mx-auto bg-white rounded-lg shadow border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">BoltPDF Viewer</h2>
                    <input
                        type="text"
                        placeholder="URL to .pdf file"
                        className="w-full p-3 rounded shadow mb-4 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <button
                        onClick={handleLoad}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700 w-full transition-colors"
                    >
                        Load Document
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center mx-auto pb-32">
                    {Array.from({ length: numPages }).map((_, i) => (
                        <PDFPage key={i + 1} pageNum={i + 1} pdfRenderer={pdfRenderer} />
                    ))}
                </div>
            )}
        </div>
    );
};
