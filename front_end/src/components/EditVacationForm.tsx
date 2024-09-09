import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { VacationModel } from '../model/VacationModel';
import { editVacation, getVacations } from '../api/vactions-api';

const EditVacationForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [vacation, setVacation] = useState<VacationModel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

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
                navigate('/vacations');
            } catch (err) {
                setError('Failed to update vacation');
            }
        } else {
            setError('User token is missing or vacation data is incomplete');
        }
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
            <button type="submit">Update Vacation</button>
        </form>
    );
};

export default EditVacationForm;
