import './Header.scss';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getLoggedUser, logout } from '../../utils/http-utils/user-requests';
import brand from '../../images/brand.png';
import { NavDropdown } from 'react-bootstrap';

export function Header() {

    const loggedUser = getLoggedUser();

    const location = useLocation();

    const navigate = useNavigate();

    const logoutHandler = () => {
        logout().then(() => {
            navigate('/login');
        });
    }

    const goToProfile = () => {
        navigate(`/user/${loggedUser.id}`)
    }

    return (
        <div className="header shadow">
              <Navbar bg="light" variant="light" expand="lg">
                <Container>
                    <Navbar.Brand href="/vehicles">
                        <img
                            alt=""
                            src={brand}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            />{' '}
                        Car Rental
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto" activeKey={location.pathname}>
                            { loggedUser?.role === 'admin' && <Nav.Link className='nav-link' href="/users">Users</Nav.Link>}
                            <Nav.Link className='nav-link' href="/vehicles">Vehicles</Nav.Link>
                            { loggedUser?.role === 'admin' && <Nav.Link href="/vehicle/create">Create Vehicle</Nav.Link>}
                        </Nav>
                        <Nav className='ms-auto' activeKey={location.pathname}>
                            { !loggedUser && <Nav.Link className='text-primary' href="/login">Login</Nav.Link> }
                            { !loggedUser && <Nav.Link href="/register">Sign up</Nav.Link> }

                        { loggedUser && <NavDropdown title="Account" id="navbarScrollingDropdown" align='end'>
                            <NavDropdown.Item>Hello <b>{loggedUser.name}</b></NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item  onClick={goToProfile}>See profile</NavDropdown.Item>
                            <NavDropdown.Item className='text-danger' onClick={logoutHandler}>Logout</NavDropdown.Item>
                        </NavDropdown>}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}