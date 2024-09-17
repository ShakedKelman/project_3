import axios from 'axios';
import { VacationModel } from '../../model/VacationModel';
import { siteConfig } from '../../utils/SiteConfig';

// Fetch all vacations or a specific vacation by ID
export const getVacations = async (id?: number): Promise<VacationModel[]> => {
    try {
        const url = id ? `${siteConfig.BASE_URL}vacations/${id}` : `${siteConfig.BASE_URL}vacations`;
        const response = await axios.get(url);
        return response.data; // Ensure this matches `VacationModel[]`
    } catch (error) {
        console.error("Error fetching vacations:", error);
        throw error;
    }
};


// export const getPaginatedVacations = async (page: number, limit: number = 10) => {
//     const response = await fetch(`http://localhost:4000/api/v1/vacations-pg?page=${page}&limit=${limit}`);
//     const data = await response.json();
//     return data;
// };
  
// api/vacations-api.ts

export const apiAddVacation = async (formData: FormData): Promise<VacationModel> => {
    try {
        const response = await axios.post(`${siteConfig.BASE_URL}vacations`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('FormData being sent:', formData);
        console.log('Vacation added successfully', response.data);
        return response.data;
    } catch (error) {
        console.error("Error adding vacation:", error);
        throw error;
    }
};




// // Edit an existing vacation
// export const editVacation = async (id: number, vacation: VacationModel, token: string): Promise<void> => {
//     try {
//         await axios.put(`${siteConfig.BASE_URL}vacation/${id}`, vacation, {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         });
//     } catch (error) {
//         console.error("Error editing vacation:", error);
//         throw error;
//     }
// };

// Edit an existing vacation and replace the old image with a new one
export const editVacation = async (id: number, vacation: VacationModel, token: string, oldImageFileName?: string): Promise<void> => {
    try {
        // If there's an old image, attempt to remove it
        if (oldImageFileName) {
            try {
                await axios.delete(`${siteConfig.BASE_URL}image/${id}/${oldImageFileName}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log('Old image deleted successfully');
            } catch (deleteError) {
                console.error('Error deleting old image:', deleteError);
                // Optionally, handle the error or proceed with updating vacation
            }
        }

        // Update the vacation details
        await axios.put(`${siteConfig.BASE_URL}vacation/${id}`, vacation, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Vacation updated successfully');
    } catch (error) {
        console.error("Error editing vacation:", error);
        throw error;
    }
};



// api/vactions-api.ts
export const uploadVacationImage = async (vacationId: number, image: File, token: string): Promise<void> => {
    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch(`${siteConfig.BASE_URL}image/${vacationId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload image');
    }
};



// api/vacations-api.ts

// Delete a vacation by ID
export const deleteVacation = async (id: number, token: string): Promise<void> => {
    try {
        await axios.delete(`${siteConfig.BASE_URL}vacations/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log('Vacation deleted successfully');
    } catch (error) {
        console.error("Error deleting vacation:", error);
        throw error;
    }
};



