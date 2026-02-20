'use client';

import { usePDFStore } from '@/store/usePDFStore';
import { AddElementCommand } from '@/lib/commands';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('@/components/PDFViewer').then((m) => m.PDFViewer), { ssr: false });

export default function Home() {
  const performAction = usePDFStore((s) => s.performAction);
  const undo = usePDFStore((s) => s.undo);
  const redo = usePDFStore((s) => s.redo);
  const currentPage = usePDFStore((s) => s.currentPage);
  const past = usePDFStore((s) => s.past);
  const future = usePDFStore((s) => s.future);

  const handleAddText = () => {
    const id = crypto.randomUUID();
    const cmd = new AddElementCommand({
      id,
      type: 'text',
      page: currentPage,
      x: 100,
      y: 100,
      properties: { content: 'Hello World' },
    });
    performAction(cmd);
  };
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
          {/* Placeholder tools */}
          <button
            onClick={handleAddText}
            className="w-full text-left p-3 block bg-blue-50 text-blue-700 rounded-lg cursor-pointer font-medium hover:bg-blue-100 transition-colors"
          >
            Add Test Text
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
        <button className="flex flex-col items-center p-2 text-blue-600">
          <div className="w-6 h-6 bg-blue-100 rounded-full mb-1"></div>
          <span className="text-xs font-medium">View</span>
        </button>
        <button className="flex flex-col items-center p-2 text-gray-500">
          <div className="w-6 h-6 bg-gray-100 rounded-full mb-1"></div>
          <span className="text-xs font-medium">Edit</span>
        </button>
        <button className="flex flex-col items-center p-2 text-gray-500">
          <div className="w-6 h-6 bg-gray-100 rounded-full mb-1"></div>
          <span className="text-xs font-medium">Tools</span>
        </button>
      </div>

    </main>
  );
}
