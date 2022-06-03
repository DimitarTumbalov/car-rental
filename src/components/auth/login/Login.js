import { useState } from "react"
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import { login } from "../../../utils/http-utils/user-requests";
import { Col, Row } from "react-bootstrap";
import './Login.scss'

export function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');

    const onInputChange = (event) => {
        setUser((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value
        }))
    }

    const onFormSubmit = (event) => {
        event.preventDefault();
        
        login(user).then(() => {
            navigate('/vehicles');
        }).catch(error => setError(error.message))
    }

    return (
        <Row className="login-wrapper-container justify-content-center align-content-center">
            <Col md="auto">
                <Form onSubmit={onFormSubmit} className="bg-light p-4 shadow">
                        <h3 className="mb-3">Sign in</h3>

                        { error && <span className="text-danger">{error}</span> }
                        <Form.Group className="mt-2 text-start"  controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" name="email" value={user.email} onChange={onInputChange}  required/>
                        </Form.Group>

                        <Form.Group className="mt-2 text-start" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" name="password" value={user.passsword} onChange={onInputChange}  required/>
                        </Form.Group>

                        <Button className="mt-4" variant="primary" type="submit">
                            Sign in
                        </Button>
                </Form>
            </Col>
        </Row>
    )
}