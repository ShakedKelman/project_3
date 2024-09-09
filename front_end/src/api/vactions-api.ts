import axios from 'axios';
import { VacationModel } from '../model/VacationModel';

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
export const addVacation = async (vacation: VacationModel): Promise<void> => {
    try {
        await axios.post('http://localhost:4000/api/v1/vacations', vacation);
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