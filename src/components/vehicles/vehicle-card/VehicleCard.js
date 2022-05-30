import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { UNSAFE_RouteContext, useNavigate } from 'react-router-dom'
import './VehicleCard.scss'
import { ButtonGroup, ListGroup } from 'react-bootstrap'
import { ListGroupItem } from 'react-bootstrap'
import { formatDate } from '../../../utils/ui-utils/date-formatter'

export function VehicleCard({ vehicle, deleteVehicle }){

    const navigate = useNavigate();

    const redirectToDetails = () => {
        navigate(`/vehicle/${vehicle.id}`)
    }
    
    const editVehicleHandler = (e) => {
        e.stopPropagation() 
        
        navigate(`/vehicle/${vehicle.id}/edit`)
    }

    if(!vehicle)
    return <p>No Vehicle!</p>

    return (
        <div className="vehicle-card shadow" onClick={redirectToDetails}>
            <Card className='' style={{ width: '18rem' }}>
            <Card.Header className='text-start'><small className="text-muted text-start">Last updated {formatDate(vehicle.updated_at)}</small></Card.Header>
            <Card.Img variant='center' src={vehicle.picture} style={{width: '100%', height: '160px', objectFit: 'cover'}}/>
            <Card.Body>
                <Card.Title><b>${vehicle.price_per_day} per day</b></Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroupItem>{vehicle.brand}, {vehicle.model}, {vehicle.type}</ListGroupItem>
                <ListGroupItem>{vehicle.fuel_type}, {vehicle.seats} Seats</ListGroupItem>
            </ListGroup>
            <Card.Body>
                 <ButtonGroup>
                    <Button variant="primary" onClick={(e) => { editVehicleHandler(e) }}>Edit</Button>
                    <Button variant="danger" onClick={(e) => deleteVehicle(vehicle.id, e)}>Delete</Button>
                </ButtonGroup>
            </Card.Body>
            </Card>

        </div>
    )   
}