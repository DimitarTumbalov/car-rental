
import './User.scss'
import { useEffect, useState } from "react";
import { Button, ButtonGroup, Card, Col, ListGroup, ListGroupItem, Row, Stack } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { deleteUser, getLoggedUser, getUserById } from "../../../utils/http-utils/user-requests";
import defaultAvatar from '../../../images/default_avatar.png';

export function User(){

    const params = useParams();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const loggedUser = getLoggedUser();

    useEffect(() => {
        if(loggedUser.role != 'admin' && (params.id && loggedUser.id != params.id))
            return navigate(`/users`);
    }, [])

    useEffect(() => {
        let paramsId = params.id;

        if(!paramsId)
            paramsId = loggedUser.id;


        getUserById(paramsId).then( response => {
            setUser(response.data);
        })
    }, [params.id])

    const editUserHandler = (e) => {
        e.stopPropagation() 
        
        navigate(`/user/${user.id}/edit`)
    }

    const deleteUserHandler = (e) => {
        e.stopPropagation();

        deleteUser(user.id).then( () => {
            if(loggedUser.role === 'admin')
                navigate(`/users`);
            else
                navigate(`/users`)
        });
    }

    if(!user)
        return null;

    return (
        <Row className="justify-content-center align-content-center">
            <Col xs='auto'>
                <Card className='shadow rounded' style={{ width: '25rem', maxWidth: '100%' }}>
                <Card.Img variant="top" src={user.picture ? user.picture : defaultAvatar} style={{ height: '370px', objectFit: 'cover' }}/>
                    <Card.Body className='bg-primary'>
                        <Card.Title className='text-light'><h3><b>{user.name}</b></h3></Card.Title>
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
                            <Button variant="danger" onClick={ (e) => deleteUserHandler(e) } >Delete</Button>
                        </ButtonGroup> 
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}