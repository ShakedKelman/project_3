import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VacationModel } from '../../model/VacationModel';

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

        fetchPaginatedVacationsPending(state) {
            state.status = 'loading';
            state.error = null;
        },
        fetchPaginatedVacationsFulfilled(state, action: PayloadAction<VacationModel[]>) {
            state.status = 'succeeded';
            state.paginatedVacations = action.payload;
        },
        fetchPaginatedVacationsRejected(state, action: PayloadAction<string>) {
            state.status = 'failed';
            state.error = action.payload;
        },
        // New reducers for all vacations
        fetchVacationsPending(state) {
            state.status = 'loading';
            state.error = null;
        },
        fetchVacationsFulfilled(state, action: PayloadAction<VacationModel[]>) {
            state.status = 'succeeded';
            state.vacations = action.payload;
        },
        fetchVacationsRejected(state, action: PayloadAction<string>) {
            state.status = 'failed';
            state.error = action.payload;
        }
    }
});


// ... slice definition ...

export const {
    addVacation,
    updateVacation,
    deleteVacationReducer,
    fetchPaginatedVacationsPending,
    fetchPaginatedVacationsFulfilled,
    fetchPaginatedVacationsRejected,
    fetchVacationsPending,
    fetchVacationsFulfilled,
    fetchVacationsRejected
} = vacationSlice.actions;

export default vacationSlice.reducer;
