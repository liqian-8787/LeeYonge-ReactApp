import React from 'react';
import { withRouter } from 'react-router-dom';
import {  Label} from 'reactstrap';
import ShowMoreText from 'react-show-more-text';
import cookie from 'react-cookies';
import AddErrMessage from '../errors/AddErrMessage';
import Loader from '../global-connector/Loader';
class ProductDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            product: {},
            cart: {},
            isAdded: false,
            errorResponses: { code: '', errors: '' },
            successInfo: '',
            isloggedin: true,
            loading: true
        }
        this.currentPid = this.props.match.params.id;
        this.getData = this.getData.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
       
        this.isloggedin = this.isloggedin.bind(this)
        this.apiServerUrl = this.props.urlConfigs.apiServerUrl;
        this.imageResourceUrl = this.props.urlConfigs.imageResourceUrl;
    }

    getData() {
        return new Promise((resolve, reject) => {
            fetch(`${this.apiServerUrl}/api/product/pid=${this.currentPid}`)
                .then(res => res.json())
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                })
        })
    }

    // setCartState(pid, quantity) {
    //     this.setState(() => (
    //         {
    //             cart: {
    //                 products: [
    //                     {
    //                         pid: pid,
    //                         quantity: quantity
    //                     }
    //                 ]
    //             }
    //         }
    //     ));
    // }
    isloggedin() {
        return localStorage.getItem("userData") ? true : false;
    }
    componentDidMount() {

        this.getData().then((data) => {
            this.setState(() => {
                return {
                    product: data,
                    isloggedin: this.isloggedin(),
                    loading:false
                }
            });
        })
    }

    handleSubmit(event, pid) {
        event.preventDefault();
        const data = new FormData(event.target);
        this.setState(() => {
            let quantity = data.get("quantity");
            return ({
                cart: {
                    products: [
                        {
                            pid: pid,
                            quantity: quantity
                        }
                    ]
                },
                loading:true
            })
        }, () => {
            console.log(this.state.cart)
            let token = cookie.load("token");
            fetch(`${this.apiServerUrl}/api/shoppingcart/add`, {
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
                        isAdded: true,
                        loading: false
                    })
                }
                return response.json()
            })
                .then(res => {
                    this.setState({
                        errorResponses: {
                            code: this.state.errorResponses.code,
                            errors: res.errors[0].errorMessage
                        }
                    })
                })
                .catch(err => console.log(err))
        }
        );
    }

    executeOnClick(isExpanded) {
        console.log(isExpanded);
    }

    render() {
        if (this.state.loading) {
            return (<Loader />)
        } else {
            const promotionPrice = this.state.product.promotional_price;
            return (
                <div>
                    {
                        this.state.errorResponses.code || this.state.isAdded ?
                            <AddErrMessage errorCode={this.state.errorResponses.code} isAdded={this.state.isAdded} > </AddErrMessage>
                            : <div></div>
                    }

                    <div className="product-details-container container">
                        <div className="product-detail">
                            <div className="float-lg-left">
                                {this.state.product.image_url ?
                                    <img className="image-tile" src={this.imageResourceUrl + this.state.product.image_url} /> : <span></span>
                                }
                            </div>
                            <form className="float-lg-right" onSubmit={(e) => { this.handleSubmit(e, this.state.product.id) }}>
                                <h3>{this.state.product.name} </h3>
                                {promotionPrice ?
                                    <div>
                                        <p >Was: <span className="dollar-price origin-price">${this.state.product.price}</span></p>
                                        <p>New Price: <span className="dollar-price">${this.state.product.promotional_price}</span></p>
                                    </div>
                                    : <p>Price: <span className="dollar-price">${this.state.product.price}</span></p>
                                }

                                <div className="a-dropdown-container">
                                    <Label for="quantity" className="a-native-dropdown">Quantity:&nbsp;</Label>
                                    <select name="quantity" autoComplete="off" id="quantity" tabIndex="0" className="a-native-dropdown">
                                        <option defaultValue="1" select="true">1</option>
                                        <option value="2" >2</option>
                                        <option value="3" >3</option>
                                        <option value="4" >4</option>
                                        <option value="5" >5</option>
                                        <option value="6" >6</option>
                                        <option value="7" >7</option>
                                        <option value="8" >8</option>
                                    </select>
                                </div>
                                <br />

                                <span><button type="submit" className="btn btn-primary" onClick={this.loginErr}>Add To Cart</button></span>

                                <div className="product-detail-description">
                                    <hr></hr>
                                    <h4><strong>product description</strong></h4>
                                    <ShowMoreText
                                        lines={3}
                                        more='Show more'
                                        less='Show less'
                                        anchorClass=''
                                        onClick={this.executeOnClick}
                                        expanded={false}
                                        width={400}
                                    > {this.state.product.description}
                                    </ShowMoreText>
                                </div> <br />
                                <div className="link-to" >
                                    <a className="continue-shopping-cart" href="/products">Continue shopping!</a>
                                </div>
                                <div className="link-to">
                                    <a className="continue-shopping-cart" href="/shoppingcart">Go to shoppingcart!</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default withRouter(ProductDetails);