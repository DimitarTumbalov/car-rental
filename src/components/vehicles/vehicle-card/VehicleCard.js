import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { useNavigate } from 'react-router-dom'
import './VehicleCard.scss'
import { ButtonGroup, ListGroup } from 'react-bootstrap'
import { ListGroupItem } from 'react-bootstrap'
import { formatDate } from '../../../utils/ui-utils/date-formatter'
import { getLoggedUser } from '../../../utils/http-utils/user-requests'

export function VehicleCard({ vehicle, deleteVehicle }){

    const navigate = useNavigate();

    const loggedUser = getLoggedUser();

    const redirectToDetails = () => {
        navigate(`/vehicle/${vehicle.id}`);
    }
    
    const editVehicleHandler = (e) => {
        e.stopPropagation() 
        
        navigate(`/vehicle/${vehicle.id}/edit`);
    }

    const rentVehicleHandler = (e) => {
        e.stopPropagation() 
        
        navigate(`/vehicle/${vehicle.id}/rent`);
    }

    if(!vehicle)
        return <p>No Vehicle</p>

    return (
        <div className="vehicle-card shadow rounded" onClick={redirectToDetails}>
            <Card className='' style={{ width: '18rem' }}>
            <Card.Header className='text-start'><small className="text-muted text-start">Last updated {formatDate(vehicle.updated_at)}</small></Card.Header>
            <Card.Img variant='center' src={vehicle.picture} style={{width: '100%', height: '160px', objectFit: 'cover'}}/>
            <Card.Body>
                <Card.Title><b>${vehicle.price_per_day} per day</b></Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroupItem>{vehicle.brand} {vehicle.model}, {vehicle.type}</ListGroupItem>
                <ListGroupItem>{vehicle.fuel_type}, {vehicle.seats} Seats</ListGroupItem>
            </ListGroup>
            <Card.Body>
                { loggedUser?.role === 'admin' ? 
                    (
                        vehicle.rented ?
                        (
                            <ButtonGroup>
                                <Button variant="outline-dark" disabled onClick={ (e) => rentVehicleHandler(e) }>RENTED</Button>
                                <Button variant="dark" onClick={(e) => editVehicleHandler(e) }>Edit</Button>
                                <Button variant="danger" onClick={(e) => deleteVehicle(vehicle.id, e)}>Delete</Button>
                            </ButtonGroup>
                        ) :
                        (
                            <ButtonGroup>
                                <Button variant="outline-primary" disabled onClick={ (e) => rentVehicleHandler(e) }>FOR RENT</Button>
                                <Button variant="dark" onClick={(e) => editVehicleHandler(e) }>Edit</Button>
                                <Button variant="danger" onClick={(e) => deleteVehicle(vehicle.id, e)}>Delete</Button>
                            </ButtonGroup>
                        )
                    ) :
                    (
                        vehicle.rented ?
                        (
                            <Button variant="outline-primary" disabled onClick={ (e) => rentVehicleHandler(e) }>RENTED UNTIL {vehicle.rented_until}</Button>
                        ) :
                        (
                            <Button variant="primary" onClick={ (e) => rentVehicleHandler(e) }>Rent Vehicle</Button>
                        )
                    )
                }
            </Card.Body>
            </Card>

        </div>
    )   
}