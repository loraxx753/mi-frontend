import React, { useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Update page title based on current path
  useEffect(() => {
    const path = window.location.pathname;
    const title = path === '/' ? 'Meanwhile Framework' : 'Meanwhile Framework';
    document.title = title;
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-300/50 sticky top-0 z-50" style={{ width: '100vw' }}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">M</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-800 leading-none">Meanwhile Framework</span>
                <span className="text-xs text-gray-600 leading-none">Minimal Front-End</span>
              </div>
            </a>
            <nav className="hidden md:flex items-center space-x-6">
              <a className="text-gray-700 hover:text-gray-900 transition-colors" href="/">Home</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;