import axios from 'axios';
import { VacationModel } from '../model/VacationModel';
import { siteConfig } from '../SiteConfig';

// Fetch all vacations or a specific vacation by ID
export const getVacations = async (id?: number): Promise<VacationModel[]> => {
    try {
        const url = id ? `http://localhost:4000/api/v1/vacations/${id}` : 'http://localhost:4000/api/v1/vacations';
        const response = await axios.get(url);
        return response.data; // Ensure this matches `VacationModel[]`
    } catch (error) {
        console.error("Error fetching vacations:", error);
        throw error;
    }
};

// Add a new vacation
// export const addVacation = async (vacation: VacationModel): Promise<void> => {
//     try {
//         await axios.post('http://localhost:4000/api/v1/vacations', vacation);
//     } catch (error) {
//         console.error("Error adding vacation:", error);
//         throw error;
//     }
// };

// api/vacations-api.ts
export const addVacation = async (formData: FormData): Promise<void> => {
    
    try {
        const response = await axios.post('http://localhost:4000/api/v1/vacations', formData, {
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
        await axios.put(`http://localhost:4000/api/v1/vacation/${id}`, vacation, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error("Error editing vacation:", error);
        throw error;
    }
};


export const getPaginatedProducts = async (page: number, limit: number = 10) => {
    const response = await fetch(`http://localhost:4000/api/v1/vacation-pg?page=${page}&limit=${limit}`);
    const data = await response.json();
    return data;
};
  

// Fetch paginated vacations with images
export const getPaginatedVacationsWithImages = async (page: number, limit: number = 10) => {
    const response = await fetch(`${siteConfig.BASE_URL}vacations-pg?page=${page}&limit=${limit}`);
    let data = await response.json();
    for (let v of data) {
        const imageRes = await fetch(`${siteConfig.BASE_URL}images/${v.id}`);
        let imagesData: string[] = await imageRes.json();
        if (imagesData.length > 0) {
            v.imageUrl = imagesData[0];
        }
    }
    return data;
};


export const uploadVacationImage = async (vacationId: number, image: File): Promise<void> => {
    const formData = new FormData();
    formData.append('image', image);
  
    const response = await fetch(`http://localhost:4000/api/v1/image/${vacationId}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
        console.error("Failed to upload image", await response.text());
    }
};

  
// export const getProductImages = async (pid: number): File[] => {
//     return []
// }