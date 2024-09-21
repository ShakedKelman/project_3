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
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFollowers.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        });
        builder.addCase(fetchFollowers.fulfilled, (state, action: PayloadAction<Follower[]>) => {
            state.status = 'succeeded';
            state.followers = action.payload;
        });
        builder.addCase(fetchFollowers.rejected, (state, action: PayloadAction<any>) => {
            state.status = 'failed';
            state.error = action.payload;
        });

        builder.addCase(addVacationFollower.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(addVacationFollower.fulfilled, (state, action: PayloadAction<{ userId: number }>) => {
            state.status = 'succeeded';
            state.followers.push({ id: action.payload.userId });
        });
        builder.addCase(addVacationFollower.rejected, (state, action: PayloadAction<any>) => {
            state.status = 'failed';
            state.error = action.payload;
        });

        builder.addCase(removeVacationFollower.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(removeVacationFollower.fulfilled, (state, action: PayloadAction<{ userId: number }>) => {
            state.status = 'succeeded';
            state.followers = state.followers.filter(follower => follower.id !== action.payload.userId);
        });
        builder.addCase(removeVacationFollower.rejected, (state, action: PayloadAction<any>) => {
            state.status = 'failed';
            state.error = action.payload;
        });
             // Handle fetch vacations per user
        builder.addCase(fetchVacationsPerUser.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(fetchVacationsPerUser.fulfilled, (state, action: PayloadAction<VacationModel[]>) => {
            state.status = 'succeeded';
            state.vacations = action.payload; // This expects VacationModel[]
        });
        
        builder.addCase(fetchVacationsPerUser.rejected, (state, action: PayloadAction<any>) => {
            state.status = 'failed';
            state.error = action.payload;
        });
 
    }
});
export const { clearVacationsState } = followersSlice.actions;

export const selectFollowers = (state: RootState) => state.followers.followers;
export const selectVacations = (state: RootState) => state.followers.vacations;

export default followersSlice.reducer;
