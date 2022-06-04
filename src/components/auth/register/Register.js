import './Register.scss'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { registerUser } from '../../../utils/http-utils/user-requests';
import { Col, Row } from 'react-bootstrap';

export function Register(){

    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: '',
        picture: '',
        email: '',
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');

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

        registerUser(user).then(() => {
            navigate('/vehicles');
        })
        .catch(error => setError(error.message));

    }

    return (
        <Row className="login-wrapper-container justify-content-center align-content-center">
            <Col xs='10' sm='8' md='6' lg='4' xxl='3'>
                <Form onSubmit={onFormSubmit} className="bg-light p-4 shadow">
                    <h3 className="mb-3">Sign up</h3>
                    { error && <span className="text-danger">{error}</span> }
                    <Form.Group className="mt-2 text-start" controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control minLength={2} maxLength={30} type="text" placeholder="Enter name" name="name" value={user.name} onChange={onInputChange} required/>
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control maxLength={50} type="email" placeholder="Enter email" name="email" value={user.email} onChange={onInputChange}  required/>
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicPicture">
                        <Form.Label>Picture</Form.Label>
                        <Form.Control maxLength={100} type="text" placeholder="Enter picture url" name="picture" value={user.picture} onChange={onInputChange} />
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicPhone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control minLength={10} maxLength={12} type="tel" placeholder="Enter phone number" name="phone" value={user.phone} onChange={onInputChange}  required/>
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control minLength={4} maxLength={15} type="password" placeholder="Enter password" name="password" value={user.passsword} onChange={onInputChange}  required/>
                    </Form.Group>

                    <Button size="lg" className="mt-4" variant="primary" type="submit">
                        Sign up
                    </Button>
                </Form>
            </Col>
        </Row>
    );
}