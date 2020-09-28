import React from 'react';
import { Container} from 'reactstrap';
import { Link} from 'react-router-dom';
import cookie from 'react-cookies';

class ViewProfile extends React.Component {
    constructor() {
        super();
        this.state = {
         firstName:'',
         lastName:'',
         email:'',
         isLogedIn:false           
        }
        this.getUserInfo = this.getUserInfo.bind(this);
        this.apiServerUrl = process.env.REACT_APP_API_SEVER_URL;        
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
    componentDidMount() {
        this.getUserInfo().then((data) => {
            this.setState(() => {
                return {
                    firstName:data.firstName,
                    lastName:data.lastName,
                    email:data.email,
                    isLogedIn:true
                }
            });
        })
    }
    render(){
        if(this.state.isLogedIn){
            return(
                <Container>
                <div className="alert-success welcome-banner">
                    
                    <h2>Welcome {this.state.firstName} {this.state.lastName}</h2>
                    <h3>your email address is: {this.state.email}</h3>
                </div>
                </Container>
                )
        }
        else{
            return(
                <Container>
                <div className="alert-success welcome-banner">Sorry, you have not been loged in. Please <Link to="/login" className="alert-link"><span>sign up </span></Link>
                  or <Link to="/login" className="alert-link"><span>log in</span></Link></div>
                  </Container>
            )
        }
        
    }

}
    export default ViewProfile;