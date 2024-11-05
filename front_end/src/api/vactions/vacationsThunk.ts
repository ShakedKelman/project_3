// api/vacationsThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { VacationModel } from '../../model/VacationModel';
import { getVacations } from './vactions-api';
import { getPaginatedVacations } from './paginated-vacations-api';
import { RootState } from '../../store/store';
import { getFollowersForVacation } from '../followers/follower-api';


export const fetchVacations = createAsyncThunk(
    'vacation/fetchVacations',
    async ({ token } : {token?: string; }, thunkAPI) => {
        try {
            const vacations = await getVacations(undefined, token);
            console.log('Fetched vacations:', vacations); // Add this log

            return vacations;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to fetch vacations');
        }
    }
);

export const fetchPaginatedVacations = createAsyncThunk(
    'vacation/fetchPaginatedVacations',
    async ({ page, limit, token }: { page: number; limit: number; token?: string; }, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const { token: reduxToken, count } = state.auth;

        try {
            const vacations = await getPaginatedVacations(page, limit ,token);
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
// export const initializeVacations = createAsyncThunk(
//     'vacation/initialize',
//     async ({ token, userId }: { token: string, userId?: number }, thunkAPI) => {
//         try {
//             const allVacations = await getVacations(undefined, token);
            
//             const followerUpdates = await Promise.all(
//                 allVacations.map(async (vacation) => {
//                     if (!vacation.id) return null;
//                     const followers = await getFollowersForVacation(vacation.id, token);
//                     return {
//                         ...vacation,
//                         followerCount: followers.length,
//                         isFollowing: userId ? followers.some(f => f.id === userId) : false
//                     } as VacationModel;
//                 })
//             );

//             return followerUpdates.filter((update): update is VacationModel => update !== null);
//         } catch (error) {
//             return thunkAPI.rejectWithValue('Failed to initialize vacations');
//         }
//     }
// );
export const initializeVacations = createAsyncThunk(
    'vacation/initialize',
    async ({ token, userId }: { token: string, userId?: number }, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        
        // Check if we already have initialized vacations
        if (state.vacation.isInitialized && state.vacation.vacations.length > 0) {
            return state.vacation.vacations;
        }

        try {
            // Single fetch for all vacations
            const allVacations = await getVacations(undefined, token);
            
            // Batch fetch followers for all vacations in a single Promise.all
            const followerPromises = allVacations.map(vacation => 
                vacation.id ? getFollowersForVacation(vacation.id, token) : Promise.resolve([])
            );

            const allFollowers = await Promise.all(followerPromises);

            // Map followers to vacations
            const updatedVacations = allVacations.map((vacation, index) => ({
                ...vacation,
                followerCount: allFollowers[index].length,
                isFollowing: userId ? allFollowers[index].some(f => f.id === userId) : false
            }));

            return updatedVacations;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to initialize vacations');
        }
    },
    {
        // Add condition to prevent duplicate calls
        condition: (_, { getState }) => {
            const state = getState() as RootState;
            const { isInitialized, status } = state.vacation;
            // Only allow the action if we're not initialized and not currently loading
            return !isInitialized && status !== 'loading';
        }
    }
);