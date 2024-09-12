import axios from "axios";
import { siteConfig } from "../../utils/SiteConfig";

export const getImagesForVacation = async (vacationId: number): Promise<string[]> => {
    try {
        const response = await axios.get(`${siteConfig.BASE_URL}vacations/${vacationId}/images`);
        
        console.log("Raw response:", response);
        console.log("Response data:", response.data);
        
        if (Array.isArray(response.data)) {
            if (response.data.length === 0) {
                console.log("No images found for this vacation.");
                return [];
            }
            
            // Check if the response contains image objects or just image paths
            const imagePaths = response.data.map((item: any) => 
                typeof item === 'string' ? item : item.image_path
            );
            
            console.log("Fetched images:", imagePaths);
            return imagePaths;
        } else {
            console.error("Unexpected response format:", response.data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching images:", error);
        return [];
    }
};