import axios from 'axios';
import { siteConfig } from '../../utils/SiteConfig';

// Fetch followers for a specific vacation
export const getFollowersForVacation = async (vacationId: number): Promise<{ id: number }[]> => {
    try {
        const response = await axios.get(`${siteConfig.BASE_URL}vacations/${vacationId}/followers`);
        return response.data.map((id: number) => ({ id })); // Ensure data structure is [{ id: number }]
    } catch (error) {
        console.error("Error fetching followers:", error);
        throw error;
    }
};


// Add a follower to a vacation
export const addFollower = async (userId: number, vacationId: number, token: string): Promise<void> => {
    try {
        await axios.post(`${siteConfig.BASE_URL}vacations/${vacationId}/followers`, { userId }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log('Follower added successfully');
    } catch (error) {
        console.error("Error adding follower:", error);
        throw error;
    }
};

// Remove a follower from a vacation
// Remove a follower from a vacation
export const removeFollower = async (userId: number, vacationId: number, token: string): Promise<void> => {
    try {
        await axios.delete(`${siteConfig.BASE_URL}vacations/${vacationId}/followers`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            data: { userId } // Use `data` for sending the body with a DELETE request
        });
        console.log('Follower removed successfully');
    } catch (error) {
        console.error("Error removing follower:", error);
        throw error;
    }
};
