import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import cookie from 'react-cookies';
class LogOut extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            errorResponses: { code: '', errors: '' },
            successInfo: ''
        }
        // this.isLogout = this.isLogout.bind(this);
        this.apiServerUrl =this.props.urlConfigs.apiServerUrl;     
        this.handleLogOut = this.handleLogOut.bind(this);
    }

    handleLogOut(token,userData) {
        if(userData)
            localStorage.removeItem("userData");  //clear userData anyway
        //clear server session
        fetch(`${this.apiServerUrl}/api/users/logout`, {
            method: "POST",
            mode: "cors",
            headers: new Headers({
                'Accept': '*/*',
                'Content-Type': 'application/json',
                credentials: 'include',
                cookies: JSON.stringify({ token: token }),
            })
        }).then(response => {
            if (!response.ok) {
                this.setState(
                    {
                        errorResponses: {
                            code: response.status
                        }
                    }
                )
            }
            return response.json();
        }).then(res => {
            console.log(res)
            if (res.status == 200) {
                this.setState({ successInfo: "ok" })
                cookie.remove('token', { path: '/' });
            } else {
                this.setState({
                    errorResponses: {
                        code: this.state.errorResponses.code,
                        errors: res.errors[0].errorMessage
                    }
                })
            }

        })
        .catch(err => console.log(err))

    }
    componentDidMount() {
        const token = cookie.load("token");
        const userData = localStorage.getItem("userData");
        this.handleLogOut(token,userData);
    }

    render() {
        return (
            <div>
                {
                    this.state.successInfo ?
                        <Redirect from='/' to="/login"></Redirect> : <div>{this.state.errorResponses.errors}</div>
                }
            </div>
        )

    }

}

export default withRouter(LogOut);