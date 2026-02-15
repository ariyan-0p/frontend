import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Building2, Shield } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'viewer', organizationId: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData); //
      alert('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="max-w-lg w-full bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-slate-800">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="bg-emerald-600 p-3 rounded-2xl mb-4 shadow-lg shadow-emerald-900/20">
            <UserPlus className="text-white" size={28} />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Join StreamSafe</h2>
          <p className="text-slate-400 text-sm mt-2">Enterprise video management with built-in safety</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="relative md:col-span-2">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input type="text" placeholder="Full Name" className="w-full pl-12 pr-4 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500" 
              onChange={(e) => setFormData({...formData, username: e.target.value})} required />
          </div>
          <div className="relative md:col-span-2">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input type="email" placeholder="Email Address" className="w-full pl-12 pr-4 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="relative md:col-span-2">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input type="password" placeholder="Create Password" className="w-full pl-12 pr-4 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          </div>
          
          <div className="relative">
            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <select className="w-full pl-12 pr-4 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none appearance-none focus:ring-2 focus:ring-emerald-500"
              value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input type="text" placeholder="Org ID (e.g. Org_A)" className="w-full pl-12 pr-4 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500" 
              onChange={(e) => setFormData({...formData, organizationId: e.target.value})} required />
          </div>

          <button type="submit" className="md:col-span-2 mt-2 w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/40 active:scale-[0.98]">
            Create Account
          </button>
        </form>
        <p className="mt-8 text-center text-slate-400 text-sm">
          Already have an account? <Link to="/login" className="text-emerald-400 font-semibold hover:text-emerald-300">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;