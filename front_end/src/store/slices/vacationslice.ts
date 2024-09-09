import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VacationModel } from '../../model/VacationModel';
import { fetchVacations } from '../../api/vacationsThunk';

interface VacationState {
    vacations: VacationModel[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: VacationState = {
    vacations: [],
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
    },
    extraReducers: builder => {
        builder
            .addCase(fetchVacations.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchVacations.fulfilled, (state, action: PayloadAction<VacationModel[]>) => {
                state.status = 'succeeded';
                state.vacations = action.payload;
            })
            .addCase(fetchVacations.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { addVacation, updateVacation } = vacationSlice.actions;

export default vacationSlice.reducer;
