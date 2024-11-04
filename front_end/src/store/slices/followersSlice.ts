import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addVacationFollower, fetchFollowers, fetchVacationsPerUser, removeVacationFollower } from '../../api/followers/followersThunk';
import { RootState } from '../store';
import { VacationModel } from '../../model/VacationModel';

interface Follower {
    id: number;
}

interface FollowersState {
    followers: Follower[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    vacations: VacationModel[];  // Add this
    error: string | null;
}

const initialState: FollowersState = {
    followers: [],
    vacations: [],  // Initialize this
    status: 'idle',
    error: null,
};

const followersSlice = createSlice({
    name: 'followers',
    initialState,
    reducers: {
        clearVacationsState: (state) => {
            state.vacations = [];
            state.status = 'idle';
            state.error = null;
        },
        // Add new reducers
        fetchFollowersPending: (state) => {
            state.status = 'loading';
            state.error = null;
        },
        fetchFollowersSuccess: (state, action: PayloadAction<Follower[]>) => {
            state.status = 'succeeded';
            state.followers = action.payload;
        },
        fetchFollowersFailure: (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        addFollowerPending: (state) => {
            state.status = 'loading';
        },
        addFollowerSuccess: (state, action: PayloadAction<{ userId: number }>) => {
            state.status = 'succeeded';
            state.followers.push({ id: action.payload.userId });
        },
        addFollowerFailure: (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        removeFollowerPending: (state) => {
            state.status = 'loading';
        },
        removeFollowerSuccess: (state, action: PayloadAction<{ userId: number }>) => {
            state.status = 'succeeded';
            state.followers = state.followers.filter(follower => follower.id !== action.payload.userId);
        },
        removeFollowerFailure: (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        fetchVacationsPerUserPending: (state) => {
            state.status = 'loading';
        },
        fetchVacationsPerUserSuccess: (state, action: PayloadAction<VacationModel[]>) => {
            state.status = 'succeeded';
            state.vacations = action.payload;
        },
        fetchVacationsPerUserFailure: (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        }
    }
});

// Export all actions
export const {
    clearVacationsState,
    fetchFollowersPending,
    fetchFollowersSuccess,
    fetchFollowersFailure,
    addFollowerPending,
    addFollowerSuccess,
    addFollowerFailure,
    removeFollowerPending,
    removeFollowerSuccess,
    removeFollowerFailure,
    fetchVacationsPerUserPending,
    fetchVacationsPerUserSuccess,
    fetchVacationsPerUserFailure
} = followersSlice.actions;

export const selectFollowers = (state: RootState) => state.followers.followers;
export const selectVacations = (state: RootState) => state.followers.vacations;

export default followersSlice.reducer;
