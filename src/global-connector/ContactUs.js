import React from 'react';
import Slider from "react-slick";
import img1 from '../assets/img/img1.jpg';
import img2 from '../assets/img/img2.jpg';
import img3 from '../assets/img/img3.jpg';
import img4 from '../assets/img/img4.jpg';
import img5 from '../assets/img/img5.jpg';
import scan from '../assets/img/scan.jpg';
const items = [
    {
      src:img1,
      altText: "Slide 1",
      caption: "",
      header: "",
      key: "1",
    },
    {
      src:img2,
      altText: "Slide 2",
      caption: "",
      header: "",
      key: "2",
    },
    {
      src:img3,
      altText: "Slide 3",
      caption: "",
      header: "",
      key: "3",
    },
    {
        src:img4,
        altText: "Slide 4",
        caption: "",
        header: "",
        key: "4",
      },
      {
        src:img5,
        altText: "Slide 5",
        caption: "",
        header: "",
        key: "5",
      }
  ];
class ContactUs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.apiServerUrl = this.props.urlConfigs.apiServerUrl;
    }
    next() {
        this.slider.slickNext();
    }
    previous() {
        this.slider.slickPrev();
    }

    render() {

        if (items.length > 0) {
            const settings = {
                dots: false,
                infinite: true,
                arrows: true,
                speed: 500,
                slidesToShow: items.length >= 3 ? 3 : 2,
                slidesToScroll: items.length >= 3 ? 3 : 1,
                responsive: [
                    {
                        breakpoint: 999,
                        settings: {
                            arrows: false,
                            infinite: true,
                            centerMode: false,
                            slidesToShow: items.length >= 3 ? 3 : 2,
                            slidesToScroll: items.length >= 3 ? 3 : 1,
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
                <div className="container contact-us">
                    <div>
                        <h2 className="hidden-xs">Shanghai Leeyonge Tailor Shop</h2>
                        <h3 className="visible-xs">Shanghai Leeyonge Tailor Shop</h3>
                        <p>Our shop specializes in customised clothing, such as suit, cheongsams, formal dress, windbreaker, shirt, trousers...
                    The designer has 30 years of relevant experience in China.</p>
                        <p>
                            Our purpose is to satisfy our customers' requirement, and let customers to be satisfied.
                            Our shop supplies customers with lots of cloth material and different styles.
                    We try our best to provide some suggestion which would help customers to get their lovely and unique cloth. </p>
                    <Slider ref={c => (this.slider = c)} {...settings}>
                        {items.map((item) => {
                            return (
                                <div key={item.ley}>  
                                        <div className="contactus-images-wraper">                                           
                                                <img className="img img-responsive contactus-image" src= {item.src}/>  
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
                    <div className="contact-info">
                        <div>
                        <p className="text-bold">Want your own style? Please contact us anytime you like!</p>
                        <p>
                            Address:
                        </p>
                        <p>4300 Steeles Avenue East, Unit C28, Markham Ontario, Canada. L3R 0Y5</p>
                        <p>Phone Number: </p>
                        <p>6475686831</p>
                        </div>
                    <div  className="contactus-scan">
                        <img className="img img-responsive" src={scan}/>
                    </div>
                    </div>
                    </div>

                </div>
            )
          
        }
    }
}
    export default ContactUs;