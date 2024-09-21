// import React, { useEffect } from 'react';
// import NavbarWeb from './components/navigation/NavbarWeb';
// import SiteRoutes from './components/navigation/SiteRoutes';
// import { useDispatch, useSelector } from 'react-redux';
// import { logout } from './store/slices/authSlice';
// import { AppDispatch, RootState } from './store/store';
// import { checkAuthStatus } from './utils/checkStatus';
// import { fetchApiCalls } from './api/auth/authThunks';

// const App: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { count: apiCallCount } = useSelector((state: RootState) => state.auth );
//   const { auth } = useSelector((state: RootState) => state );

//   console.log(auth)
//   useEffect(() => {

//     dispatch(fetchApiCalls);
//     console.log('HHHHHHHHHHHHHHHHHHHhhhhhhhhhhhh')
//     const performAuthCheck = () => {
//       try {
//         checkAuthStatus(dispatch);
//       } catch (error) {
//         console.error('Error performing auth check:', error);
//         // Handle potential errors here
//       }
//     };

//     // Initial check
//     performAuthCheck();

//     // Set up an interval to check auth status regularly
//     const intervalId = setInterval(performAuthCheck, 60000); // Check every minute

//     // Cleanup function to clear the interval when the component unmounts
//     return () => clearInterval(intervalId);
//   }, [dispatch]);


//   useEffect(() => {
//     console.log('apiCallCount', apiCallCount);
//      if (apiCallCount === 0) {
//         localStorage.setItem('token', '');
//      }
//   }, [apiCallCount]);

//   return (
//     <div>
//       <NavbarWeb />
//       <SiteRoutes />
//     </div>
//   );
// };

// export default App;
import React, { useEffect } from 'react';
import NavbarWeb from './components/navigation/NavbarWeb';
import SiteRoutes from './components/navigation/SiteRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store/store';
import { handleApiCalls, setupAuthCheck } from './utils/handleApiaclls';
import { fetchApiCalls, logoutUser } from './api/auth/authThunks';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { count: apiCallCount, status } = useSelector((state: RootState) => state.auth);
  const { auth } = useSelector((state: RootState) => state);

  console.log(auth);

  useEffect(() => {
    console.log('App.tsx calling handleApiCalls');

    // Handle API calls
    handleApiCalls(dispatch);

  }, [dispatch]);

  useEffect(() => {
    console.log('App.tsx calling cleanupAuthCheck');
    // Set up the authentication check
    const cleanupAuthCheck = setupAuthCheck(dispatch);

    // Cleanup function when the component unmounts
    return () => cleanupAuthCheck();

  }, [dispatch]);
      
  useEffect(() => {
    console.log('App.tsx apiCallCount', apiCallCount);
    if (apiCallCount === 0) {
      dispatch(logoutUser());
    }
  }, [apiCallCount]);

  return (
    <div>
        <NavbarWeb />
        <SiteRoutes />
    </div>
  );
};

export default App;
