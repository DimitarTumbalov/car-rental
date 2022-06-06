import  './RentalEventCard.scss';
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { ListGroup } from 'react-bootstrap'
import { ListGroupItem } from 'react-bootstrap'
import { getLoggedUser } from '../../../utils/http-utils/user-requests'
import { useEffect, useState } from 'react';
import defaultImage from '../../../images/default_image.png';
import { useNavigate } from 'react-router-dom';

export function RentalEventCard({ rentalEvent, deleteRentalEvent }){
    const loggedUser = getLoggedUser();
    const navigate = useNavigate();
    const[endClassName, setEndClassName] = useState('text-primary');

    useEffect( () => {
        if(rentalEvent.expired)
            setEndClassName('text-danger');
    }, [])

    const redirectToDetails = () => {
        navigate(`/vehicle/${rentalEvent.vehicleId}`);
    }

    return (
        <div className="rental-event-card shadow rounded" onClick={redirectToDetails}>
            <Card style={{ width: '18rem' }}>
            <Card.Img variant='top' src={rentalEvent.picture ? rentalEvent.picture : defaultImage} style={{width: '100%', height: '160px', objectFit: 'cover'}}/>
            <Card.Body>
                <Card.Title><b>Paid price: ${rentalEvent.price}</b></Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroupItem><b>Start time:</b> {rentalEvent.startTime}</ListGroupItem>
                <ListGroupItem className={endClassName}><b>End time:</b> {rentalEvent.endTime}</ListGroupItem>
            </ListGroup>
            { loggedUser?.role === 'admin' &&
                <Card.Body>
                    { rentalEvent.expired ?
                        (
                            <Button variant="outline-danger" disabled>Finished</Button>
                        ) :
                        (
                            <Button variant="danger" onClick={(e) => deleteRentalEvent(rentalEvent.id, e)}>Cancel event</Button>
                        )
                    }

                </Card.Body>
            }
            </Card>
        </div>
    )   
}