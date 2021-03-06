import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { CardImg } from 'reactstrap';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class Promotion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            promotions: [],
            categories: [],
            bestSellers: []
        }      
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.apiServerUrl =this.props.urlConfigs.apiServerUrl;      
        this.imageResourceUrl = this.props.urlConfigs.imageResourceUrl;  
    }

    componentDidMount() {
        this.setState((state, props) => {
            return {
                promotions: this.props.promotions
            }
        });        
    }

    next() {
        this.slider.slickNext();
    }
    previous() {
        this.slider.slickPrev();
    }

    render() {

       
        if (this.state.promotions.length > 0) {
            const settings = {
                dots: false,
                infinite: true,
                arrows: true,
                speed: 500,
                slidesToShow:  this.state.promotions.length >= 3?3:2,
                slidesToScroll: this.state.promotions.length >= 3?3:1,            
                responsive: [
                    {
                        breakpoint: 999,
                        settings: {
                            arrows: false,
                            infinite: true,
                            centerMode: false,
                            slidesToShow: this.state.promotions.length >= 3?3:2,
                            slidesToScroll: this.state.promotions.length >= 3?3:1,
                            centerPadding: '0'
                        }
                    },
                    {
                        breakpoint: 767,
                        settings: {
                            arrows: false,
                            infinite: true,
                            centerMode: false,
                            slidesToShow: 2,
                            slidesToScroll: 1,
                            centerPadding: '0'
                        }
                    },
                    {
                        breakpoint: 639,
                        settings: {
                            arrows: false,
                            infinite: true,
                            centerMode: false,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            centerPadding: '0'
                        }
                    }
                ]
            };
            return (
                <div>
                    <h2>Promotional products</h2>                   
                    <Slider ref={c => (this.slider = c)} {...settings} className="promotion-container">
                        {this.state.promotions.map((product) => {
                            return (
                                <div key={product.name}>
                                    <div className="promotion-item">
                                        
                                        <div className="promotiom-image-container">
                                            <Link to={`/product/pid=${product.id}`} >
                                                <CardImg className="product-image" src={`${this.imageResourceUrl}` + product.image_url} />
                                            </Link>

                                        </div>
                                        <p className="title">{product.name}</p>
                                        <div className="price">
                                            <p>Original Price: <span className="origin-price">${product.price}</span></p>
                                            <p>New Price: <span>${product.promotional_price}</span></p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        }
                    </Slider>

                    <div style={{ textAlign: "center" }} className="slider-buttom">
                        <button className="btn btn-primary previous" onClick={this.previous}>
                            Previous
                                </button>
                        <button className="btn btn-primary next" onClick={this.next}>
                            Next
                                </button>
                    </div>
                </div>
            )
        } else {
            return (<div>Empty promotional products</div>)
        }
    }
}

export default withRouter(Promotion);