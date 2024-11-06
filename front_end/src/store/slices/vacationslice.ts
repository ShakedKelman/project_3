import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VacationModel } from '../../model/VacationModel';
import { RootState } from '../store';

interface VacationState {
    vacations: VacationModel[];
    paginatedVacations: VacationModel[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    isInitialized: boolean;
    currentPage: number;
    itemsPerPage: number;

}

const initialState: VacationState = {
    vacations: [],
    paginatedVacations: [],
    status: 'idle',
    error: null,
    isInitialized: false,
    currentPage: 1,
    itemsPerPage: 10
};

const vacationSlice = createSlice({
    name: 'vacation',
    initialState,
    reducers: {
        // Core vacation CRUD operations
        // addVacation(state, action: PayloadAction<VacationModel>) {
        //     state.vacations.push(action.payload);
        //     state.paginatedVacations.push(action.payload);
        //     state.status = 'succeeded';
            
        // },
        addVacation(state, action: PayloadAction<VacationModel>) {
            // Add to main vacations array
            state.vacations.unshift(action.payload);
            
            // Always update paginated vacations immediately with the new sort order
            const sortedVacations = [...state.vacations].sort((a, b) => 
                new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
            );
            
            // Get current page start and end indexes
            const startIndex = (state.currentPage - 1) * state.itemsPerPage;
            const endIndex = startIndex + state.itemsPerPage;
            
            // Update paginated vacations for current page
            state.paginatedVacations = sortedVacations.slice(startIndex, endIndex);
            state.status = 'succeeded';
        },
        setCurrentPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload;
            
            // Recalculate paginated vacations
            const sortedVacations = [...state.vacations].sort((a, b) => 
                new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
            );
            
            const startIndex = (action.payload - 1) * state.itemsPerPage;
            const endIndex = startIndex + state.itemsPerPage;
            state.paginatedVacations = sortedVacations.slice(startIndex, endIndex);
        },
        setInitialized(state) {
            state.isInitialized = true;
        },
        updateVacation(state, action: PayloadAction<VacationModel>) {
            const index = state.vacations.findIndex(v => v.id === action.payload.id);
            if (index !== -1) {
                state.vacations[index] = action.payload;
            }
            const paginatedIndex = state.paginatedVacations.findIndex(v => v.id === action.payload.id);
            if (paginatedIndex !== -1) {
                state.paginatedVacations[paginatedIndex] = action.payload;
            }
        },
        deleteVacationAction(state, action: PayloadAction<number>) {
            state.vacations = state.vacations.filter(v => v.id !== action.payload);
            state.paginatedVacations = state.paginatedVacations.filter(v => v.id !== action.payload);
        },

        // Status management
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

        // Pagination handlers
        setPaginatedVacations(state, action: PayloadAction<VacationModel[]>) {
            state.paginatedVacations = action.payload;
        },
        setAllVacations(state, action: PayloadAction<VacationModel[]>) {
            state.vacations = action.payload;
            state.status = 'succeeded';
        },
  // Follower-related updates
  updateVacationFollowerInfo(state, action: PayloadAction<{ 
    vacationId: number, 
    followerCount: number,
    isFollowing: boolean 
}>) {
    const vacation = state.vacations.find(v => v.id === action.payload.vacationId);
    if (vacation) {
        vacation.followerCount = action.payload.followerCount;
        vacation.isFollowing = action.payload.isFollowing;
    }
    
    const paginatedVacation = state.paginatedVacations.find(v => v.id === action.payload.vacationId);
    if (paginatedVacation) {
        paginatedVacation.followerCount = action.payload.followerCount;
        paginatedVacation.isFollowing = action.payload.isFollowing;
    }
},

// Batch updates
updateMultipleVacations(state, action: PayloadAction<VacationModel[]>) {
    action.payload.forEach(updatedVacation => {
        const index = state.vacations.findIndex(v => v.id === updatedVacation.id);
        if (index !== -1) {
            state.vacations[index] = updatedVacation;
        }
        
        const paginatedIndex = state.paginatedVacations.findIndex(v => v.id === updatedVacation.id);
        if (paginatedIndex !== -1) {
            state.paginatedVacations[paginatedIndex] = updatedVacation;
        }
    });
}
}
});

export const {
    addVacation,
    setInitialized,
    setCurrentPage,
    updateVacation,
    deleteVacationAction,
    setLoadingStatus,
    setErrorStatus,
    setSuccessStatus,
    setPaginatedVacations,
    setAllVacations,
    updateVacationFollowerInfo,
    updateMultipleVacations
} = vacationSlice.actions;

export const selectAllVacations = (state: RootState) => state.vacation.vacations;
export const selectPaginatedVacations = (state: RootState) => state.vacation.paginatedVacations;
export const selectVacationStatus = (state: RootState) => state.vacation.status;
export const selectVacationError = (state: RootState) => state.vacation.error;

export default vacationSlice.reducer;