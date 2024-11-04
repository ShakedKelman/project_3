// api/vacationsThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { VacationModel } from '../../model/VacationModel';
import { getVacations } from './vactions-api';
import { getPaginatedVacations } from './paginated-vacations-api';
import { RootState } from '../../store/store';
import { fetchPaginatedVacationsFulfilled, fetchPaginatedVacationsPending, fetchPaginatedVacationsRejected, fetchVacationsFulfilled, fetchVacationsPending, fetchVacationsRejected } from '../../store/slices/vacationslice';


export const fetchVacations = createAsyncThunk(
    'vacation/fetchVacations',
    async ({ token }: {token?: string; }, { dispatch }) => {
        try {
            dispatch(fetchVacationsPending());
            const vacations = await getVacations(undefined, token);
            dispatch(fetchVacationsFulfilled(vacations));
            return vacations;
        } catch (error) {
            dispatch(fetchVacationsRejected('Failed to fetch vacations'));
            throw error;
        }
    }
);


export const fetchPaginatedVacations = createAsyncThunk(
    'vacation/fetchPaginatedVacations',
    async ({ page, limit, token }: { page: number; limit: number; token?: string; }, { dispatch }) => {
        try {
            dispatch(fetchPaginatedVacationsPending());
            const vacations = await getPaginatedVacations(page, limit, token);
            dispatch(fetchPaginatedVacationsFulfilled(vacations));
            return vacations;
        } catch (error) {
            dispatch(fetchPaginatedVacationsRejected('Failed to fetch vacations'));
            throw error;
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
