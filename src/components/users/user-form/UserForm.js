import { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { VALID_BULGARIAN_PHONE_NUMBER_REGEX } from '../../../utils/Constants';
import { getLoggedUser, getUserById, saveUser, saveUserToLocalStorage } from '../../../utils/http-utils/user-requests';
import './UserForm.scss'

export function UserForm(){
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const params = useParams();
    const loggedUser = getLoggedUser();

    useEffect(() => {
        if(loggedUser.role != 'admin' && loggedUser.id != params.id)
            return navigate(`/users`);
    }, [])

    useEffect(() => {
        if (params.id) {
            getUserById(params.id).then((response) => {
                setUser(response.data);
            });
        }
    }, [params.id]);

    const onInputChange = (event) => {
        setUser((prevState) => {
            return {
                ...prevState,
                [event.target.name]: event.target.value
            }
        });

        setError('');
    }

    const onFormSubmit = (event) => {
        event.preventDefault();

        saveUser(user).then(() => {
            // if the updated user was the current user, update the localStorage
            if(user.id == loggedUser.id)
                saveUserToLocalStorage(user);

            navigate(`/user/${user.id}`);
        })
        .catch(error => setError(error.message));

    }

    if(!user)
        return null;

    return (
        <Row className="login-wrapper-container justify-content-center align-content-center">
            <Col  xs='10' sm='8' md='6' lg='4' xxl='3'>
                <Form onSubmit={onFormSubmit} className="bg-light p-4 shadow">
                    <h3 className="mb-3">Edit User</h3>
                    { error && <span className="text-danger">{error}</span> }
                    <Form.Group className="mt-2 text-start" controlId="formBasicName">
                        <Form.Label>Name*</Form.Label>
                        <Form.Control minLength={2} maxLength={30} type="text" placeholder="Enter name" name="name" value={user.name} onChange={onInputChange} required/>
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicEmail">
                        <Form.Label>Email*</Form.Label>
                        <Form.Control maxLength={50} type="email" placeholder="Enter email" name="email" value={user.email} onChange={onInputChange}  required/>
                    </Form.Group>

                    { (loggedUser.role === 'admin' && loggedUser.id != user.id) &&
                     <Form.Group className="mt-2 text-start" controlId="formBasicBrand">
                        <Form.Label>Role</Form.Label>
                        <Form.Select name="role" value={user.role} onChange={onInputChange} required>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </Form.Select>
                    </Form.Group>
                    }

                    <Form.Group className="mt-2 text-start" controlId="formBasicPicture">
                        <Form.Label>Picture URL</Form.Label>
                        <Form.Control maxLength={300} type="text" placeholder="Enter picture URL" name="picture" value={user.picture} onChange={onInputChange} />
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicPhone">
                        <Form.Label>Phone number*</Form.Label>
                        <Form.Control pattern={ VALID_BULGARIAN_PHONE_NUMBER_REGEX } type="tel"
                            title='Must be a valid bulgarian number'
                            placeholder="Enter phone number" name="phone" value={user.phone} onChange={onInputChange} required/>
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicPassword">
                        <Form.Label>Password*</Form.Label>
                        <Form.Control minLength={4} maxLength={15} type="password" placeholder="Enter password" name="password" value={user.passsword} onChange={onInputChange}  required/>
                    </Form.Group>

                    <Button size="lg" className="mt-4" variant="primary" type="submit">
                        Save changes
                    </Button>
                </Form>
            </Col>
        </Row>
    );
}