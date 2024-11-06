import axios from 'axios';
import { VacationModel } from '../../model/VacationModel';
import { siteConfig } from '../../utils/SiteConfig';

// let token= localStorage.getItem('token') || null;
import { store } from '../../store/store';

// export const getPaginatedVacations = async (page: number, limit: number = 10, token?:string): Promise<VacationModel[]> => {
//     try {
//         if (token === undefined || token === '' || token === null) throw new Error('no token provided');
//         const url = `${siteConfig.BASE_URL}vacations-pg?page=${page}&limit=${limit}&token=${token}`;
//         const response = await axios.get(url);
//         return response.data; // Ensure this matches `VacationModel[]`
//     } catch (error) {
//         console.error("Error fetching paginated vacations:", error);
//         throw error;
//     }
// };

export const getPaginatedVacations = async (page: number, limit: number = 10, token?: string): Promise<VacationModel[]> => {
    try {
        // Get token from Redux store if not provided as parameter
        const storeToken = store.getState().auth.token;
        const finalToken = token || storeToken;
        
        if (!finalToken) throw new Error('no token provided');
        
        const url = `${siteConfig.BASE_URL}vacations-pg?page=${page}&limit=${limit}&token=${finalToken}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching paginated vacations:", error);
        throw error;
    }
};