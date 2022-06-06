import './Register.scss'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { login, registerUser } from '../../../utils/http-utils/user-requests';
import { Col, Row } from 'react-bootstrap';
import { VALID_BULGARIAN_PHONE_NUMBER_REGEX } from '../../../utils/Constants';

export function Register(){

    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: '',
        picture: '',
        email: '',
        phone: '',
        password: '',
        role: 'user'
    });
    const [error, setError] = useState('');

    const onInputChange = (e) => {
        setUser((prevState) => {
            return {
                ...prevState,
                [e.target.name]: e.target.value
            }
        });

        setError('');
    }

    const onFormSubmit = (event) => {
        event.preventDefault();

        registerUser(user).then(() => {
            login(user).then(() => {
                navigate('/vehicles');
            }).catch(navigate('/login'))
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
                        <Form.Label>Name*</Form.Label>
                        <Form.Control minLength={2} maxLength={30} type="text" placeholder="Enter full name" name="name" value={user.name} onChange={onInputChange} required/>
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicEmail">
                        <Form.Label>Email*</Form.Label>
                        <Form.Control maxLength={50} type="email" placeholder="Enter email" name="email" value={user.email} onChange={onInputChange}  required/>
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicPicture">
                        <Form.Label>Picture URL</Form.Label>
                        <Form.Control maxLength={300} type="text" placeholder="Enter picture URL" name="picture" value={user.picture} onChange={onInputChange} />
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicPhone" >
                        <Form.Label>Phone number*</Form.Label>
                        <Form.Control pattern={VALID_BULGARIAN_PHONE_NUMBER_REGEX} type="tel"
                        title='Must be a valid bulgarian number'
                        placeholder="Enter phone number" name="phone" value={user.phone} onChange={onInputChange} required/>
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicPassword">
                        <Form.Label>Password*</Form.Label>
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