import React from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';
import { Container, Row, Col, CardImg } from 'reactstrap';

class OrderList extends React.Component {

    constructor(props) {
        super(props);  
        this.imageResourceUrl = process.env.REACT_APP_IMAGE_URL;
        this.apiServerUrl = process.env.REACT_APP_API_SEVER_URL;   
    }

    render() {        
        return (
            <Container>
                <h2>Your order list:</h2>
                <div className="cart-subtotal">Subtotal: <span className="text-success">${this.props.orders.cart_total}</span></div>
                {this.props.orders.products.map((product) => {
                    return (
                        <div>
                            <div className="cart-products-wrap">
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
                                            <p>quantity: {product.quantity}</p>
                                        </div>
                                    </Row>
                                </div>
                            </div></div>
                    )
                })
                }
            </Container>
        )

    }
}
export default withRouter(OrderList);