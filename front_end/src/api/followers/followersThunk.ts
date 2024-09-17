import { createAsyncThunk } from '@reduxjs/toolkit';
import { addFollower, getFollowersForVacation, removeFollower } from './follower-api';

// Fetch followers for a specific vacation
export const fetchFollowers = createAsyncThunk(
    'followers/fetchFollowers',
    async (vacationId: number, thunkAPI) => {
        try {
            const followers = await getFollowersForVacation(vacationId);
            return followers;
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to fetch followers');
        }
    }
);

// Add a follower to a vacation
export const addVacationFollower = createAsyncThunk(
    'followers/addFollower',
    async ({ userId, vacationId, token }: { userId: number, vacationId: number, token: string }, thunkAPI) => {
        try {
            await addFollower(userId, vacationId, token);
            return { userId, vacationId };
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to add follower');
        }
    }
);

// Remove a follower from a vacation
export const removeVacationFollower = createAsyncThunk(
    'followers/removeFollower',
    async ({ userId, vacationId, token }: { userId: number, vacationId: number, token: string }, thunkAPI) => {
        try {
            await removeFollower(userId, vacationId, token);
            return { userId, vacationId };
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to remove follower');
        }
    }
);
