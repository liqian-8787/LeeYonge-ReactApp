import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Container, Row, Col, CardImg } from 'reactstrap';
import Text from 'react-text';
import { Button } from 'react-bootstrap';
import Loader from '../global-connector/Loader';

class Products extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            visible: 15,
            error: false,
            loading: true,
            categories: []

        }
        this.getData = this.getData.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.imageResourceUrl = this.props.urlConfigs.imageResourceUrl;
        this.apiServerUrl = this.props.urlConfigs.apiServerUrl;
        this.getCategories = this.getCategories.bind(this);
    }

    loadMore() {
        this.setState((prev) => {
            return { visible: prev.visible + 9 };
        });
    }
    getData() {
        return new Promise((resolve, reject) => {
            fetch(`${this.apiServerUrl}/api/allProducts`)
                .then(res => res.json())
                .then(data => {
                    resolve(data);

                }).catch(err => {
                    reject(err);
                })
        })
    }
    getCategories() {
        return new Promise((resolve, reject) => {
            fetch(`${this.apiServerUrl}/api/category`)
                .then(res => res.json())
                .then(data => {
                    resolve(data);

                }).catch(err => {
                    reject(err);
                })
        })
    }
    componentDidMount() {

        this.getData().then((data) => {
            this.setState((state, props) => {
                return {
                    products: data.products,
                    loading: false,
                }
            });
        })
        this.getCategories().then((data) => {
            this.setState((state, props) => {
                console.log(data)
                return {
                    categories: data,
                    loading: false,
                }
            });
        })
    }

    render() {
        if (this.state.loading) {
            return (<Loader />)
        } else {
            if (this.state.products.length > 0) {
                return (
                    <div>
                        <Container className="products-container">
                            <h2>Products List</h2><br />
                            <div className="category-products-list">
                            <div className="products-categories">
                            <ul >
                                {this.state.categories.map((category) => {
                                    return (                                       
                                            <ol value=""><a href="">{category.text}</a></ol>   
                                    )
                                })}
                                  </ul>
                            </div>
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
                           
                            </div>
                            {
                                (() => {
                                    if (this.state.visible < this.state.products.length) {
                                        return (
                                            <div className="center-block">
                                                <Button onClick={this.loadMore} className="btn btn-primary load-more">Load more</Button>
                                            </div>
                                        )
                                    }
                                })()
                            }
                        </Container>
                    </div>
                )
            } else {
                return (<div>Empty products</div>)
            }
        }
    }
}
export default withRouter(Products);