import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Container, Row, Col, CardImg } from 'reactstrap';
import Text from 'react-text';
import { Button } from 'react-bootstrap';
import Loader from '../global-connector/Loader';
class ProductListContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible:15,
            loading: true,
            products:[]           
        }
        this.imageResourceUrl = this.props.imageResourceUrl;
        this.getProductsFromProps = this.getProductsFromProps.bind(this);
    } 
    getProductsFromProps(products){        
        this.setState({products:products})
    }
    componentDidMount(){
        this.getProductsFromProps(this.props.products);
    }
    componentWillReceiveProps(props){
        this.getProductsFromProps(props.products);
    }
    render() {
        return (
            <Row className="d-flex flex-wrap">
                {this.state.products.slice(0, this.state.visible).map((product) => {
                    const bestFlag = product.isBestSeller;
                    const promotionPrice = product.promotional_price;
                    return (
                        <Col xs="12" md="6" lg="4" className="product-item" key={product.id}>
                            {
                                bestFlag ? <div className="best-flag">Best Seller</div>
                                    : <div className="nobest"></div>
                            }
                            <div className="image-tile">
                                <Link to={`/product/pid=${product.id}`} >
                                    <CardImg className="product-image" src={`${this.imageResourceUrl}` + product.image_url} />
                                </Link>
                            </div>
                            <p className="title">{product.name}</p>
                            <div className="description">
                                <Text>{product.description.substr(0, 120)}</Text>
                            </div>
                            {promotionPrice ?
                                <div>
                                    <p>Price: <span className="origin-price">${product.price}</span></p>
                                    <p>New Price: <span>${product.promotional_price}</span></p>
                                </div>
                                : <p>Price: <span>${product.price}</span></p>
                            }

                        </Col>
                    )
                })
                }
            </Row>
        )

    }
}

export default withRouter(ProductListContainer);