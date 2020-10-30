import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Container } from 'reactstrap';
import { Button } from 'react-bootstrap';
import Loader from '../global-connector/Loader';
import ProductListContainer from './ProductListContainer'

class Products extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            visible: 15,
            error: false,
            loading: true,
            categories: [],
            slug:this.props.match.params.slug,
        }
        this.getData = this.getData.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.getProductsBySlug = this.getProductsBySlug.bind(this);
        this.imageResourceUrl = this.props.urlConfigs.imageResourceUrl;
        this.apiServerUrl = this.props.urlConfigs.apiServerUrl;
    }

    loadMore() {
        this.setState((prev) => {
            return { visible: prev.visible + 9 };
        });
    }
    getData(slug) {
        return new Promise((resolve, reject) => {
            fetch(`${this.apiServerUrl}/api/allProducts/${slug}`)
                .then(res => res.json())
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                })
        })
    }

    getProductsBySlug(slug){             
        slug = typeof slug ==='undefined'?"All":slug;       
        this.getData(slug).then((data) => {          
            this.setState((state, props) =>  ({
                    products: data.products,
                    categories: data.allDistinctCategories,
                    loading: false,
                })
            );            
        })
    }

    componentDidMount() {
        this.getProductsBySlug(this.state.slug);       
    }
    componentWillReceiveProps(props){    
        this.getProductsBySlug(props.match.params.slug);
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
                                    <ul className="desktop-category">
                                        {this.state.categories.map((category) => {
                                            return (
                                                <li key={category.slug}><Link to={`/products/${category.slug}`}>{category.text}</Link></li>
                                            )
                                        })}
                                    </ul>
                                </div>
                                <ProductListContainer products={this.state.products}  visible={this.state.visible} imageResourceUrl={this.imageResourceUrl} />                               
                            </div>
                            {
                                (() => {
                                    if (this.state.visible < this.state.products.length) {
                                        return (
                                            <div className="load-more">
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