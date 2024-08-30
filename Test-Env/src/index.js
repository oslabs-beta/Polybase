import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { supabase } from '../config/supabaseClient.js';

function App() {
  const [users, setUsers] = useState([]);

  // Fetch users from Supabase when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase 
      .from('users')
      .select('*');
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);
  return (
    <div>
      <h1>Polybase Test Environment</h1>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username}  |  id:{user.id}</li>
        ))}
      </ul>
    </div>
  );
}

// init root
const container = document.getElementById('root');
const root = createRoot(container);

// render app component
root.render(<App />);