import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { AppDispatch } from '../store/store';
import { login as loginApi } from '../api/auth-api';

const Navbar: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Fetch the token by logging in through the API
      const token = await loginApi(email, password);

      // Dispatch the login action with the token
      dispatch(login(token)); // Ensure this only sends the token string, not an object
    } catch (error) {
      console.error('Login failed:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <nav>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </nav>
  );
};

export default Navbar;
