import React from 'react';
import { withRouter, Link, NavLink as RRNavLink, } from 'react-router-dom';
import {  NavLink } from 'reactstrap';
import { Icon } from '@iconify/react';
import logo from '../assets/leeyonge-top.png';
import { Navbar, Nav, NavItem } from "react-bootstrap";
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
            <Navbar inverse collapseOnSelect staticTop className="nav">
                <Navbar.Header>

                    <Navbar.Brand>
                        <Link to="/">
                            <img className="nav-logo" src={logo} />
                        </Link>
                    </Navbar.Brand>

                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>                   
                    <Nav navbar>
                        <NavItem>
                            <NavLink activeClassName='active' tag={RRNavLink} exact to='/'>
                                Home
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink activeClassName='active' tag={RRNavLink} to='/products'>
                                Products
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink activeClassName='active' tag={RRNavLink}  to='/signup'>
                                Sign Up
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink activeClassName='active' tag={RRNavLink} to='/viewprofile'>
                                View Profile
                            </NavLink>
                        </NavItem>
                        <NavItem>
                        {
                            this.isloggedin()  ?
                            <NavLink activeClassName='active' tag={RRNavLink}  to='/logout'>
                                Log Out
                            </NavLink>
                            :    
                            <NavLink activeClassName='active' tag={RRNavLink}  to='/login'>
                                Log In
                            </NavLink>
                        }
                        </NavItem>
                        <NavItem>
                            <NavLink activeClassName='active' tag={RRNavLink} to='/shoppingcart'>
                                 <Icon icon={shoppingCartOutlined} className="shopping-cart-icon" />
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>)
    }
}
export default withRouter(Header);