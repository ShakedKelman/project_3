import axios from 'axios';
import { VacationModel } from '../../model/VacationModel';
import { siteConfig } from '../../utils/SiteConfig';



export const getPaginatedVacations = async (page: number, limit: number = 10, id?: number): Promise<VacationModel[]> => {
    try {
        // Construct the URL with optional ID and query parameters
        const url = id 
            ? `${siteConfig.BASE_URL}vacations-pg/${id}?page=${page}&limit=${limit}`
            : `${siteConfig.BASE_URL}vacations-pg?page=${page}&limit=${limit}`;
        
        // Make the GET request
        const response = await axios.get(url);
        return response.data; // Ensure this matches `VacationModel[]`
    } catch (error) {
        console.error("Error fetching vacations:", error);
        throw error;
    }
};
// api/vacations-api.ts
