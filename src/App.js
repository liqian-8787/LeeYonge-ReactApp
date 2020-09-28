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
class App extends React.Component {
  render() { 
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path="/" render={() => (
            <Home />
          )} />
          <Route exact path="/products" render={() => (
            <Products />
          )} />
          <Route path="/signup" render={() => (
            <SignUp />
          )} />

          <Route path="/logout" render={() => (
            <Logout />
          )} />
          <Route path="/login" render={() => (
            <LogIn />
          )} />
          <Route path="/viewprofile" render={() => (

            <ViewProfile />

          )} />

          <Route path="/shoppingcart" render={() => (

            <ShoppingCart />

          )} />

          <Route path="/product/pid=:id" component={ProductDetails} />

          <Route path="/Dashboard" render={() => (
            <Grid>
              <Row>
                <Dashboard />
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

