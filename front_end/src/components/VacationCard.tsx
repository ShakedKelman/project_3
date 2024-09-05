import React, { useEffect, useState } from 'react';
import { VacationModel } from '../model/VacationModel';
import { addVacation, getVacations } from '../api/vactions-api';

const VacationCard: React.FC = () => {
    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [newVacation, setNewVacation] = useState<VacationModel>({
        destination: '',
        description: '',
        startDate: '',
        endDate: '',
        price: 0,
        imageFileName: ''
    });

    useEffect(() => {
        const fetchVacations = async () => {
            try {
                const fetchedVacations = await getVacations();
                setVacations(fetchedVacations);
            } catch (error) {
                console.error("Error fetching vacations:", error);
            }
        };

        fetchVacations();
    }, []);

    const handleAddVacation = async () => {
        try {
            await addVacation(newVacation);
            // Optionally, refetch or update the vacation list
            const updatedVacations = await getVacations();
            setVacations(updatedVacations);
        } catch (error) {
            console.error("Error adding vacation:", error);
        }
    };

    return (
        <div>
            <h1>Vacations</h1>
            <ul>
                {vacations.map(vacation => (
                    <li key={vacation.id}>{vacation.destination}</li>
                ))}
            </ul>
            <button onClick={handleAddVacation}>Add Vacation</button>
        </div>
    );
};

export default VacationCard;
