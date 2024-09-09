import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { VacationModel } from '../model/VacationModel';
import { editVacation, getVacations } from '../api/vactions-api';
import { updateVacation } from '../store/slices/vacationslice';

const EditVacationForm: React.FC = () => {

    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();
    const [vacation, setVacation] = useState<VacationModel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            getVacations(Number(id))
                .then(data => {
                    if (data.length > 0) {
                        setVacation(data[0]); // Assuming the response is an array with one object
                    } else {
                        setError('Vacation not found');
                    }
                    setIsLoading(false);
                })
                .catch(err => {
                    setError('Failed to fetch vacation details');
                    setIsLoading(false);
                });
        }
    }, [id]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (user?.token && vacation) {
            try {
                await editVacation(Number(id), vacation, user.token);
                setSuccessMessage('Vacation updated successfully!');
                dispatch(updateVacation(vacation)); // Update state with the updated vacation
                navigate('/vacations');
            } catch (err) {
                setError('Failed to update vacation');
            }
        } else {
            setError('User token is missing or vacation data is incomplete');
        }
    };

    const formatDate = (date: string | undefined) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    if (!vacation) return <div>Vacation not found</div>;

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Destination:</label>
                <input
                    type="text"
                    value={vacation.destination}
                    onChange={(e) => setVacation({ ...vacation, destination: e.target.value })}
                />
            </div>
            <div>
                <label>Description:</label>
                <textarea
                    value={vacation.description}
                    onChange={(e) => setVacation({ ...vacation, description: e.target.value })}
                />
            </div>
            <div>
                <label>Start Date:</label>
                <input
                    type="date"
                    value={formatDate(vacation.startDate)}
                    onChange={(e) => setVacation({ ...vacation, startDate: e.target.value })}
                />
            </div>
            <div>
                <label>End Date:</label>
                <input
                    type="date"
                    value={formatDate(vacation.endDate)}
                    onChange={(e) => setVacation({ ...vacation, endDate: e.target.value })}
                />
            </div>
            <div>
                <label>Price:</label>
                <input
                    type="number"
                    value={vacation.price}
                    onChange={(e) => setVacation({ ...vacation, price: Number(e.target.value) })}
                />
            </div>
            <div>
                <label>Image File Name:</label>
                <input
                    type="text"
                    value={vacation.imageFileName || ''}
                    onChange={(e) => setVacation({ ...vacation, imageFileName: e.target.value })}
                />
            </div>
            <button type="submit">Update Vacation</button>
            {successMessage && <div>{successMessage}</div>}
        </form>
    );
};

export default EditVacationForm;
