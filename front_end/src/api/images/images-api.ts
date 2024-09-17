import axios from "axios";
import { siteConfig } from "../../utils/SiteConfig";

export const getImageForVacation = async (vacationId: number): Promise<string[]> => {
    try {
        const response = await axios.get(`${siteConfig.BASE_URL}vacations/${vacationId}/image`);
        
        console.log("Raw response:", response);
        console.log("Response data:", response.data);
        
        if (Array.isArray(response.data)) {
            if (response.data.length === 0) {
                // console.log("No images found for this vacation.");
                return [];
            }
            
            // Check if the response contains image objects or just image paths
            const imagePaths = response.data.map((item: any) => 
                typeof item === 'string' ? item : item.image_path
            );
            
            // console.log("Fetched images:", imagePaths);
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


// // api/vacations-api.ts
// export const deleteImage = async (vacationId: number, imageName: string, token: string): Promise<void> => {
//     try {
//         await axios.delete(`${siteConfig.BASE_URL}image/${vacationId}/${imageName}`, {
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//             },
//         });
//         console.log('Image deleted successfully');
//     } catch (error) {
//         console.error("Error deleting image:", error);
//         throw error;
//     }
// };
export const deleteImage = async (vacationId: number, imageName: string, token: string): Promise<void> => {
    try {
        await axios.delete(`http://localhost:4000/api/v1/image/${vacationId}/${imageName}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log('Image deleted successfully');
    } catch (error) {
        console.error("Error deleting image:", error);
        throw error;
    }
};