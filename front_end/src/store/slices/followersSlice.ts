import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addFollower, fetchFollowers, removeFollower } from '../../api/followers/followersThunk';

interface Follower {
    id: number;
    name: string;
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
    reducers: {
        // Define any additional reducers if needed
    },
    extraReducers: builder => {
        builder
            .addCase(fetchFollowers.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchFollowers.fulfilled, (state, action: PayloadAction<Follower[]>) => {
                state.status = 'succeeded';
                state.followers = action.payload;
            })
            .addCase(fetchFollowers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(addFollower.fulfilled, (state, action) => {
                // Handle state update after adding a follower, if needed
            })
            .addCase(removeFollower.fulfilled, (state, action) => {
                // Handle state update after removing a follower, if needed
            })
            .addCase(addFollower.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(removeFollower.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export default followersSlice.reducer;
