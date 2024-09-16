import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VacationModel } from '../../model/VacationModel';
import { fetchPaginatedVacations, fetchVacations } from '../../api/vactions/vacationsThunk';

interface VacationState {
    vacations: VacationModel[];
    paginatedVacations: VacationModel[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: VacationState = {
    vacations: [],
    paginatedVacations: [],
    status: 'idle',
    error: null,
};

const vacationSlice = createSlice({
    name: 'vacation',
    initialState,
    reducers: {
        addVacation(state, action: PayloadAction<VacationModel>) {
            state.vacations.push(action.payload);
        },
        updateVacation(state, action: PayloadAction<VacationModel>) {
            const index = state.vacations.findIndex(vacation => vacation.id === action.payload.id);
            if (index !== -1) {
                state.vacations[index] = action.payload;
            }
        },
        deleteVacationReducer(state, action: PayloadAction<number>) {
            state.vacations = state.vacations.filter(vacation => vacation.id !== action.payload);
        },
    },
    extraReducers: builder => {
        // Handling paginated vacations
        builder
            .addCase(fetchPaginatedVacations.pending, state => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchPaginatedVacations.fulfilled, (state, action: PayloadAction<VacationModel[]>) => {
                state.status = 'succeeded';
                state.paginatedVacations = action.payload; // Update paginated vacations
            })
            .addCase(fetchPaginatedVacations.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Handling all vacations
            .addCase(fetchVacations.pending, state => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchVacations.fulfilled, (state, action: PayloadAction<VacationModel[]>) => {
                state.status = 'succeeded';
                state.vacations = action.payload; // Update all vacations
            })
            .addCase(fetchVacations.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { addVacation, updateVacation, deleteVacationReducer } = vacationSlice.actions;

export default vacationSlice.reducer;
