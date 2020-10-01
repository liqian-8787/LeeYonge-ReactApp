import React from 'react';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { withRouter, Link, Redirect } from 'react-router-dom';
import cookie from 'react-cookies';

class LogIn extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            redirect: false,
            errorResponses: { code: '', errors: '' },
            successInfo: ''
        }

        this.Email = this.Email.bind(this);
        this.Password = this.Password.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.apiServerUrl =this.props.urlConfigs.apiServerUrl;         
    }

    getUserInfo() {
        return new Promise((resolve, reject) => {
            let token = cookie.load("token"); 
            fetch(`${this.apiServerUrl}/api/users/profile`, {
                method: "GET",
                mode: "cors",
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    credentials: 'include',
                    cookies:JSON.stringify({token:token}),
                }
            })
            .then(res => res.json())
            .then(data => {     
                resolve(data);   
        })   .catch(err => {
            reject(err);
        })    
    })}
    
    onLogin = async (event) => {  
        event.preventDefault();
        
        await fetch(`${this.apiServerUrl}/api/users/login`, {
            method: "POST",
            mode: "cors",
            headers: new Headers({
                'Accept': '*/*',
                'Content-Type': 'application/json'               
            }),
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
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
        })
        .then(res => {
            if(res.status===200){
                cookie.save("token",res.token,{path:'/'});
                localStorage.setItem("userData","login");
                this.setState({
                    successInfo: 'ok'
                })
            }
            this.setState({
                errorResponses: {
                    code: this.state.errorResponses.code,
                    errors: res.errors[0].errorMessage
                }
            }) 
         
        })
        .catch(err => console.log(err))
    }


    clearErr = () => {
        this.setState({
            errorResponses: { code: '', errors: '', errLabel: '' }
        });
    };
    Email(event) {
        this.setState({
            email: event.target.value,
        })
    }
    Password(event) {
        this.setState({
            password: event.target.value,
        })
    }
    
    render() {
        return (
            <div className="page-wrap bg-lightgray">
                <div className="container">
                    <div className="panel">
                        <h2>Log in to your account</h2><br />
                        <Form onSubmit={this.onLogin}>
                            {this.state.errorResponses.errors ?
                                <Alert color="danger">
                                    {this.state.errorResponses.errors}</Alert>
                                : <div></div>
                            }
                            <FormGroup>

                                <Label for="exampleEmail">Email</Label>
                                <Input type="email" name="email" id="exampleEmail" placeholder="email a placeholder"
                                    onChange={this.Email} />

                            </FormGroup>
                            <FormGroup>
                                <Label for="examplePassword">Password</Label>
                                <Input type="password" name="password" id="examplePassword" placeholder="password placeholder"
                                    onChange={this.Password} onKeyDown={this.handleEnter}/>
                            </FormGroup>
                            <Button  color="primary" type='submit'>Log in</Button>
                        </Form>
                        {
                            this.state.successInfo?
                            <Redirect to="/"></Redirect>:<Redirect  to="/login"></Redirect>
                        }
                        <br />
                        <br />
                        <div className="link-to-signup">

                            <p>Do not have an account? <Link to="/signup" className="alert-link"> Sign Up </Link></p>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(LogIn);