import { useEffect, useState } from "react";
import { Col, Row, Stack } from "react-bootstrap";
import { deleteUser, getAllUsers, getLoggedUser } from "../../../utils/http-utils/user-requests";
import { UserCard } from "../user-card/UserCard";
import './UsersList.scss'

export function UsersList(){

    const [users, setUsers] = useState([]);
    const loggedUser = getLoggedUser();

    useEffect(() => {
        getAllUsers().then(response => {
            setUsers(response.data.sort((a, b) => {
                return (b.id == loggedUser.id) - (a.id == loggedUser.id);
            }));
        });
 
    }, [])

    const deleteUserHandler = async (id, e) => {
        e.stopPropagation();

       await deleteUser(id);
       setUsers(prevState => {
           return prevState.filter(user => user.id !==id)
       });
    }

    return (
        <div>
            <Row>
                <Col> 
                    <h3><b>
                        { users.length ?
                            (
                                `All users (${users.length})`
                            )
                            : 
                            (
                                'All users'
                            )
                        }
                    </b></h3>
                </Col>
            </Row>
            <Stack direction="horizontal" gap={1} className="d-flex flex-wrap justify-content-center mt-2">
                { users.map(user => <UserCard key={user.id} user={user} deleteUser={deleteUserHandler} /> )}
            </Stack>
        </div>

    )
}