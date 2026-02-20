import { create } from 'zustand';
import { PDFElement, Command } from '@/lib/types';

interface PDFState {
    numPages: number;
    zoom: number;
    currentPage: number;

    // Elements state
    elements: PDFElement[];

    // History tracking
    past: Command[];
    future: Command[];

    setNumPages: (n: number) => void;
    setZoom: (z: number) => void;
    setCurrentPage: (p: number) => void;

    // Element operations
    addElement: (element: PDFElement) => void;
    removeElement: (id: string) => void;
    updateElement: (id: string, updates: Partial<PDFElement>) => void;

    // History Operations
    performAction: (command: Command) => void;
    performActionDebounced: (command: Command, debounceId: string, delay?: number) => void;
    undo: () => void;
    redo: () => void;
}

const debounceTimers: Record<string, NodeJS.Timeout> = {};

export const usePDFStore = create<PDFState>((set, get) => ({
    numPages: 0,
    zoom: 1.0,
    currentPage: 1,

    elements: [],
    past: [],
    future: [],

    setNumPages: (n) => set({ numPages: n }),
    setZoom: (z) => set({ zoom: z }),
    setCurrentPage: (p) => set({ currentPage: p }),

    addElement: (element) => set((state) => ({ elements: [...state.elements, element] })),
    removeElement: (id) => set((state) => ({ elements: state.elements.filter(e => e.id !== id) })),
    updateElement: (id, updates) => set((state) => ({
        elements: state.elements.map(e => {
            if (e.id === id) {
                // deeply merge properties if present
                const mergedProps = updates.properties
                    ? { ...e.properties, ...updates.properties }
                    : e.properties;
                return { ...e, ...updates, properties: mergedProps };
            }
            return e;
        })
    })),

    performAction: (command: Command) => {
        command.execute();
        set((state) => ({
            past: [...state.past, command],
            future: [] // clears future when new action is taken
        }));
    },

    performActionDebounced: (command: Command, debounceId: string, delay = 300) => {
        // 1. Immediately apply effect to state for UI responsiveness
        command.execute();

        // 2. Debounce the history store update
        if (debounceTimers[debounceId]) {
            clearTimeout(debounceTimers[debounceId]);
        }

        debounceTimers[debounceId] = setTimeout(() => {
            set((state) => ({
                past: [...state.past, command],
                future: []
            }));
            delete debounceTimers[debounceId];
        }, delay);
    },

    undo: () => {
        const { past, future } = get();
        if (past.length === 0) return;

        const command = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        command.undo();

        set({
            past: newPast,
            future: [command, ...future]
        });
    },

    redo: () => {
        const { past, future } = get();
        if (future.length === 0) return;

        const command = future[0];
        const newFuture = future.slice(1);

        command.execute();

        set({
            past: [...past, command],
            future: newFuture
        });
    }
}));
