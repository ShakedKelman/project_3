import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { siteConfig } from '../../utils/SiteConfig';

// Define types for followers
interface Follower {
    id: number;
    name: string;
}

// Thunk to fetch followers for a specific vacation
export const fetchFollowers = createAsyncThunk<Follower[], number>(
    'followers/fetchFollowers',
    async (vacationId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${siteConfig.BASE_URL}vacations/${vacationId}/followers`);
            return response.data;
        } catch (error) {
            return rejectWithValue('Error fetching followers');
        }
    }
);

// Thunk to add a follower to a vacation
export const addFollower = createAsyncThunk<void, { userId: number; vacationId: number; token: string }>(
    'followers/addFollower',
    async ({ userId, vacationId, token }, { rejectWithValue }) => {
        try {
            await axios.post(`${siteConfig.BASE_URL}vacations/${vacationId}/followers`, { userId }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
        } catch (error) {
            return rejectWithValue('Error adding follower');
        }
    }
);

// Thunk to remove a follower from a vacation
export const removeFollower = createAsyncThunk<void, { userId: number; vacationId: number; token: string }>(
    'followers/removeFollower',
    async ({ userId, vacationId, token }, { rejectWithValue }) => {
        try {
            await axios.delete(`${siteConfig.BASE_URL}vacations/${vacationId}/followers/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
        } catch (error) {
            return rejectWithValue('Error removing follower');
        }
    }
);
