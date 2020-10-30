import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
class ProductListContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: 0,
            loading: true,
            products: []
        }
        this.imageResourceUrl = this.props.imageResourceUrl;
        this.getProductsFromProps = this.getProductsFromProps.bind(this);
    }
    getProductsFromProps(products,visible) {
        this.setState({ products: products, visible:visible })
    }
    componentDidMount() {
        this.getProductsFromProps(this.props.products,this.props.visible);
    }
    UNSAFE_componentWillReceiveProps(props) {
        this.getProductsFromProps(props.products,props.visible);
    }
    render() {
        return (
            <Row className="d-flex flex-wrap">
                {this.state.products.slice(0, this.state.visible).map((product) => {
                    const bestFlag = product.isBestSeller;
                    const promotionPrice = product.promotional_price;
                    return (
                        <Col  className="product-item" key={product.id}>
                            <div className="mobile-product-image">
                                {
                                    bestFlag ? <div className="best-flag hidden-xs" >Best Seller</div>
                                        : <div className="nobest hidden-xs"></div>
                                }                             
                                <Link to={`/product/pid=${product.id}`}  className="list-image-tile">
                                    <img className="img img-responsive list-image" src={`${this.imageResourceUrl}` + product.image_url} />
                                </Link>
                              
                            </div>
                            <div className="mobile-product-text">
                            {
                                    bestFlag ? <div className="best-flag visible-xs-inline-block">Best Seller</div>
                                        : <div></div>
                                }
                                <p className="title">{product.name}</p>
                                
                                <div className="description">
                                <p>Description:</p>                                    
                                    <p>{product.description.substr(0, 120)}</p>
                                </div>
                                {promotionPrice ?
                                    <div className="list-price">
                                        <p>Price: <span className="origin-price">${product.price}</span></p>
                                        <p>New Price: <span>${product.promotional_price}</span></p>
                                    </div>
                                    : <p>Price: <span>${product.price}</span></p>
                                }
                            </div>
                        </Col>
                    )
                })
                }
            </Row>
        )
    }
}

export default withRouter(ProductListContainer);