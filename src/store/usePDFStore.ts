import { create } from 'zustand';

interface PDFState {
    numPages: number;
    zoom: number;
    currentPage: number;
    setNumPages: (n: number) => void;
    setZoom: (z: number) => void;
    setCurrentPage: (p: number) => void;
}

export const usePDFStore = create<PDFState>((set) => ({
    numPages: 0,
    zoom: 1.0,
    currentPage: 1,
    setNumPages: (n) => set({ numPages: n }),
    setZoom: (z) => set({ zoom: z }),
    setCurrentPage: (p) => set({ currentPage: p }),
}));
