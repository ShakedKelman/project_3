import React from 'react';
import { Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { VacationModel } from '../model/VacationModel';

type Props = {
    vacations: VacationModel[];
    onViewDetails: (id: number) => void;
};

const VacationsList: React.FC<Props> = ({ vacations, onViewDetails }) => {
    return (
        <div className="d-flex flex-wrap">
            {vacations.map(vacation => (
                <Card key={vacation.id} className="m-2" style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={vacation.imageFileName} />
                    <Card.Body>
                        <Card.Title>{vacation.destination}</Card.Title>
                        <Card.Text>{vacation.description}</Card.Text>
                        <Card.Text>
                            {`Start Date: ${vacation.startDate} | End Date: ${vacation.endDate}`}
                        </Card.Text>
                        <Card.Text>{`Price: $${vacation.price}`}</Card.Text>
                        <Button variant="primary" onClick={() => onViewDetails(vacation.id ?? 0)}>View Details</Button>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default VacationsList;
