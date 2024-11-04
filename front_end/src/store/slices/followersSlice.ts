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
    vacations: VacationModel[];  
    error: string | null;
    currentUserId?: number; // Add this property

}

const initialState: FollowersState = {
    followers: [],
    vacations: [],  // Initialize this
    status: 'idle',
    error: null,
    currentUserId: undefined, // Initialize it

};
// ... existing imports ...
const followersSlice = createSlice({
    name: 'followers',
    initialState,
    reducers: {
        // State management
        clearVacationsState: (state) => {
            state.vacations = [];
            state.followers = [];
            state.status = 'idle';
            state.error = null;
        },

        // Status updates
        setLoadingStatus: (state) => {
            state.status = 'loading';
            state.error = null;
        },
        setErrorStatus: (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        setSuccessStatus: (state) => {
            state.status = 'succeeded';
            state.error = null;
        },

        // Follower management
        setFollowers: (state, action: PayloadAction<Follower[]>) => {
            state.followers = action.payload;
            state.status = 'succeeded';
        },
        addFollower: (state, action: PayloadAction<{ userId: number, vacationId: number }>) => {
            state.followers.push({ id: action.payload.userId });
            const vacation = state.vacations.find(v => v.id === action.payload.vacationId);
            if (vacation) {
                vacation.followerCount = (vacation.followerCount || 0) + 1;
                vacation.isFollowing = true;
            }
        },
        removeFollower: (state, action: PayloadAction<{ userId: number, vacationId: number }>) => {
            state.followers = state.followers.filter(f => f.id !== action.payload.userId);
            const vacation = state.vacations.find(v => v.id === action.payload.vacationId);
            if (vacation) {
                vacation.followerCount = Math.max((vacation.followerCount || 0) - 1, 0);
                vacation.isFollowing = false;
            }
        },
        setFollowersForVacations: (state, action: PayloadAction<{
            vacationId: number,
            followers: { id: number }[]
        }[]>) => {
            action.payload.forEach(({ vacationId, followers }) => {
                const vacation = state.vacations.find(v => v.id === vacationId);
                if (vacation) {
                    vacation.followerCount = followers.length;
                    // Assuming we have the current user's ID available
                    vacation.isFollowing = followers.some(f => f.id === state.currentUserId);
                }
            });
            state.status = 'succeeded';
        },

        // Vacation updates
        setVacations: (state, action: PayloadAction<VacationModel[]>) => {
            state.vacations = action.payload;
            state.status = 'succeeded';
        },
        updateVacation: (state, action: PayloadAction<VacationModel>) => {
            const index = state.vacations.findIndex(v => v.id === action.payload.id);
            if (index !== -1) {
                state.vacations[index] = action.payload;
            }
        },

        // Follower info updates
        updateFollowerInfo: (state, action: PayloadAction<{ 
            vacationId: number, 
            isFollowing: boolean,
            followerCount: number 
        }>) => {
            const vacation = state.vacations.find(v => v.id === action.payload.vacationId);
            if (vacation) {
                vacation.isFollowing = action.payload.isFollowing;
                vacation.followerCount = action.payload.followerCount;
            }
        },

 
        // Batch updates
        updateBatchFollowerInfo: (state, action: PayloadAction<{
            vacationId: number,
            isFollowing: boolean,
            followerCount: number
        }[]>) => {
            action.payload.forEach(update => {
                const vacation = state.vacations.find(v => v.id === update.vacationId);
                if (vacation) {
                    vacation.isFollowing = update.isFollowing;
                    vacation.followerCount = update.followerCount;
                }
            });
        }
    }
});



export const {
    clearVacationsState,
    setLoadingStatus,
    setErrorStatus,
    setSuccessStatus,
    setFollowers,
    addFollower,
    removeFollower,
    setFollowersForVacations,
    setVacations,
    updateVacation,
    updateFollowerInfo,
    updateBatchFollowerInfo
} = followersSlice.actions;

export const selectFollowers = (state: RootState) => state.followers.followers;
export const selectVacations = (state: RootState) => state.followers.vacations;
export const selectFollowersStatus = (state: RootState) => state.followers.status;
export const selectFollowersError = (state: RootState) => state.followers.error;

export default followersSlice.reducer;
