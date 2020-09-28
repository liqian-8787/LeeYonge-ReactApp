import React from 'react';
import { withRouter,Link } from 'react-router-dom';
import { CardImg } from 'reactstrap';

class Test extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bestSellers: [],
            visible: 4,
            error: false
        }        
        this.loadMore = this.loadMore.bind(this);
        this.imageResourceUrl = process.env.REACT_APP_IMAGE_URL;
        this.apiServerUrl = process.env.REACT_APP_API_SEVER_URL;
    }
    loadMore() {
        this.setState((prev) => {
            return { visible: prev.visible + 8};
        });
    }
    componentDidMount() {        
        this.setState(() => {
            return {
                bestSellers: this.props.bestSellers
            }
        });
    }
    render() {

        if (this.state.bestSellers.length > 0) {
            return (
                <section className="feed">
                    <h2>Best Sellers</h2>
                    <div className="tiles" aria-live="polite">
                        {this.state.bestSellers.slice(0, this.state.visible).map((item, index) => {
                            const promotionPrice = item.promotional_price;
                            return (
                                <div className="tile fade-in" key={item.name}>
                                    
                                    <p>{item.name}</p>
                                    <div>
                                        <Link to={`/product/pid=${item.id}`} >                                                    
                                            <CardImg  className="product-image" src={`${this.imageResourceUrl}` + item.image_url}  />
                                        </Link>
                                    </div>
                                    {promotionPrice ?
                                        <div>
                                            <p>Price: <span className="origin-price">${item.price}</span></p>
                                            <p>New Price: <span>${item.promotional_price}</span></p>
                                        </div>
                                        : <p>Price: <span>${item.price}</span></p>
                                    }
                                </div>
                            );
                        })}
                    </div>
                    <div className="load-more">
                    {this.state.visible < this.state.bestSellers.length &&
                        <button onClick={this.loadMore}  className="btn btn-primary" >Load more</button>
                    }
                    </div>
                </section>
            )
        } else {
            return (<div>Empty best seller products</div>)
        }
    }
}
export default withRouter(Test);