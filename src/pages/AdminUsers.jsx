import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Mail, Shield, User, Hash } from 'lucide-react'; // Added icons for mobile view

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // Define the Production Backend URL
  const API_BASE_URL = "https://backend-7eck.onrender.com";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/users`, { 
          headers: { 'x-auth-token': token } 
        });
        setUsers(res.data);
      } catch (err) { 
        console.error("Admin access required or server error"); 
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  // Helper to get consistent role badge styles for both Mobile and Desktop
  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-red-900/50 text-red-200 border-red-700/50',
      editor: 'bg-blue-900/50 text-blue-200 border-blue-700/50',
      viewer: 'bg-gray-700/50 text-gray-300 border-gray-600/50'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[role] || styles.viewer}`}>
        {role}
      </span>
    );
  };

  return (
    <Layout user={user}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">User Management</h2>
          <p className="text-slate-400 text-sm mt-1">Manage access and roles for your organization.</p>
        </div>
        <div className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700 text-xs text-slate-400 font-mono">
          Total Users: {users.length}
        </div>
      </div>

      {/* --- DESKTOP VIEW (Table) - Hidden on Mobile --- */}
      <div className="hidden md:block bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-gray-700/50 text-gray-400 text-sm uppercase">
            <tr>
              <th className="p-4">Username</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Org ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users.length > 0 ? (
              users.map(u => (
                <tr key={u._id} className="hover:bg-gray-700/30 transition">
                  <td className="p-4 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                    {u.username}
                  </td>
                  <td className="p-4 text-gray-400">{u.email}</td>
                  <td className="p-4">{getRoleBadge(u.role)}</td>
                  <td className="p-4 text-gray-500 font-mono text-sm">{u.organizationId}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">
                  No users found or unauthorized access.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE VIEW (Cards) - Hidden on Desktop --- */}
      <div className="md:hidden space-y-4">
        {users.length > 0 ? (
          users.map(u => (
            <div key={u._id} className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-lg flex flex-col gap-4">
              
              {/* Card Header: User Info & Role */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-lg border border-blue-600/10">
                    {u.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight">{u.username}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                      <Mail size={12} />
                      <span className="truncate max-w-[150px]">{u.email}</span>
                    </div>
                  </div>
                </div>
                {getRoleBadge(u.role)}
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-700/50 w-full" />

              {/* Card Footer: Organization Details */}
              <div className="flex items-center justify-between text-sm bg-gray-900/30 p-3 rounded-lg border border-gray-700/30">
                <span className="text-gray-500 flex items-center gap-2 text-xs uppercase font-bold tracking-wider">
                  <Shield size={12} /> Organization ID
                </span>
                <span className="font-mono text-blue-300 text-xs tracking-wide">
                  {u.organizationId}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-800 rounded-2xl border border-gray-700 border-dashed">
            <User size={48} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400">No users found.</p>
          </div>
        )}
      </div>

    </Layout>
  );
};

export default AdminUsers;