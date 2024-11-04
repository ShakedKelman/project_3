import { createAsyncThunk } from '@reduxjs/toolkit';
import { addFollower, getFollowersForVacation, getVacationsPerUser, removeFollower } from './follower-api';
import { VacationModel } from '../../model/VacationModel';
import { AppDispatch } from '../../store/store';
import { addFollowerFailure, addFollowerPending, addFollowerSuccess, fetchFollowersFailure, fetchFollowersPending, fetchFollowersSuccess, fetchVacationsPerUserFailure, fetchVacationsPerUserPending, fetchVacationsPerUserSuccess, removeFollowerFailure, removeFollowerPending, removeFollowerSuccess } from '../../store/slices/followersSlice';

// Fetch followers for a specific vacation
export const fetchFollowers = (vacationId: number) => async (dispatch: AppDispatch) => {
    try {
        dispatch(fetchFollowersPending());
        const followers = await getFollowersForVacation(vacationId);
        dispatch(fetchFollowersSuccess(followers));
    } catch (error) {
        dispatch(fetchFollowersFailure('Failed to fetch followers'));
    }
};

// Fetch vacations for a specific user
export const fetchVacationsPerUser = ({ userId, token }: { userId: number; token?: string }) => 
    async (dispatch: AppDispatch) => {
        try {
            dispatch(fetchVacationsPerUserPending());
            const vacationIds = await getVacationsPerUser(userId, token);
            // Transform into plain objects instead of class instances
            const vacations = vacationIds.map(item => ({
                id: item.id,
                destination: '',
                description: '',
                startDate: '',
                endDate: '',
                price: 0,
                imageFileName: '',
                image_path: ''
            }));
            dispatch(fetchVacationsPerUserSuccess(vacations));
        } catch (error) {
            dispatch(fetchVacationsPerUserFailure('Failed to fetch vacations'));
        }
};




// For clearVacationsPerUser, replace it with a regular action:
export const clearVacationsPerUser = () => (dispatch: AppDispatch) => {
    dispatch(fetchVacationsPerUserSuccess([]));
};



// Add a follower to a vacation
export const addVacationFollower = ({ userId, vacationId, token }: { userId: number, vacationId: number, token: string }) => 
    async (dispatch: AppDispatch) => {
        try {
            dispatch(addFollowerPending());
            await addFollower(userId, vacationId, token);
            dispatch(addFollowerSuccess({ userId }));
        } catch (error) {
            dispatch(addFollowerFailure('Failed to add follower'));
        }
};


// Remove a follower from a vacation
export const removeVacationFollower = ({ userId, vacationId, token }: { userId: number, vacationId: number, token: string }) => 
    async (dispatch: AppDispatch) => {
        try {
            dispatch(removeFollowerPending());
            await removeFollower(userId, vacationId, token);
            dispatch(removeFollowerSuccess({ userId }));
        } catch (error) {
            dispatch(removeFollowerFailure('Failed to remove follower'));
        }
};


