import axios from 'axios';
import { siteConfig } from '../SiteConfig';

// Fetch followers for a specific vacation
export const getFollowersForVacation = async (vacationId: number): Promise<any[]> => {
    try {
        const response = await axios.get(`${siteConfig.BASE_URL}vacations/${vacationId}/followers`);
        return response.data; // Ensure this matches the expected structure
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
export const removeFollower = async (userId: number, vacationId: number, token: string): Promise<void> => {
    try {
        await axios.delete(`${siteConfig.BASE_URL}vacations/${vacationId}/followers/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log('Follower removed successfully');
    } catch (error) {
        console.error("Error removing follower:", error);
        throw error;
    }
};