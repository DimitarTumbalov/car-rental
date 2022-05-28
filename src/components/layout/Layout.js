import { Container } from "react-bootstrap";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import { Main } from "../main/Main";
import './Layout.scss'

export function Layout() {

    return (
        <div className="layout">
            <Header/>
            <Main/>
            <Footer/>
        </div>
    );
}

// export default Layout;