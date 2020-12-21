import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Container, Row } from 'reactstrap';
import cookie from 'react-cookies';
import Loader from '../global-connector/Loader';
import 'reactjs-popup/dist/index.css';

class OrderHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            loading: true,
            isLoggedIn: false

        }
        this.getOrders = this.getOrders.bind(this);
        this.updateOrdersState = this.updateOrdersState.bind(this);
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
            orders: orderHistory.orders,
            loading: false
        })
    }
    componentDidMount() {
        this.updateOrdersState();
    }
    render() {
        if (this.state.loading) {
            return (<Loader />)
        } else {
            if (this.state.isLoggedIn) {
                if (typeof this.state.orders !== 'undefined' && this.state.orders.length > 0) {
                    this.state.orders.reverse();
                    return (
                        <div className="container order-history-container">
                            <h3>Purchase history</h3>
                            <div>{this.state.orders.map((order) => {
                                const newDate = new Date(order.date)
                                let expireDate=new Date();
                               
                            console.log(expireDate)
                                return (
                                    <div key={order.id}>
                                        <p>Order subtotal Total: $<span>{order.cart_total.toFixed(2)}</span></p>
                                        <p>Order Total: $<span>{(order.cart_total * 1.13).toFixed(2)}</span></p>
                                        <p>Order date: <span>{newDate.toLocaleString()}</span></p>
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
                else {
                    return (
                        <Container>
                            <h3>Purchase history</h3>
                            <div className="alert-info welcome-banner">Your order history is empty, please go check <Link to="/products">all proudcts</Link> or your <Link to="/shoppingcart">shopping cart</Link>
                            </div>
                        </Container>
                    )
                }
            }
            else {
                return (
                    <Container>
                        <div className="alert-info welcome-banner">Sorry, you have not been logged in. Please <Link to="/login" className="welcome-link"><span>sign up </span></Link>
                      or <Link to="/login" className="welcome-link"><span>log in</span></Link></div>
                    </Container>
                )
            }
        }
    }

}
export default withRouter(OrderHistory);