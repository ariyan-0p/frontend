import { useState, useEffect } from 'react';
import api from '../api'; 
import { useNavigate } from 'react-router-dom';
import { 
  Users, ShieldCheck, Mail, ArrowLeft, 
  UserCog, MoreVertical, Loader2, UserPlus, X, Lock, Trash2, AlertTriangle 
} from 'lucide-react';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'viewer' });
  
  // State for Delete Confirmation Modal
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchOrgUsers();
  }, []);

  const fetchOrgUsers = async () => {
    try {
      // Backend filters users by the Admin's organizationId
      const res = await api.get('/admin/users'); 
      setUsers(res.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      if (err.response?.status === 403) navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/create-user', newUser);
      alert('User successfully added to organization!');
      setShowAddForm(false);
      setNewUser({ username: '', email: '', password: '', role: 'viewer' });
      fetchOrgUsers(); 
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to create user');
    }
  };

  // Function to handle the final deletion after confirmation
  const handleDeleteUser = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/admin/user/${deleteId}`);
      setUsers(users.filter(u => u._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error deleting user');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mb-4 text-blue-500" size={48} />
        <p className="text-sm font-medium animate-pulse uppercase tracking-widest">
          Securing Admin Environment...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-10 font-sans relative">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header Section --- */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl transition-all text-slate-400 group active:scale-95"
            >
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Admin Control Center</h1>
              <p className="text-slate-400 mt-1 flex items-center gap-2 text-sm font-medium">
                Siloed Organization: <span className="text-blue-400 font-mono font-bold bg-blue-400/10 px-2 py-0.5 rounded">{currentUser?.organizationId}</span>
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg ${
              showAddForm ? 'bg-slate-800 text-slate-300' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
            }`}
          >
            {showAddForm ? <X size={20}/> : <UserPlus size={20}/>}
            {showAddForm ? 'Close Form' : 'Add New Member'}
          </button>
        </header>

        {/* --- Quick Add User Form --- */}
        {showAddForm && (
          <div className="mb-10 bg-slate-900 border border-blue-500/20 p-8 rounded-[2.5rem] shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <UserPlus className="text-blue-500" size={24} />
              Provision New Organization User
            </h3>
            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-500 ml-1">Username</label>
                <input type="text" placeholder="Full Name" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 ring-blue-500 text-sm transition-all"
                  value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-500 ml-1">Email Address</label>
                <input type="email" placeholder="staff@company.com" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 ring-blue-500 text-sm transition-all"
                  value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-500 ml-1">Temporary Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 ring-blue-500 text-sm transition-all"
                  value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-500 ml-1">System Role</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:ring-2 ring-blue-500 text-sm transition-all text-slate-300"
                  value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                  <option value="viewer">Viewer (Read-only)</option>
                  <option value="editor">Editor (Can Upload)</option>
                  <option value="admin">Admin (Full Control)</option>
                </select>
              </div>
              <button type="submit" className="lg:col-span-4 mt-2 bg-blue-600 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-blue-500 transition shadow-xl shadow-blue-900/40 active:scale-[0.98]">
                Deploy Member Account
              </button>
            </form>
          </div>
        )}

        {/* --- User Table Card --- */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
          
          <div className="p-8 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600/10 p-2.5 rounded-xl">
                <Users size={24} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white">Organization Directory</h3>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-slate-500 uppercase">Tenant Load:</span>
               <span className="text-xs bg-slate-800 px-4 py-1.5 rounded-full text-blue-400 border border-slate-700 font-mono font-bold">
                 {users.length} Registered Nodes
               </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="px-10 py-6">User Identity</th>
                  <th className="px-10 py-6 text-center">Security Role</th>
                  <th className="px-10 py-6 text-center">Status</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-blue-600/[0.02] transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-bold text-blue-400 border border-slate-700 group-hover:border-blue-500/50 group-hover:bg-slate-700/50 transition-all duration-300">
                          {u.username ? u.username[0].toUpperCase() : '?'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{u.username}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Mail size={12} /> {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <div className="flex justify-center">
                        <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                          u.role === 'admin' 
                            ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
                            : u.role === 'editor' 
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                            : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}>
                          <UserCog size={12} />
                          {u.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex justify-center">
                        <div className="flex items-center gap-2 bg-slate-800/30 px-3 py-1 rounded-lg border border-slate-800">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Verified</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      {/* Delete Action Trigger */}
                      {u._id !== currentUser.id ? (
                        <button 
                          onClick={() => setDeleteId(u._id)}
                          className="p-2.5 hover:bg-red-500/10 text-slate-600 hover:text-red-500 rounded-xl transition-all active:scale-90"
                          title="Remove User"
                        >
                          <Trash2 size={20} />
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-600 uppercase px-2">You</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {users.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-600">
              <Users size={64} className="mb-4 opacity-10" />
              <p className="text-sm font-medium uppercase tracking-widest">No members found in this organization</p>
            </div>
          )}
        </div>
      </div>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Are you sure?</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              This action will permanently remove this user from your organization and revoke all access. This cannot be undone.
            </p>
            <div className="flex gap-4">
              <button 
                disabled={isDeleting}
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                disabled={isDeleting}
                onClick={handleDeleteUser}
                className="flex-1 py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-900/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="animate-spin" size={18} /> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Footer Note --- */}
      <footer className="mt-8 text-center">
        <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em] font-bold">
          StreamSafe Management Protocol v1.0 • Secure Data Isolation Active
        </p>
      </footer>
    </div>
  );
}

export default AdminPanel;