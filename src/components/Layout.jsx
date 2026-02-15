import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-950 font-sans">
      {/* Sidebar - Hidden on mobile, fixed on desktop */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-6 md:p-10 animate-in fade-in duration-500">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;