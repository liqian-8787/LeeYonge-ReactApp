import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Container, Row } from 'reactstrap';
import { FormGroup, InputGroup, FormControl } from 'react-bootstrap';
import cookie from 'react-cookies';
import Loader from '../global-connector/Loader';
import OrderList from './ShoppingCart_CheckOutList';
import Popup from "reactjs-popup";
import { format } from "date-fns";
import 'reactjs-popup/dist/index.css';

class OrderHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            loading: true,
            isLoggedIn: false,
            offset: { left: 150, top: 50 }

        }
        this.getOrders = this.getOrders.bind(this);
        this.updateOrdersState=this.updateOrdersState.bind(this);
        this.imageResourceUrl = this.props.urlConfigs.imageResourceUrl;
        this.apiServerUrl = this.props.urlConfigs.apiServerUrl;
        this.maxDescriptionLength = 150;

    }
    getOrders() {
        let token = cookie.load("token");
        return new Promise((resolve, reject) => {
            fetch(`${this.apiServerUrl}/api/orderhistory`, {
                method: "GET",
                mode: "cors",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    credentials: 'include',
                    cookies: JSON.stringify({ token: token }),
                }
            }).then(res => {
                if (res.ok) {
                    this.setState({
                        isLoggedIn: true
                    })
                }
                return res.json()
            }).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            })
        })
    }
    async updateOrdersState() {
        const [orderHistory] = await Promise.all([this.getOrders()])
        this.setState({
            orders: orderHistory.orders
        },function(){
            console.log(orderHistory.orders)
        })
    }
    componentDidMount() {
        this.updateOrdersState();

    }
    render() {
        return (
            <div className="container order-history-container">
                <h3>order List</h3>            
                <div>{this.state.orders.map((order) => {   
                              
                    return (
                        <div key={order.id}>
                              <p>Order subtotal Total: $<span>{order.cart_total.toFixed(2)}</span></p> 
                              <p>Order Total: $<span>{(order.cart_total * 1.13).toFixed(2) }</span></p> 
                              <p>Order date:<span>{order.date}</span></p>                            
                            {
                                order.products.map((product) => {
                                    return (
                                        <div key={product.id} className="order-history-products">
                                        <Row>
                                            <div className="col-xs-12 col-md-4">
                                                <h4>{product.name}</h4>
                                                <img className="cart-image" src={`${this.imageResourceUrl}` + product.image_url} />
                                            </div>
                                            <div className="col-xs-12 col-md-4">
                                                <p>Description:</p>
                                                <Link to={`/product/pid=${product.id}`}>
                                                    {product.description.length > this.maxDescriptionLength ? `${product.description.slice(0, this.maxDescriptionLength)}...` : product.description}
                                                </Link>
                                            </div>
                                            <div className="col-xs-12 col-md-4 shopping-cart-price">
                                                {
                                                    (() => {
                                                        if (!product.promotion_price) {
                                                            return (
                                                                <p>Sale price: <span className='text-success'>${product.price}</span></p>
                                                            )
                                                        } else {
                                                            return (
                                                                <div>
                                                                    <p>Original price: <span className='origin-price'>${product.price}</span></p>
                                                                    <p>Promotion price: <span className='text-success'>${product.promotion_price}</span></p>
                                                                </div>
                                                            )
                                                        }
                                                    })()
                                                }
                                                <p>quantity: <span>{product.quantity}</span></p>
                                                
                                            </div>
                                        </Row>
                                    </div>
                                    )
                                })
                            }
                        </div>
                    )
                })}
                </div>
            </div>
        )
    }

}
export default withRouter(OrderHistory);