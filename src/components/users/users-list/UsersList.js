import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import { deleteUser, getAllUsers } from "../../../utils/http-utils/user-requests";
import { UserCard } from "../user-card/UserCard";
import './UsersList.scss'

export function UsersList(){

    const [users, setUsers] = useState([]);

    useEffect(() => {
        getAllUsers().then(response => {
            setUsers(response.data);
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
        <Stack direction="horizontal" gap={1} className="d-flex flex-wrap justify-content-center">
            { users.map(user => <UserCard key={user.id} user={user} deleteUser={deleteUserHandler} /> )}
        </Stack>
    )
}