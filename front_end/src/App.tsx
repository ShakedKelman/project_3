import React, { useEffect } from 'react';
import NavbarWeb from './components/navigation/NavbarWeb';
import SiteRoutes from './components/navigation/SiteRoutes';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout } from './store/slices/authSlice';
import { AppDispatch } from './store/store';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const checkAuthStatus = () => {
      const user = localStorage.getItem('user');

      if (user) {
        const parsedUser = JSON.parse(user);
        dispatch(loginSuccess(parsedUser));
      } else {
        dispatch(logout());
      }
    };

    checkAuthStatus();

    // Set up an interval to check auth status regularly
    const intervalId = setInterval(checkAuthStatus, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <div>
      <NavbarWeb />
      <SiteRoutes />
    </div>
  );
};

export default App;
