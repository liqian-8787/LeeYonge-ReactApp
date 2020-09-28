import React from 'react';
import { withRouter } from 'react-router-dom';
import { Container } from 'reactstrap';
import Promotion from './Promotion';
import BestSeller from './BestSeller';
import WelcomeBanner from './WelcomeBanner'
import Loader from './Loader';
import cookie from 'react-cookies';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            userValidator:null,
            promotions:null,
            bestSellers:null,
            urlConfigs:null
        }
        this.apiServerUrl = this.props.urlConfigs.apiServerUrl;
        this.getUserInfo = this.validateUser.bind(this);
        this.getPromotion = this.getPromotion.bind(this);
        this.getBestSeller = this.getBestSeller.bind(this);
    }

    validateUser() {
        let token = cookie.load("token"); 
        return new Promise((resolve, reject) => {
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

    getPromotion() {
        return new Promise((resolve, reject) => {
            fetch(`${this.apiServerUrl}/api/promotions`)
                .then(res => res.json())
                .then(data => {
                    resolve(data);

                }).catch(err => {
                    reject(err);
                })
        })
    }

    getBestSeller() {
        return new Promise((resolve, reject) => {
            fetch(`${this.apiServerUrl}/api/bestSeller`)
                .then(res => res.json())
                .then(data => {
                    resolve(data);

                }).catch(err => {
                    reject(err);
                })
        })
    }

    async componentDidMount(){
        try{           
            const [userValidator,promotions,bestSellers] = await Promise.all([
                this.validateUser(),
                this.getPromotion(),
                this.getBestSeller()
            ]);
            this.setState(()=>({loading:false,userValidator,promotions,bestSellers,urlConfigs:this.props.urlConfigs}))
        }catch(err){
            this.setState(()=>({loading:true}))
        }
    }
    render() {
        if (this.state.loading) {
            return (<Loader />)
        } else{
            return (
                <div>
                     <WelcomeBanner userInfo = {this.state.userValidator}/>
                    <Container>                       
                        <Promotion promotions = {this.state.promotions} urlConfigs={this.state.urlConfigs}/>
                        <BestSeller bestSellers = {this.state.bestSellers} urlConfigs={this.state.urlConfigs}/>
                    </Container>
                </div>
            )
        }
     
    }
}

export default withRouter(Home);