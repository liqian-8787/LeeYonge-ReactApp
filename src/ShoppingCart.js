import React from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';
import { Container, Row, Col, CardImg } from 'reactstrap';
import ShowMoreText from 'react-show-more-text';
import cookie from 'react-cookies';
import Loader from './Loader';
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
            errorResponses: { code: '', errors: '' },
            successInfo: '',
            message: {
                type: '',
                text: ''
            },
            loading: true
        }
        this.getCart = this.getCart.bind(this);
        this.apiServerUrl =this.props.urlConfigs.apiServerUrl;      
        this.imageResourceUrl = this.props.urlConfigs.imageResourceUrl;  
        this.updateQuantity = this.updateQuantity.bind(this);
        this.updateCartState = this.updateCartState.bind(this);
        this.updateValue = this.updateValue.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.checkOut = this.checkOut.bind(this);
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

    updateValue = (e) => {
        this.setState(prevState => ({
            products: prevState.products.map(product => {
                product.purchased_quantity = e.getCart.value;
            })
        }
        ))
    }
    getCart() {
        let token = cookie.load("token");
        this.setState(() => ({ loading: true }))
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
                .then(res => res.json())
                .then(data => {
                    resolve(data);
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
                cart:cart,
                cart_total: cart.cart_total,
                products: cart.productInfo,
                loading:false            
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
                }
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
                            errorResponses: {
                                code: response.status
                            },
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
                        loading: false
                    })
                    this.updateCartState();
                }
                return response.json()
            })
            .then(res => {
                this.setState({
                    errorResponses: {
                        code: this.state.errorResponses.code,
                        errors: res.errors[0].errorMessage
                    },
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
                            loading: false
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
                                <button className="check-out" onClick={this.checkOut}>check out</button>
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
                                                        {product.description}
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
                                                    <button onClick={() => this.updateQuantity({ pid: product.id, quantity: product.purchased_quantity }, 'decrement')}>
                                                        &mdash;
                                                </button>
                                                    <input className="updated-quantity" id="quantity" value={product.purchased_quantity} onChange={this.updateValue} />
                                                    <button onClick={() => this.updateQuantity({ pid: product.id, quantity: product.purchased_quantity }, 'increment')}>
                                                        &#xff0b;
                                                </button>
                                                    <div className="delete-update">
                                                        <button onClick={() => { this.handleDelete(product.id) }}>delete</button>
                                                        <button type="submit" onClick={() => { this.handleUpdate({ pid: product.id, quantity: product.purchased_quantity }) }}>update</button>
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
                return (<OrderList orders = {this.state.orderList}> </OrderList>)
            }
            else {
                return (
                    <Container>
                        <h3>
                            Your Cart is empty, please go check <Link to="/products">all proudcts</Link>
                        </h3>
                    </Container>
                )
            }
        }

    }
}
export default withRouter(ShoppingCart);