import React from 'react';
import './App.css';
import { Grid, Row } from "react-bootstrap";
import { Switch, Route} from "react-router-dom";
import NotFound from './errors/NotFound';
import SignUp from './user/SignUp';
import Products from './products/Products';
import Home from './home/Home';
import LogIn from './user/LogIn';
import ViewProfile from './user/ViewProfile';
import Logout from './user/LogOut';
import ProductDetails from './products/productDetails';
import ShoppingCart from './shoppingcart/ShoppingCart';
import Header from './global-connector/Header';
import Footer from './global-connector/Footer'
// https://leeyonge.netlify.app

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
        categories:[]       
    }
    this.urlConfigs={
      imageResourceUrl : "https://assignment2-liqian.herokuapp.com",
      apiServerUrl : "https://leeyongeapi.herokuapp.com"
    //apiServerUrl : "http://localhost:8080"
    }    
}
  render() { 
    return (
      <div>
        <Header />
        <div className="full-body-height">
          <Switch>
          <Route exact path="/" render={() => (
            <Home urlConfigs = {this.urlConfigs}/>
          )} />
          <Route path="/products" render={() => (
            <Products urlConfigs = {this.urlConfigs}/>
          )} />
          <Route path="/signup" render={() => (
            <SignUp urlConfigs = {this.urlConfigs}/>
          )} />

          <Route path="/logout" render={() => (
            <Logout urlConfigs = {this.urlConfigs}/>
          )} />
          <Route path="/login" render={() => (
            <LogIn urlConfigs = {this.urlConfigs}/>
          )} />
          <Route path="/viewprofile" render={() => (

            <ViewProfile urlConfigs = {this.urlConfigs}/>

          )} />

          <Route path="/shoppingcart" render={() => (

            <ShoppingCart urlConfigs = {this.urlConfigs}/>

          )} />

          <Route path="/product/pid=:id" render={() => (

            <ProductDetails urlConfigs = {this.urlConfigs}/>

          )} />         
          <Route render={() => (
            <NotFound />
          )} />
        </Switch>
        </div>
        <Footer/>
      
      </div>
    );
  }
}

export default App;

