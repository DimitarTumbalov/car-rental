import { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { deleteUser, getAllUsers, getLoggedUser, logout } from "../../../utils/http-utils/user-requests";
import { UserCard } from "../user-card/UserCard";
import './UsersList.scss'

export function UsersList(){
    const [users, setUsers] = useState([]);
    const loggedUser = getLoggedUser();
    const [deleteModal, setDeleteModal] = useState({show: false, id: null});
    const navigate = useNavigate();

    useEffect(() => {
        getAllUsers().then(response => {
            setUsers(response.data.sort((a, b) => {
                return (b.id == loggedUser.id) - (a.id == loggedUser.id);
            }));
        });
 
    }, [])

    const showDeleteModalHandler = (id, e) => {
        e.stopPropagation();
        
        setDeleteModal({
            show: true,
            id: id
        });
    }

    const closeDeleteModalHandler = (confirmed) => {
        if(confirmed)
            deleteUserHandler(deleteModal.id);
        else
            setDeleteModal({show: false,  id: null });
    }

    const deleteUserHandler = async () => {
        await deleteUser(deleteModal.id);

        if(loggedUser.id == deleteModal.id){
            logout().then(() => {
                navigate('/login');
            });
        }else{
            setUsers(prevState => {
                return prevState.filter(user => user.id !== deleteModal.id)
            });
    
           setDeleteModal({show: false,  id: null });
        }
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
                { users.map(user => <UserCard key={user.id} user={user} deleteUser={showDeleteModalHandler} /> )}
            </Stack>

            <Modal show={deleteModal.show} onHide={() => closeDeleteModalHandler(false)} centered>
                <Modal.Header closeButton>
                <Modal.Title>Delete user</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => closeDeleteModalHandler(false)}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={() => closeDeleteModalHandler(true)}>
                    Delete
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}