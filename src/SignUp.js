import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { withRouter, Link } from 'react-router-dom';
require('dotenv').config({ path: "../config/key.env" });

class Test extends React.Component {

    constructor() {
        super();

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            errorResponses: { code: '', errors: '', errLabel: '' },
            successInfo: ''
        };

        this.FirstName = this.FirstName.bind(this);
        this.LastName = this.LastName.bind(this);
        this.Email = this.Email.bind(this);
        this.Password = this.Password.bind(this);
        this.register = this.register.bind(this);
    }

    clearErr = () => {
        this.setState({
            errorResponses: { code: '', errors: '', errLabel: '' }
        });
    };

    clearSuccess() {
        this.setState({
            successInfo: ''
        });
    }

    FirstName(event) {
        this.setState({
            FirstName: event.target.value,
        })
    }
    LastName(event) {
        this.setState({
            LastName: event.target.value,
        })
    }
    Email(event) {
        this.setState({
            Email: event.target.value,
        })
    }
    Password(event) {
        this.setState({
            Password: event.target.value,
        })
    }


    register(event) {

        fetch('https://leeyongeapi.herokuapp.com/api/users/register', {
            method: "POST",
            mode: "cors",
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                firstName: this.state.FirstName,
                lastName: this.state.LastName,
                email: this.state.Email,
                password: this.state.Password,
            })
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
                } else {
                    this.setState({
                        successInfo: response.statusText
                    })
                }
                return response.json()
            })
            .then(res => {
                this.setState({
                    errorResponses: {
                        code: this.state.errorResponses.code,
                        errors: res.errors[0].errorMessage,
                        errLabel: res.errors[0].errorLabel
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

                        <Form action="/signup" method="POST">
                            {this.state.errorResponses.errLabel ?
                                <Alert color="danger">
                                    {this.state.errorResponses.errors}</Alert>
                                : <div></div>
                            }
                            <FormGroup>
                                <Label for="exampleName">First Name <span className="star">*</span></Label>
                                <Input type="text" name="user.firstName" onChange={this.FirstName} placeholder="please enter your first name" required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleName">Last Name <span className="star">*</span></Label>
                                <Input type="text" name="user.lastName" onChange={this.LastName} placeholder="please enter your last name" required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleEmail">Email <span className="star">*</span></Label>
                                <Input type="email" name="user.email" onChange={this.Email} placeholder="please enter a valid email address" required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="examplePassword">Password <span className="star">*</span></Label>
                                <Input type="password" name="user.password" onChange={this.Password} placeholder="password must be minimum 8 charactors"
                                    required />
                            </FormGroup>
                            <Button variant="primary" type="submit" onClick={() => { this.register(); this.clearErr(); this.clearSuccess() }}>Create</Button>
                        </Form>
                        <br /><br />
                        {
                            this.state.successInfo ?

                                <div><Alert variant="success">

                                    <p>You have successfully created an account! Now you can Log In with your account</p>
                                </Alert>
                                </div>
                                : <div></div>
                        }

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