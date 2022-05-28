import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { useNavigate } from 'react-router-dom'
import './VehicleCard.scss'
import { ButtonGroup, ListGroup } from 'react-bootstrap'
import { ListGroupItem } from 'react-bootstrap'

export function VehicleCard({ vehicle, deleteVehicle }){

    const navigate = useNavigate();

    const redirectToDetails = () => {
        navigate(`/vehicle/${vehicle.id}`)
    }
    
    if(!vehicle)
    return <p>No Vehicle!</p>

    return (
        <div className="vehicle-card shadow">
            <Card className='' style={{ width: '18rem' }}>
            <Card.Header className='text-start'><small className="text-muted text-start">Last updated 3 mins ago</small></Card.Header>
            <Card.Img variant='center' src={vehicle.picture}/>
            <Card.Body>
                <Card.Title><b>${vehicle.price_per_day} per day</b></Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroupItem>{vehicle.brand}, {vehicle.model}, {vehicle.type}</ListGroupItem>
                <ListGroupItem>{vehicle.fuel_type}, {vehicle.seats} Seats</ListGroupItem>
            </ListGroup>
            <Card.Body>
                 <ButtonGroup>
                    <Button variant="primary">Edit</Button>
                    <Button variant="danger" onClick={() => deleteVehicle(vehicle.id)}>Delete</Button>
                    <Button variant="info" onClick={redirectToDetails}>Details</Button>
                </ButtonGroup>
            </Card.Body>
            </Card>

        </div>
    )   
}