import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addVacationFollower, fetchFollowers, removeVacationFollower } from '../../api/followers/followersThunk';
import { RootState } from '../store';

interface Follower {
    id: number;
}

interface FollowersState {
    followers: Follower[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: FollowersState = {
    followers: [],
    status: 'idle',
    error: null,
};

const followersSlice = createSlice({
    name: 'followers',
    initialState,
    reducers: {},
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
    }
});

export const selectFollowers = (state: RootState) => state.followers.followers;

export default followersSlice.reducer;
