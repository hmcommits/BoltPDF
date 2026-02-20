import { PDFViewer } from '@/components/PDFViewer';

export default function Home() {
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
          <div className="p-3 bg-blue-50 text-blue-700 rounded-lg cursor-pointer font-medium hover:bg-blue-100 transition-colors">
            View Mode
          </div>
          <div className="p-3 text-gray-600 rounded-lg cursor-pointer font-medium hover:bg-gray-50 transition-colors">
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
