// import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux';
// import { RootState } from '../../store/store';
// import { getVacations } from '../../api/vactions/vactions-api';
// import { fetchApiCalls } from '../../api/auth/authThunks';

// type Props = {}
// const Count = (props: Props) => {
// let token;
//     const { token: reduxToken, status, count } = useSelector((state: RootState) => state.auth);
// const [loading, setLoading] = useState<boolean>(false);

//    // Handling token and state logic
//    if (status === 'succeeded' && count === 0) {
//     // Token from Redux state is valid, use it
//     console.log("Token from Redux:", reduxToken);

//     // Update token in localStorage if necessary
//     if (reduxToken && reduxToken !== token) {
//         localStorage.setItem('token', reduxToken);
//         token = reduxToken; // Update the token reference
//     }
// } else {
//     console.error("Unable to fetch the token or invalid state");
// }



// useEffect(() => {
//     if (loading) return; // Prevent fetching if loading is true

//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             // const currentToken = status === 'succeeded' && count === -1 ? reduxToken : token;
//             const currentToken = reduxToken || localStorage.getItem('token') || undefined;

//             dispatch(fetchApiCalls());

         

//         } catch (error) {
//             console.error('Error fetching vacations:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     fetchData();
// }, [dispatch]);
//   return (
//     <div></div>
//   )
// }

// export default Count

export{}