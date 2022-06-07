import React from 'react';
import { Nav,Navbar , Container } from 'react-bootstrap';
const navbar = ()=>{
    return(
        <>
        <Navbar bg="dark" variant="dark">
            <Container>
            <Navbar.Brand href="/">EV_PROJECT</Navbar.Brand>
            <Nav className="me-auto">
            <Nav.Link href="/user/login">Login As User</Nav.Link>
            <Nav.Link href="/admin/login">Login As Admin</Nav.Link>
            <Nav.Link href="/register">Register</Nav.Link>
            <Nav.Link href="/map">Map</Nav.Link>
            </Nav>
            </Container>
        </Navbar>
        </>
    );
};

export default navbar;