import { ListGroup } from 'react-bootstrap';
import { ListGroupItem } from 'react-bootstrap';
import { ButtonGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { useNavigate } from 'react-router-dom'
import './UserCard.scss'

export function UserCard({ user, deleteUser }){

    const navigate = useNavigate();

    const redirectToDetails = () => {
        navigate(`/user/${user.id}`)
    }
    
    if(!user)
    return <p>No User!</p>

    return (
        <div className="user-card shadow">
            <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={user.picture} />
            <Card.Body>
                <Card.Title>{user.name}</Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroupItem>Email: {user.email}</ListGroupItem>
                <ListGroupItem>Phone: {user.phone}</ListGroupItem>
            </ListGroup>
            <Card.Body>
                <ButtonGroup>
                    <Button variant="primary">Edit</Button>
                    <Button variant="danger" onClick={() => deleteUser(user.id)}>Delete</Button>
                    <Button variant="info" onClick={redirectToDetails}>Details</Button>
                </ButtonGroup>
            </Card.Body>
            </Card>

        </div>
    )   
}