'use client';

import { usePDFStore } from '@/store/usePDFStore';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('@/components/PDFViewer').then((m) => m.PDFViewer), { ssr: false });

export default function Home() {
  const undo = usePDFStore((s) => s.undo);
  const redo = usePDFStore((s) => s.redo);
  const past = usePDFStore((s) => s.past);
  const future = usePDFStore((s) => s.future);
  const activeTool = usePDFStore((s) => s.activeTool);
  const setActiveTool = usePDFStore((s) => s.setActiveTool);

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-gray-100 flex-col md:flex-row">
      {/* 
        Layout Strategy: Mobile-First
        - Mobile: The viewer takes full screen, with a bottom dock spanning the bottom width.
        - Desktop: Sidebar on the left, viewer taking the rest of the space.
      */}

      {/* Desktop Sidebar (Hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm z-10 shrink-0">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            BoltPDF
          </h1>
          <p className="text-sm text-gray-500 mt-1">Direct PDF Editor</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTool('select')}
            className={`w-full text-left p-3 block rounded-lg cursor-pointer font-medium transition-colors ${activeTool === 'select' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Select
          </button>
          <button
            onClick={() => setActiveTool('text')}
            className={`w-full text-left p-3 block rounded-lg cursor-pointer font-medium transition-colors ${activeTool === 'text' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Add Text
          </button>
          <button
            onClick={() => setActiveTool('shape')}
            className={`w-full text-left p-3 block rounded-lg cursor-pointer font-medium transition-colors ${activeTool === 'shape' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Add Rectangle
          </button>

          <div className="flex space-x-2 mt-4">
            <button
              onClick={undo}
              disabled={past.length === 0}
              className="flex-1 p-2 bg-gray-100 text-gray-700 disabled:opacity-50 rounded font-medium hover:bg-gray-200"
            >
              Undo
            </button>
            <button
              onClick={redo}
              disabled={future.length === 0}
              className="flex-1 p-2 bg-gray-100 text-gray-700 disabled:opacity-50 rounded font-medium hover:bg-gray-200"
            >
              Redo
            </button>
          </div>

          <div className="p-3 mt-4 text-gray-600 rounded-lg cursor-pointer font-medium hover:bg-gray-50 transition-colors">
            Edit Text
          </div>
          <div className="p-3 text-gray-600 rounded-lg cursor-pointer font-medium hover:bg-gray-50 transition-colors">
            Annotate
          </div>
        </nav>
      </aside>

      {/* Main Viewer Area */}
      <div className="flex-1 relative h-full flex flex-col bg-gray-200">
        <PDFViewer />
      </div>

      {/* Mobile Bottom Dock (Hidden on desktop) */}
      <div className="md:hidden flex h-16 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20 shrink-0 items-center justify-around px-2">
        <button
          onClick={() => setActiveTool('select')}
          className={`flex flex-col items-center p-2 ${activeTool === 'select' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <div className={`w-6 h-6 rounded-full mb-1 ${activeTool === 'select' ? 'bg-blue-100' : 'bg-gray-100'}`}></div>
          <span className="text-xs font-medium">Select</span>
        </button>
        <button
          onClick={() => setActiveTool('text')}
          className={`flex flex-col items-center p-2 ${activeTool === 'text' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <div className={`w-6 h-6 rounded-full mb-1 ${activeTool === 'text' ? 'bg-blue-100' : 'bg-gray-100'}`}></div>
          <span className="text-xs font-medium">Text</span>
        </button>
        <button
          onClick={() => setActiveTool('shape')}
          className={`flex flex-col items-center p-2 ${activeTool === 'shape' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <div className={`w-6 h-6 rounded-full mb-1 ${activeTool === 'shape' ? 'bg-blue-100' : 'bg-gray-100'}`}></div>
          <span className="text-xs font-medium">Shape</span>
        </button>
      </div>

    </main>
  );
}
