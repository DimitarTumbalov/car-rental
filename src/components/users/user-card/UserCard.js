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
    
    const editUserHandler = (e) => {
        e.stopPropagation() 
        
        navigate(`/user/${user.id}/edit`)
    }

    if(!user)
    return <p>No User!</p>

    return (
        <div className="user-card shadow rounded" onClick={redirectToDetails}>
            <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={user.picture} style={{ height: '300px', objectFit: 'cover' }}/>
            <Card.Body>
                <Card.Title>{user.name}</Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroupItem><span className='key'>Email:</span> {user.email}</ListGroupItem>
                <ListGroupItem><span className='key'>Phone:</span> {user.phone}</ListGroupItem>
            </ListGroup>
            <Card.Body>
                <ButtonGroup>
                    <Button variant="dark" onClick={ (e) => editUserHandler(e) }>Edit</Button>
                    <Button variant="danger" onClick={(e) => deleteUser(user.id, e)}>Delete</Button>
                </ButtonGroup>
            </Card.Body>
            </Card>

        </div>
    )   
}