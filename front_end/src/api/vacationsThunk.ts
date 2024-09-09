// api/vacationsThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { VacationModel } from '../model/VacationModel';
import { getVacations } from './vactions-api';

export const fetchVacations = createAsyncThunk<VacationModel[]>(
  'vacations/fetchVacations',
  async (_, { rejectWithValue }) => {
    try {
      const vacations: VacationModel[] = await getVacations();
      return vacations;
    } catch (error: any) {
      console.error('Failed to fetch vacations:', error.message);
      return rejectWithValue(error.message);
    }
  }
);
