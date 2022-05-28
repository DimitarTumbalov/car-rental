import './Header.scss';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';

export function Header() {
    return (
        <div className="header shadow">
              <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="/users-list">Car Rental</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link className='nav-link' to="/users-list">Users List</Link>
                        <Link className='nav-link' to="/vehicles-list">Vehicles List</Link>
                        <Nav.Link href="/vehicles/create">Create Vehicle</Nav.Link>
                        <Nav.Link className='text-primary' href="/login">Sign in</Nav.Link>
                        <Nav.Link href="/register">Sign up</Nav.Link>
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}