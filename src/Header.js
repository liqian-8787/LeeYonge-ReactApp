import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Container, Row, Col, CardImg } from 'reactstrap';
import Text from 'react-text';
import { Button } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import { Icon } from '@iconify/react';
import logo from './amazon logo.png';
import { Navbar, Nav, NavItem, Grid } from "react-bootstrap";
import { Switch, Route, useParams } from "react-router-dom";
import shoppingCartOutlined from '@iconify/icons-ant-design/shopping-cart-outlined';
class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            islogin: false
        }
        this.isloggedin = this.isloggedin.bind(this);
    }
    isloggedin() {
        return localStorage.getItem("userData") ? true : false;
    }
    render() {
        return (<div>
            <Navbar inverse collapseOnSelect staticTop>
                <Navbar.Header>
                    {/* <LinkContainer to="/home"> */}
                    <Navbar.Brand>
                        <a href="/">
                            <img className="nav-logo" src={logo} style={{ width: 100 }} />
                        </a>
                    </Navbar.Brand>
                    {/* </LinkContainer> */}
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <LinkContainer to="/">
                            <NavItem>Home</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/products">
                            <NavItem>Products</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/signup">
                            <NavItem>Sign Up</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/viewprofile">
                            <NavItem>View Profile</NavItem>
                        </LinkContainer>
                        {this.isloggedin() ? <LinkContainer to="/logout">
                            <NavItem>Log Out</NavItem>
                        </LinkContainer> : <LinkContainer to="/login">
                                <NavItem>Log In</NavItem>
                            </LinkContainer>}
                        <LinkContainer to="/shoppingcart">
                            <NavItem><Icon icon={shoppingCartOutlined} className="shopping-cart-icon" /></NavItem>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>)
    }
}
export default withRouter(Header);