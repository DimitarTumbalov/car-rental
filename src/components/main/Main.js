
import './Main.scss';
import {Outlet} from 'react-router-dom'
import { Container } from 'react-bootstrap';
export function Main() {
    return (
        <div className="main-content py-4">
            <Container id='container' fluid="sm">
                <Outlet/>
            </Container>
        </div>
    )
}