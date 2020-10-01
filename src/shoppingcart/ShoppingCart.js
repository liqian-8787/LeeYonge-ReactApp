import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Container, Row } from 'reactstrap';
import cookie from 'react-cookies';
import Loader from '../global-connector/Loader';
import OrderList from './ShoppingCart_CheckOutList';

class ShoppingCart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cart_total: 0,
            products: [],
            cart: {},
            orderList: {},
            deletedProduct: '',
            isUpdated: false,
            successInfo: '',
            message: {
                type: '',
                text: ''
            },
            loading: true,
            isLoggedIn: false
        }
        this.getCart = this.getCart.bind(this);
        this.apiServerUrl = this.props.urlConfigs.apiServerUrl;
        this.imageResourceUrl = this.props.urlConfigs.imageResourceUrl;
        this.updateQuantity = this.updateQuantity.bind(this);
        this.updateCartState = this.updateCartState.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.checkOut = this.checkOut.bind(this);
        this.maxDescriptionLength = 150;
    }

    updateQuantity = (cart, option) => {
        console.log(cart)

        this.setState(prevState => ({
            products: prevState.products.map(product => product.id == cart.pid ? {
                ...product,
                purchased_quantity:
                    option == 'increment' ? ++cart.quantity
                        : cart.quantity <= 1 ? 1 : --cart.quantity
            } : product
            )
        }), function () {

        })
    }

    getCart() {
        let token = cookie.load("token");
        return new Promise((resolve, reject) => {
            fetch(`${this.apiServerUrl}/api/shoppingcart`, {
                method: "GET",
                mode: "cors",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    credentials: 'include',
                    cookies: JSON.stringify({ token: token }),
                }
            })
                .then(res => {                    
                    if (res.ok) {
                        this.setState({
                            isLoggedIn: true
                        })
                    }    
                    return res.json()
                })
                .then(data => {
                    resolve(data);
                    console.log(data)
                }).catch(err => {
                    reject(err);

                })
        })
    }

    handleDelete(pid) {
        let token = cookie.load("token");
        const deletedProducts = [
            {
                pid: pid
            }
        ]
        return new Promise((resolve, reject) => {
            fetch(`${this.apiServerUrl}/api/shoppingcart/delete`, {
                method: "DELETE",
                mode: "cors",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    credentials: 'include',
                    cookies: JSON.stringify({ token: token }),
                },
                body: JSON.stringify(
                    { products: deletedProducts }
                )
            })
                .then(res => res.json())
                .then(data => {
                    this.setState(() => {
                        return {
                            deletedProduct: data.deletedProducts[0].name,
                            message: {
                                type: 'delete',
                                text: `Product ${data.deletedProducts[0].name} is deleted`
                            },
                            loading: false
                        }

                    })
                    resolve(data);
                    this.updateCartState();
                }).catch(err => {
                    console.log(err)
                    reject(err);

                })
        })
    }

    async updateCartState() {
        const [cart] = await Promise.all([this.getCart()])
        this.setState({
            cart: cart,
            cart_total: cart.cart_total,
            products: cart.productInfo,
            loading: false,
        })
    }

    handleUpdate(product) {
        this.setState(() => {
            let pid = product.pid;
            let quantity = product.quantity;
            return ({
                cart: {
                    products: [{
                        pid: pid,
                        quantity: quantity
                    }]
                },
                loading: true
            })
        }, () => {
            let token = cookie.load("token");
            fetch(`${this.apiServerUrl}/api/shoppingcart/update`, {
                method: "POST",
                mode: "cors",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    credentials: 'include',
                    cookies: JSON.stringify({ token: token }),
                },
                body: JSON.stringify(
                    this.state.cart
                )
            }).then(response => {
                if (!response.ok) {
                    this.setState(
                        {
                            loading: false
                        }
                    )
                } else {
                    this.setState({
                        successInfo: response.statusText,
                        isUpdated: true,
                        message: {
                            type: 'update',
                            text: `Shopping cart is updated`
                        },

                    }, () => {
                        this.updateCartState();
                    })
                }
                return response.json()
            })
                .then(res => {
                    this.setState({
                        loading: false
                    })
                })
                .catch(err => console.log(err))
        }
        );
    }

    checkOut() {
        let token = cookie.load("token");
        this.setState(() => ({ loading: true }))
        return new Promise((resolve, reject) => {
            fetch(`${this.apiServerUrl}/api/shoppingcart/checkout`, {
                method: "POST",
                mode: "cors",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    credentials: 'include',
                    cookies: JSON.stringify({ token: token }),
                }
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    this.setState(() => {
                        return {
                            products: [],
                            orderList: data.orders,
                            loading: false,
                        }
                    }, () => resolve(data))
                }).catch(err => {
                    console.log(err)
                    reject(err);
                })
        })
    }
    componentDidMount() {
        this.updateCartState();
    }
    render() {
        if (this.state.loading) {
            return (<Loader />)
        }      
        if (!this.state.isLoggedIn) {
            return (
                <Container>
                <div className="alert-info welcome-banner">Sorry, you have not been logged in. Please <Link to="/login" className="welcome-link"><span>sign up </span></Link>
              or <Link to="/login" className="welcome-link"><span>log in</span></Link></div>
            </Container>
            )
        } else {
            if (typeof this.state.products !== 'undefined' && this.state.products.length > 0) {
                return (
                    <div>
                        {this.state.message.type ?
                            <Container>
                                <div className={`${this.state.message.type == "delete" ? 'alert-danger' : "alert-success"} welcome-banner`}>
                                    {this.state.message.text}
                                </div>
                            </Container> : <div></div>
                        }
                        <Container className="cart-products-container">
                            <h3>Shopping Cart</h3><br />
                            <div className=""></div>
                            <div className="cart-subtotal">Subtotal: <span className="text-success">${this.state.cart_total}</span></div>
                            <div className="check-out-wraper">
                                <button className="btn btn-primary check-out" onClick={this.checkOut}>check out</button>
                            </div>
                            <div className="cart-products-wrap">
                                {this.state.products.map((product) => {
                                    return (
                                        <div key={product.id} className="cart-products">
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
                                                <div className="col-xs-12 col-md-4">
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
                                                    <p>quantity: </p>
                                                    <div className="update-panel">
                                                        <div className="update-input">
                                                            <button className="update-quantity" onClick={() => this.updateQuantity({ pid: product.id, quantity: product.purchased_quantity }, 'decrement')}>
                                                                &mdash;
                                                            </button>
                                                            <input className="updated-quantity" id="quantity" value={product.purchased_quantity} onChange={(e) => { if (e.target.value) this.handleUpdate({ pid: product.id, quantity: e.target.value }) }} />
                                                            <button className="update-quantity" onClick={() => this.updateQuantity({ pid: product.id, quantity: product.purchased_quantity }, 'increment')}>
                                                                &#xff0b;
                                                            </button>
                                                        </div>
                                                        <div className="delete-update">
                                                            <button className="btn btn-primary delete-button" onClick={() => { this.handleDelete(product.id) }}>delete</button>
                                                            <button className="btn btn-primary" type="submit" onClick={() => { this.handleUpdate({ pid: product.id, quantity: product.purchased_quantity }) }}>update</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Row>
                                        </div>
                                    )
                                })}
                            </div>
                        </Container>
                    </div>
                )
            }
            else if (typeof this.state.orderList.products !== 'undefined' && this.state.orderList.products.length > 0) {
                return (<OrderList orders={this.state.orderList} urlConfigs={this.props.urlConfigs}> </OrderList>)
            }
            else {
                return (
                    <Container>
                        <div className="alert-info welcome-banner">Your Cart is empty, please go check <Link to="/products">all proudcts</Link>
                        </div>
                    </Container>
                )
            }
        }

    }
}
export default withRouter(ShoppingCart);