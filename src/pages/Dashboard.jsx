import { useState, useEffect } from 'react';
import api from '../api'; // Your axios helper with base URL
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, Play, ShieldAlert, CheckCircle2, 
  Clock, LogOut, Video as VideoIcon, LayoutDashboard, Users 
} from 'lucide-react';

// Connect to the backend Socket.io server
const socket = io("https://backend-7eck.onrender.com");

function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  
  // Retrieve user data and token from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Initial fetch of videos belonging to the user's organization
    fetchVideos();

    // Listen for real-time progress updates from the backend
    socket.on('videoProgress', (data) => {
      setVideos((prev) => 
        prev.map((v) => 
          v._id === data.videoId 
            ? { ...v, processingProgress: data.progress, sensitivityStatus: data.status } 
            : v
        )
      );
    });

    // Cleanup socket listener on component unmount
    return () => socket.off('videoProgress');
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await api.get('/videos'); 
      setVideos(res.data);
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.video.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', file.name);

    setUploading(true);
    try {
      const res = await api.post('/videos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Add the new video to the top of the list
      setVideos([res.data, ...videos]);
      e.target.reset(); // Reset the file input
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.msg || 'Check console'));
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      {/* --- Sidebar - Desktop --- */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col fixed h-full shadow-2xl z-50">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/20">
            <VideoIcon className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">StreamSafe</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-600/20">
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          
          {/* Admin specific menu item */}
          {user?.role === 'admin' && (
            <button 
              onClick={() => navigate('/admin/users')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 transition-all active:scale-95"
            >
              <Users size={20} />
              <span className="font-medium">Admin Panel</span>
            </button>
          )}
        </nav>

        {/* User Identity Section */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 p-4 rounded-2xl mb-4 border border-slate-700/50">
            <p className="text-sm font-semibold text-white truncate">{user?.username || 'User'}</p>
            <p className="text-[10px] text-blue-500 uppercase font-bold tracking-widest mt-0.5">{user?.role || 'Viewer'}</p>
            <p className="text-[10px] text-slate-500 truncate mt-1">Tenant ID: {user?.organizationId || 'org_default'}</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 md:ml-64 p-6 md:p-10">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Video Library</h2>
            <p className="text-slate-400 mt-1">Secure multi-tenant streaming for your organization.</p>
          </div>

          {/* RBAC: Only Admin/Editor see the Upload interface */}
          {(user?.role === 'admin' || user?.role === 'editor') && (
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-4">
              <form onSubmit={handleUpload} className="flex items-center gap-4">
                <div className="relative group">
                  <input 
                    type="file" 
                    name="video" 
                    accept="video/*" 
                    required 
                    className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600/10 file:text-blue-400 hover:file:bg-blue-600/20 cursor-pointer transition-all"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={uploading}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 active:scale-95"
                >
                  <UploadCloud size={18} />
                  {uploading ? 'Processing...' : 'Upload'}
                </button>
              </form>
            </div>
          )}
        </header>

        {/* --- Video Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {videos.map((video) => (
            <div 
              key={video._id} 
              className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Media Player / Processing Overlay */}
              <div className="relative aspect-video bg-slate-800 overflow-hidden">
                {video.sensitivityStatus === 'safe' ? (
                  <video 
                    controls 
                    className="w-full h-full object-cover" 
                    src={`http://localhost:5000/api/videos/stream/${video._id}?token=${token}`} 
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900/80 backdrop-blur-sm">
                    {video.sensitivityStatus === 'flagged' ? (
                      <div className="flex flex-col items-center">
                        <ShieldAlert size={48} className="text-red-500 mb-2 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                        <p className="text-red-400 text-xs font-bold uppercase tracking-widest">Access Restricted</p>
                      </div>
                    ) : (
                      <>
                        <Clock size={48} className="text-blue-500 mb-2 animate-pulse" />
                        
                        {/* Real-Time Progress Bar */}
                        {video.sensitivityStatus === 'processing' && (
                          <div className="w-full mt-4">
                            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-blue-500 h-full transition-all duration-500 ease-out" 
                                style={{ width: `${video.processingProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-[10px] mt-2 text-slate-400 uppercase tracking-tighter font-bold">
                              Analyzing Content... {video.processingProgress}%
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Video Metadata Card */}
              <div className="p-5">
                <h3 className="text-white font-medium truncate mb-3 group-hover:text-blue-400 transition-colors">
                  {video.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    video.sensitivityStatus === 'safe' 
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                      : video.sensitivityStatus === 'flagged' 
                      ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                      : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                  }`}>
                    {video.sensitivityStatus === 'safe' ? <CheckCircle2 size={12}/> : <ShieldAlert size={12}/>}
                    {video.sensitivityStatus}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {videos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-600">
            <VideoIcon size={64} className="mb-4 opacity-20" />
            <p className="text-lg">No videos found in this library.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;