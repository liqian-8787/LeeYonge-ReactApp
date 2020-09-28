import React from 'react';
import './App.css';
import { Grid, Row } from "react-bootstrap";
import { Switch, Route} from "react-router-dom";
import NotFound from './NotFound';
import SignUp from './SignUp';
import Products from './Products';
import Home from './Home';
import LogIn from './LogIn';
import ViewProfile from './ViewProfile';
import Logout from './LogOut';
import ProductDetails from './productDetails';
import ShoppingCart from './ShoppingCart';
import Dashboard from './Dashboard';
import Header from './Header';
import Test from './test';
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

          <Route path="/Dashboard" render={() => (
            <Grid>
              <Row>
                <Dashboard urlConfigs = {this.urlConfigs}/>
              </Row>
            </Grid>
          )} />         
          <Route render={() => (
            <NotFound />
          )} />
        </Switch>
      </div>
    );
  }
}

export default App;

