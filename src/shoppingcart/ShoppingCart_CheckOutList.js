import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Container, Row } from 'reactstrap';

class OrderList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            urlConfigs: '',
        }
        this.imageResourceUrl = this.props.urlConfigs.imageResourceUrl;
        this.apiServerUrl = this.props.urlConfigs.apiServerUrl;
        this.maxDescriptionLength = 150;
    }

    render() {

        return (
            <Container>
                 <div className="alert-info check-out">
                    <p>Please come to pick up within 7 days.</p>
                </div>
                <h2>Your order list: </h2>
                <div className="total-price">
                    <div className="cart-total"><span>Subtotal: </span><span className="text-success">${this.props.orders.cart_total.toFixed(2)}</span></div>
                    <div className="cart-total"><span>HST: </span><span className="text-success">${parseFloat(this.props.orders.cart_total * 0.13).toFixed(2)}</span></div>
                    <div className="cart-total"><span>Order Total: </span><span className="text-success">${parseFloat(this.props.orders.cart_total * 1.13).toFixed(2)}</span></div>
                </div>
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
                                                {product.description.length > this.maxDescriptionLength ? `${product.description.slice(0, this.maxDescriptionLength)}...` : product.description}
                                            </Link>
                                        </div>
                                        <div className="col-xs-12 col-md-4">
                                            {
                                                (() => {
                                                    if (!product.promotional_price) {
                                                        return (
                                                            <p>Sale price: <span className='text-success'>${product.price}</span></p>
                                                        )
                                                    } else {
                                                        return (
                                                            <div>
                                                                <p>Original price: <span className='origin-price'>${product.price}</span></p>
                                                                <p>Promotion price: <span className='text-success'>${product.promotional_price}</span></p>
                                                            </div>
                                                        )
                                                    }
                                                })()
                                            }
                                            <p>quantity: {product.quantity}</p>
                                        </div>
                                    </Row>
                                </div>

                            </div>
                        </div>
                    )
                })
                }
               
            </Container>
        )
    }
}
export default withRouter(OrderList);