import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
const supabase = require('../config/supabaseClient.js');
const connectDB = require('../config/mongoConfig.js');
const mongoUser = require('../models/mongoUser.js');

function App() {
  const [psqlUsers, setPsqlUsers] = useState([]);
  const [mongoUsers, setMongoUsers] = useState([]);
  const [redisLeaderboard, setRedisLeaderboard] = useState([]);

  // Fetch users from Supabase when the component mounts
  useEffect(() => {
    const fetchPsqlUsers = async () => {
      console.log('entered psql data fetch')
      console.log(supabase);

      const { data, error } = await supabase 
      .from('users')
      .select('*');
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setPsqlUsers(data);
      }
    };

    fetchPsqlUsers();
    console.log('invoked psql data fetch')
  }, []);

  // fetch users from mdb via backend
  useEffect(() => {
    const fetchMongoUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/mongo-users');
        const data = await response.json();
        setMongoUsers(data);
      } catch(error) {
        console.error('Error fetching mdb users from api:', error);
      }
    };
    fetchMongoUsers();
  }, []);

  useEffect(() => {
    const fetchRedisLeaderboard = async () => {
      try {
        const response = await fetch('/redis-leaderboard');
        const leaderboard = await response.json();
        setRedisLeaderboard(leaderboard);
      } catch(err) {
        console.error('Error fetching redis data:', err);
      }
    };
    fetchRedisLeaderboard();
  }, []);

  return (
    <div>
      <h1>Polybase Test Environment</h1>
      <h2>PSQL Users</h2>
      <ul>
        {psqlUsers.map(user => (
          <li key={user.id}>{user.username}  |  id:{user.id}</li>
        ))}
      </ul>

      <h2>MDB Users</h2>
      <ul>
      {mongoUsers.map((user) => (
          <li key={user._id}>
            <strong>Username:</strong> {user.username}
            <ul>
              <li>
                <strong>Followers:</strong> 
                {user.followers && user.followers.length > 0
                  ? user.followers.join(', ')
                  : 'No followers'}
              </li>
              <li>
                <strong>Following:</strong> 
                {user.following && user.following.length > 0
                  ? user.following.join(', ')
                  : 'Not following anyone'}
              </li>
            </ul>
          </li>
        ))}
      </ul>

      <h2>Redis Leaderboard</h2>
      <ol>
        {redisLeaderboard.map((entry, index) => {
          <li key={index}>{entry.value} - {entry.score} followers</li>
        })}
      </ol>
    </div>
  );
}

// init root
const container = document.getElementById('root');
const root = createRoot(container);

// render app component
root.render(<App />);