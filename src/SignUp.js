import React from 'react';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { withRouter, Link } from 'react-router-dom';
require('dotenv').config({ path: "../config/key.env" });

class Test extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
            },
            errorResponses: { code: '', errors: '', errLabel: '' },
            successInfo: ''
        };

        this.FirstName = this.FirstName.bind(this);
        this.LastName = this.LastName.bind(this);
        this.Email = this.Email.bind(this);
        this.Password = this.Password.bind(this);
        this.register = this.register.bind(this);
        this.clearInput = this.clearInput.bind(this);
        this.clearErrMessage=this.clearErrMessage.bind(this);
        this.clearSuccMessage=this.clearSuccMessage.bind(this);
        this.apiServerUrl = this.props.urlConfigs.apiServerUrl;
    }

    clearInput() {
        this.setState({
            user: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
            }
        })
    }
    clearErrMessage(){
        this.setState({         
            errorResponses: { code: '', errors: '', errLabel: '' }            
        })
    }
    clearSuccMessage(){
        this.setState({   
            successInfo: ''
        })
    }
    FirstName(event) {
        this.setState({
            user: {
                ...this.state.user,
                firstName: event.target.value,
            }
        })
    }
    LastName(event) {
        this.setState({
            user: {
                ...this.state.user,
                lastName: event.target.value,
            }
        })
    }
    Email(event) {
        this.setState({
            user: {
                ...this.state.user,
                email: event.target.value,
            }
        })
    }
    Password(event) {
        this.setState({
            user: {
                ...this.state.user,
                password: event.target.value,
            }
        })
    }

    register = async (event) => {
        event.preventDefault();
        const signUpFormData = {
            firstName: this.state.user.firstName,
            lastName: this.state.user.lastName,
            email: this.state.user.email,
            password: this.state.user.password,
        };
        await fetch(`${this.apiServerUrl}/api/users/register`, {
            method: "POST",
            mode: "cors",
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(signUpFormData)
        })
            .then(response => {
                if (!response.ok) {
                    this.setState(
                        {
                            errorResponses: {
                                code: response.status
                            }
                        }
                    )
                    this.clearSuccMessage()
                } else {
                    this.setState({
                        successInfo: response.statusText,

                    })
                    this.clearInput();
                    this.clearErrMessage()
                }
                return response.json()
            })
            .then(res => {
                this.setState({
                    errorResponses: {
                        code: this.state.errorResponses.code,
                        errors: res.errors[0].error,
                    },
                })
            })
            .catch(err => console.log(err))
    };

    render() {

        return (
            <div className="page-wrap">
                <div className="container">
                    <div className="panel">
                        <h2>Create your account</h2><br />
                        {
                            this.state.successInfo ?
                                <div><Alert variant="success">
                                    <p>You have successfully created an account!</p>
                                    <p>Now you can <Link to="/login" className="alert-link"> Log In </Link> with your account.</p>
                                </Alert>
                                </div>
                                : <div></div>
                        }
                        <Form onSubmit={this.register}>
                            {this.state.errorResponses.code ?
                                <Alert color="danger">
                                    {this.state.errorResponses.errors}</Alert>
                                : <div></div>
                            }
                            <FormGroup>
                                <Label for="exampleName">First Name <span className="star">*</span></Label>
                                <Input type="text" name="user.firstName" value={this.state.user.firstName} onChange={this.FirstName} placeholder="please enter your first name" required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleName">Last Name <span className="star">*</span></Label>
                                <Input type="text" name="user.lastName" value={this.state.user.lastName} onChange={this.LastName} placeholder="please enter your last name" required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleEmail">Email <span className="star">*</span></Label>
                                <Input type="email" name="user.email" value={this.state.user.email} onChange={this.Email} placeholder="please enter a valid email address" required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="examplePassword">Password <span className="star">*</span></Label>
                                <Input type="password" name="user.password" value={this.state.user.password} onChange={this.Password} placeholder="password must be minimum 8 charactors"
                                    required />
                            </FormGroup>
                            <Button className="btn btn-primary" type="submit" >Create</Button>
                        </Form>
                        <br /><br />
                        <div className="link-to-signup">
                            <p>Already have an account? <Link to="/login" className="alert-link"> Log In </Link></p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Test);