import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Container } from 'reactstrap';

class WelcomeBanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: this.props.userInfo.firstName,
            lastName: this.props.userInfo.lastName,
            email: this.props.userInfo.email,
            isLoggedIn: this.props.userInfo.isLoggedIn
        }
    }

    componentDidMount() {
        this.setState(() => {
            return {
                firstName: this.props.userInfo.firstName,
                lastName: this.props.userInfo.lastName,
                email: this.props.userInfo.email,
                isLoggedIn: this.props.userInfo.isLoggedIn
            }
        });
    }

    render() {
        if (this.state.isLoggedIn) {
            return (
                <Container>
                    <div className="alert-success welcome-banner " role="alert">Welcome {this.state.firstName} {this.state.lastName}. <span> <Link to="/products" className="welcome-link">View products</Link></span></div>
                </Container>
            )
        }
        else {
            return (
                <Container>
                    <div className="alert-info welcome-banner ">Welcome. <Link to="/signup" className="welcome-link"><span>sign up?  </span></Link>
                  or <Link to="/login" className="welcome-link"><span> log in?</span></Link></div>
                </Container>
            )
        }

    }
}
export default withRouter(WelcomeBanner);