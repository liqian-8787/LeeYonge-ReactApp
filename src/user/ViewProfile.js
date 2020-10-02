import React from 'react';
import { Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import Loader from '../global-connector/Loader';

class ViewProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            isLoggedIn: false,
            loading: true
        }
        this.getUserInfo = this.getUserInfo.bind(this);
        this.apiServerUrl = this.props.urlConfigs.apiServerUrl;
    }

    getUserInfo() {
        return new Promise((resolve, reject) => {
            let token = cookie.load("token");
            fetch(`${this.apiServerUrl}/api/users/profile`, {
                method: "GET",
                mode: "cors",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    credentials: 'include',
                    cookies: JSON.stringify({ token: token }),
                }
            })
                .then(response => {
                    if (!response.ok) {
                        this.setState(
                            {
                                isLoggedIn: false,
                                loading: false
                            }
                        )
                    } else {
                        this.setState({
                            isLoggedIn: true,
                            loading: false
                        })
                    }
                    return response.json()
                })
                .then(data => {
                    resolve(data);
                })
                .catch(err => reject(err))
        })
    }
    componentDidMount() {
        this.getUserInfo().then((data) => {
            console.log(data);
            this.setState(() => {
                return {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email
                }
            });
        })
    }

    render() {
        if (this.state.loading) {
            return (<Loader />)
        }
        else {
            if (this.state.isLoggedIn) {
                return (
                    <Container>
                        <div className="alert-success welcome-banner">
                            <h2>Welcome {this.state.firstName} {this.state.lastName}</h2>
                            <h3>your email address is: {this.state.email}</h3>
                        </div>
                    </Container>
                )
            }
            else {
                return (
                    <Container>
                        <div className="alert-info welcome-banner">Sorry, you have not been logged in. Please <Link to="/login" className="welcome-link"><span>sign up </span></Link>
                      or <Link to="/login" className="welcome-link"><span>log in</span></Link></div>
                    </Container>
                )
            }      
         }
    }
}
export default ViewProfile;