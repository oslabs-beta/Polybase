import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
const supabase = require('../config/supabaseClient.js');
const connectDB = require('../config/mongoConfig.js');
const mongoUser = require('../models/mongoUser.js');

function App() {
  const [users, setUsers] = useState([]);

  // Fetch users from Supabase when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      console.log('entered psql data fetch')
      console.log(supabase);

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
    console.log('invoked psql data fetch')
  }, []);
  return (
    <div>
      <h1>Polybase Test Environment</h1>
      <h2>PSQL Users</h2>
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