import { useEffect, useState } from "react";
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

    const deleteUserHandler = async (id) => {
       await deleteUser(id);
       setUsers(prevState => {
           return prevState.filter(user => user.id !==id)
       });
    }

    return (
        <div className="users-list-wrapper">
            { users.map(user => <UserCard key={user.id} user={user} deleteUser={deleteUserHandler} /> )}
        </div>
    )
}