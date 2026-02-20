import * as pdfjsLib from 'pdfjs-dist';

// Required for PDF.js to function
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

let currentPdf: pdfjsLib.PDFDocumentProxy | null = null;
const pageDimensionsCache: Record<number, { width: number; height: number }> = {};

self.onmessage = async (e: MessageEvent) => {
    const { id, action, payload } = e.data;

    try {
        if (action === 'LOAD_DOCUMENT') {
            const { url } = payload;
            const loadingTask = pdfjsLib.getDocument(url);
            currentPdf = await loadingTask.promise;

            const numPages = currentPdf.numPages;
            self.postMessage({ id, status: 'success', data: { numPages } });
        }
        else if (action === 'GET_PAGE_SIZE') {
            if (!currentPdf) throw new Error('No PDF loaded');
            const { pageNum, scale = 1.0 } = payload;

            if (!pageDimensionsCache[pageNum]) {
                const page = await currentPdf.getPage(pageNum);
                const viewport = page.getViewport({ scale: 1.0 });
                pageDimensionsCache[pageNum] = { width: viewport.width, height: viewport.height };
            }

            const base = pageDimensionsCache[pageNum];
            self.postMessage({
                id,
                status: 'success',
                data: { width: base.width * scale, height: base.height * scale }
            });
        }
        else if (action === 'RENDER_PAGE') {
            if (!currentPdf) throw new Error('No PDF loaded');
            const { pageNum, canvas, scale = 1.0 } = payload;

            const page = await currentPdf.getPage(pageNum);
            const viewport = page.getViewport({ scale });

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
                canvasContext: canvas.getContext('2d', { alpha: false }) as any,
                viewport: viewport,
            };

            await page.render(renderContext as any).promise;

            self.postMessage({ id, status: 'success', data: { width: canvas.width, height: canvas.height } });
        }
    } catch (error: any) {
        self.postMessage({ id, status: 'error', error: error.message || error.toString() });
    }
};
