import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // Define the Production Backend URL
  const API_BASE_URL = "https://backend-7eck.onrender.com"; //

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Updated URL to use the deployed Render server instead of localhost
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

  return (
    <Layout user={user}>
      <h2 className="text-3xl font-bold mb-6">User Management</h2>
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
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
                  <td className="p-4 font-medium">{u.username}</td>
                  <td className="p-4 text-gray-400">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      u.role === 'admin' ? 'bg-red-900 text-red-300' : 
                      u.role === 'editor' ? 'bg-blue-900 text-blue-300' : 'bg-gray-600 text-gray-200'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 font-mono">{u.organizationId}</td>
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
    </Layout>
  );
};

export default AdminUsers;