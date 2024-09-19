import axios from 'axios';
import { VacationModel } from '../../model/VacationModel';
import { siteConfig } from '../../utils/SiteConfig';



export const getPaginatedVacations = async (page: number, limit: number = 10): Promise<VacationModel[]> => {
    try {
        const url = `${siteConfig.BASE_URL}vacations-pg?page=${page}&limit=${limit}`;
        const response = await axios.get(url);
        return response.data; // Ensure this matches `VacationModel[]`
    } catch (error) {
        console.error("Error fetching paginated vacations:", error);
        throw error;
    }
};
