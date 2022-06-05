import { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { ListGroupItem } from 'react-bootstrap';
import { ButtonGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getLoggedUser } from '../../../utils/http-utils/user-requests';
import './UserCard.scss'
import defaultAvatar from '../../../images/default_avatar.png';

export function UserCard({ user, deleteUser }){

    const navigate = useNavigate();
    const loggedUser = getLoggedUser();
    const[userClassName, setUserClassName] = useState('');

    useEffect(() => {
        if(user.role === 'admin')
            setUserClassName('text-danger')
    }, [])

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
            <Card.Img variant="top" src={user.picture ? user.picture : defaultAvatar} style={{ height: '300px', objectFit: 'cover' }}/>
            <Card.Body>
                <Card.Title className={userClassName}>{user.name}</Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroupItem><b>Email:</b> {user.email}</ListGroupItem>
                <ListGroupItem><b>Phone:</b> {user.phone}</ListGroupItem>
            </ListGroup>
            <Card.Body>
                <ButtonGroup>
                    { loggedUser.id === user.id &&
                     <Button variant="outline-success" disabled>You</Button>
                    }
                    <Button variant="dark" onClick={ (e) => editUserHandler(e) }>Edit</Button>
                    <Button variant="danger" onClick={(e) => deleteUser(user.id, e)}>Delete</Button>
                </ButtonGroup> 
            </Card.Body>
            </Card>

        </div>
    )   
}