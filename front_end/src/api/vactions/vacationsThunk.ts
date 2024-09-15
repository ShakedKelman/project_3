// api/vacationsThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { VacationModel } from '../../model/VacationModel';
import { getVacations } from './vactions-api';

// export const fetchVacations = createAsyncThunk<VacationModel[]>(
//   'vacations/fetchVacations',
//   async (_, { rejectWithValue }) => {
//     try {
//       const vacations: VacationModel[] = await getVacations();
//       return vacations;
//     } catch (error: any) {
//       console.error('Failed to fetch vacations:', error.message);
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const fetchVacations = createAsyncThunk(
    'vacation/fetchVacations',
    async (_, thunkAPI) => {
        try {
            const vacations = await getVacations();
            return vacations;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to fetch vacations');
        }
    }
);


export const deleteVacation = createAsyncThunk(
    'vacation/deleteVacation',
    async (id: number, thunkAPI) => {
        try {
            await deleteVacation(id);
            // Optionally fetch the updated list of vacations
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to delete vacation');
        }
    }
);
