import { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, ListGroup, Row, Stack } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById } from "../../../utils/http-utils/user-requests";
import { UserCard } from "../user-card/UserCard";

export function User(props){

    const params = useParams();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getUserById(params.id).then( response => {
            setUser(response.data);
        })
    }, [params.id])

    const editUserHandler = (e) => {
        e.stopPropagation() 
        
        navigate(`/user/${user.id}/edit`)
    }

    if(!user)
        return null;

    return (
        <div>
            <Stack className="mx-auto col-xs-10 col-lg-5">

                <img className="shadow" src={user.picture} style={{width: '100%', height: '300px', objectFit: 'cover'}}></img>

                <ListGroup as="ul" className="bg-light shadow rounded-0">
                    <ListGroup.Item as="li" active><h3><b>{user.name}</b></h3></ListGroup.Item>
                    <ListGroup.Item as="li"><b>Email:</b> {user.email}</ListGroup.Item>
                    <ListGroup.Item as="li"><b>Phone:</b> {user.phone}</ListGroup.Item>
                    <ListGroup.Item as="li">
                        <ButtonGroup>
                            <Button variant="warning" onClick={ (e) => editUserHandler(e) }>Edit</Button>
                            <Button variant="danger">Delete</Button>
                        </ButtonGroup>
                    </ListGroup.Item>
                </ListGroup>

            </Stack>
        </div>
    )
}