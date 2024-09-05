import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { loginUser } from '../api/authThunks';

const LoginComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authStatus = useSelector((state: RootState) => state.auth.status);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = () => {
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        setLoginSuccess(true); // Update state to show success message
      })
      .catch(() => {
        setLoginSuccess(false); // Handle failure if needed
      });
  };

  if (loginSuccess) {
    return <div>Login successful! Welcome back!</div>; // Show success message
  }

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin} disabled={authStatus === 'loading'}>
        Login
      </button>
      {authStatus === 'failed' && <div>Login failed. Please try again.</div>}
    </div>
  );
};

export default LoginComponent;
