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


// api/vacations-api.ts
export const addVacation = async (formData: FormData): Promise<void> => {
    
    try {
        const response = await axios.post(`${siteConfig.BASE_URL}vacations`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('FormData being sent:', formData);
        console.log('Vacation added successfully', response.data);
    } catch (error) {
        console.error("Error adding vacation:", error);
        throw error;
    }
};



// Edit an existing vacation
export const editVacation = async (id: number, vacation: VacationModel, token: string): Promise<void> => {
    try {
        await axios.put(`${siteConfig.BASE_URL}vacation/${id}`, vacation, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
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




