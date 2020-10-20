import React from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

class TestPage extends React.Component {
    constructor(props) {
        super(props);

        this.cloneTiles = this.cloneTiles.bind(this);
        this.getAllProd = this.getAllProd.bind(this);
        this.getCheapestProd = this.getCheapestProd.bind(this);
        this.sortPrice = this.sortPrice.bind(this);
        this.filterFuncV1 = this.filterFuncV1.bind(this);
        this.filterFuncV2 = this.filterFuncV2.bind(this);
        this.addToModels = this.addToModels.bind(this);
        this.showSingleProd = this.showSingleProd.bind(this);
        this.showItem = this.showItem.bind(this);
        this.clearAll = this.clearAll.bind(this);
        this.sortedItems = this.sortedItems.bind(this);
    }

    cloneTiles() {
        const tiles = $('.tiles').clone();
        return tiles;
    }

    getAllProd() {
        var tiles = [];
        $('.tile').each(function (index) {
            tiles.push({ index: index, price: parseFloat($(this).find('.price').text()), name: $(this).find('.title').text(), tile: $(this) })
        })
        tiles.reverse();
        return tiles;
    }

    getCheapestProd() {
        var cheapestProd = [];
        var tiles = [];

        $('.tile').each(function (index) {
            tiles.push({ index: index, image: $(this).find('img').attr('src'), price: parseFloat($(this).find('.price').text()), name: $(this).find('.title').text(), tile: $(this) })
        })
        tiles.sort(function (a, b) {
            return a.price - b.price;
        })

        cheapestProd.push(tiles[0]);
        return cheapestProd;
    }

    sortPrice() {
        var tiles = [];
        var filteredTiles = [];

        $('.tile').each(function (index) {
            tiles.push({ index: index, price: parseFloat($(this).find('.price').text()), tile: $(this) })
        })
        tiles.sort(function (a, b) {
            return b.price - a.price;
        })

        filteredTiles.push(tiles[0]);
        filteredTiles.push(tiles[1]);
        filteredTiles.push(tiles[2]);
        return filteredTiles;
    }

    showSingleProd() {

        $('.tile').find('a').click(function (e) {
            e.preventDefault();
            $('#product-detail').find('.modal-body').empty();
            let item = $(this).closest('.tile').clone();
            let prodImg = item.find('img').attr('src');

            let prodName = item.find('.title').text();
            let prodPrice = parseFloat(item.find('.price').text());

            $('#product-detail').find('.modal-body').append('<div class="single-item"><div class="modal-pImg"><img class="img img-responsive" src="' + prodImg + '"/></div>' + '<div class="modal-text"><p>name: <span>' + prodName + '</span></p><p>price: <span>' + prodPrice + '</span></p></div></div>');
            document.querySelector('.grid-btn').click();
        })
    }

    filterFuncV1() {
        let filteredTiles = this.sortPrice();
        let compareIndex = (index, filteredTiles) => {
            let result = false;
            $.each(filteredTiles, function (key, filteredTile) {
                if (index == filteredTile.index) {
                    result = true;
                }
            })
            return result;
        }

        $('.top-sellers').click(function () {

            $('.tile').each(function (index) {
                let result = compareIndex(index, filteredTiles);
                var self = $(this);
                if (result) {
                    self.css('display', 'flex');
                }
                else {
                    self.css('display', 'none');
                }
            })
        })

        $('.all-sellers').click(function () {
            $('.tile').css('display', 'flex');

        })
    }

    filterFuncV2() {
        
        let filteredTiles = this.sortPrice();
        $('.top-sellers').click(function () {
            $('.tiles').empty();
            $('.sorted-items').addClass('hidden');
            $.each(filteredTiles, function (key, filteredTile) {
                $('.tiles').append(filteredTile.tile)
            })
        })

        let tiles = this.cloneTiles();
        $('.all-sellers').click(function () {
            $('.sorted-items').addClass('hidden');
            $('.tiles').html(tiles[0].innerHTML);
        })
        
    }

    addToModels() {
        let cheapest = this.getCheapestProd();
        let allProd = this.getAllProd();
        let totalPrice = 0;
        let cheapestProd = () => {
            $('#product-detail').find('.modal-body').empty();
            $('#product-detail').find('.modal-body').append('<div class="cheapest-product"><div>');
            $('.cheapest-product').append('<h4>Cheapest product</h4>');
            $('.cheapest-product').append('<div class="cheapest"></div>');
            $('.cheapest-product').find('.cheapest').append('<div class="modal-pImg"><img class="img img-responsive img-thumbnail" src="' + cheapest[0].image + '"/></div><div class="modal-text"> <p>product name: <span>' + cheapest[0].name + '</span></p>' + '<p>product price :<span>' + cheapest[0].price + '</span></p></div>');
        }

        let allProducts = () => {
            totalPrice = 0;
            $('#product-detail').find('.modal-body').append('<div class="products-list"><div>');
            $('.products-list').append('<h4>product list</h4>');
            $('.products-list').append('<ol class="items"></ol>');

            $.each(allProd, function (key, product) {
                totalPrice += parseFloat(product.price);
                $('.products-list').find('.items').append('<li><span class="list-name">name: </span>' + product.name + '<span class="list-price" style="margin-left:20px">price: </span>' + product.price + '</li>')
            })
            $('.products-list').append('<p class="total-price" style="text-align: right; margin-right: 50px;">Total price: $' + totalPrice.toFixed(2) + '</p>');

        }

        $('.products-details').click(function () {
            cheapestProd();
            allProducts();
        })
    }

    showItem() {
        let tempJson = (data) => {

            let temp = '<div class="modal-pImg"><img class="img img-responsive img-thumbnail" src="https://assignment2-liqian.herokuapp.com' + data.image_url + '"/></div>' + '<div class="modal-text"><p>name: <span>' + data.name + '</span></p><p>price: <span>' + data.price + '</span></p><p>description: <span>' + data.description + '</span></p></div>';

            return temp;
        }
        let getSingleItem = (id) => {
            let apiURL = "https://leeyongeapi.herokuapp.com/api/product/pid=" + id;
            $.getJSON(apiURL)
                .done(function (data) {
                    let $element = tempJson(data);
                    $('#product-detail').find('.modal-body').html('<div class="single-item"></div>');
                    $('.modal-body').find('.single-item').append($element);

                    document.querySelector('.grid-btn').click();
                })
        }
        $('.tile').find('a').click(function (e) {
            e.preventDefault();

            let url = $(this).attr('href');
            let subStrs = url.split("=");
            let pid = subStrs[1];
            getSingleItem(pid);
        })
    }

    clearAll() {

        $('.clear-all').click(function () {
            $('.sorted-items').removeClass('hidden');
            $('.tiles').empty();
        })
    }

    sortedItems() {
      
        let tiles = this.getAllProd();
        tiles.sort(function (a, b) {
            return b.price - a.price;
        })
     
        $('.sorted-items').click(function () {
           
            let count = 0;
            let timer = setInterval(() => {
                if(typeof tiles[count]!=='undefined'){
                    tiles[count].tile.css("opacity",'0');
                    $('.tiles').append(tiles[count].tile);
                    tiles[count].tile.animate({
                        'opacity':1.0
                       }, 450);                 
                    count++;
                }
                else 
                    clearInterval(timer);               
            }, 50);          
        })        
    }

    componentDidMount() {
        this.showItem();
        //this.filterFuncV1();  
        this.filterFuncV2();
        this.addToModels();
        //this.showSingleProd();
        
        this.clearAll();
        this.sortedItems();
    }

    render() {
        return (
            <>
                {/* <div className="container">
                    <div className="unlimited-container">
                        <div className="col-xs-12 col-sm-8 col-md-10 title-icon-detail">
                            <div className="col-xs-12 col-md-10 title-text">
                                <div className="title">
                                    <p className="home-phone">Home phone Lite</p>
                                </div>
                                <div className="icon-text">
                                    <div className="icon">
                                        <i className="app-icon-o  app-icon-o-unlimited app-icon-size-large text-primary"></i>
                                    </div>
                                    <div className="unlimited-text">
                                        <p>Unlimited</p>
                                        <p>local calling</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-md-2 view-detail">
                                <a className="view-link text-primary">View Details</a>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-4 col-md-2 month-price">
                            <div className="col-xs-12  unit-price">
                                <sup className="dollor-sign">$</sup>
                                <sup className="price-dollor">41</sup>
                                <sup className="price-cents">.45/mo.</sup>
                                <div className="order-button">
                                    <a type="button" className="btn btn-default order-now">Order now</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className="feed">
                    <h2>Best Sellers</h2>
                    <div className="tiles">
                        <div className="tile fade-in">
                            <div>
                                <a href="/product/pid=5e8fe48c4c6f111908db6e3e">
                                    <img src="https://assignment2-liqian.herokuapp.com/img/upload/5e978a465b185c0017459271_echo dot.jpg" className="product-image card-img" />
                                </a>
                            </div>
                            <p className="title">Echo Dot</p>
                            <p>Price: $<span className="price" >44.99</span></p>
                        </div>
                        <div className="tile fade-in">
                            <div><a href="/product/pid=5e8fecbfd595601d940403e4">
                                <img src="https://assignment2-liqian.herokuapp.com/img/upload/5e978a465b185c0017459271_chocolates.jpg" className="product-image card-img" /></a></div>
                            <p className="title">Hazelnut Chocolate</p>
                            <p>Price: $<span className="price">5.2</span></p>
                        </div>
                        <div className="tile fade-in">
                            <div><a href="/product/pid=5e987dc25d14e738fc02fdc0"><img src="https://assignment2-liqian.herokuapp.com/img/upload/5e978a465b185c0017459271_pampers-easy-up.jpg" className="product-image card-img" /></a></div>
                            <p className="title">Pampers Easy Ups Diapers </p>
                            <p>Price: $<span className="price">29.97</span></p>
                        </div>
                        <div className="tile fade-in">
                            <div><a href="/product/pid=5e987fab5d14e738fc02fdc2"><img src="https://assignment2-liqian.herokuapp.com/img/upload/5e978a465b185c0017459271_Royal Original Bathrrom Tissue.jpg" className="product-image card-img" /></a></div>
                            <p className="title">Royale Original Bathroom Tissue</p>
                            <p>Price: $<span className="price">5.97</span></p>
                        </div>
                        <div className="tile fade-in">
                            <div><a href="/product/pid=5e988ac55d14e738fc02fdc3"><img src="https://assignment2-liqian.herokuapp.com/img/upload/5e978a465b185c0017459271_Toilet Paper 10 Rolls.jpg" className="product-image card-img" /></a></div>
                            <p className="title">Premium White Toilet Paper Towels</p>
                            <p>Price: $<span className="price">38.99</span></p>
                        </div>
                        <div className="tile fade-in">
                            <div><a href="/product/pid=5e988c305d14e738fc02fdc5"><img src="https://assignment2-liqian.herokuapp.com/img/upload/5e978a465b185c0017459271_coat2.jpg" className="product-image card-img" /></a></div>
                            <p className="title">Hoodies Sweatshirt Long Coat Jacket Outwear</p>
                            <p>Price: $<span className="price">25.99</span></p>
                        </div>
                        <div className="tile fade-in">
                            <div><a href="/product/pid=5e989c2b5d14e738fc02fdc6"><img src="https://assignment2-liqian.herokuapp.com/img/upload/5e978a465b185c0017459271_bath&amp;body.jpg" className="product-image card-img" /></a></div>
                            <p className="title">Vanilla Sugar Home Spa Set</p>
                            <div>
                                <p>Price: $<span className="origin-price">39.99</span></p>
                                <p>New Price: $<span className="price">35.99</span></p>
                            </div>
                        </div>
                        <div className="tile fade-in">
                            <div><a href="/product/pid=5e989dd15d14e738fc02fdc9"><img src="https://assignment2-liqian.herokuapp.com/img/upload/5e978a465b185c0017459271_ring holder.jpg" className="product-image card-img" /></a></div>
                            <p className="title">Ring Stand, Holder and Grip for Smartphones</p>
                            <p>Price: $<span className="price">10.95</span></p>
                        </div>
                    </div>
                    <div className="filter-buttons">
                        <button className="btn btn-primary top-sellers">Top 3 sellers</button>
                        <button className="btn btn-primary all-sellers">All best sellers</button>
                        <a type="button" className="btn btn-primary products-details" data-toggle="modal" data-target="#product-detail">Products details</a>
                        <a type="button" className="hidden grid-btn" data-toggle="modal" data-target="#product-detail">Hidden Button</a>
                        <button className="btn btn-primary clear-all">Clear all</button>
                        <button className="btn btn-primary hidden sorted-items">Sorted items</button>
                    </div>

                    <div className="modal fade" id="product-detail" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="exit" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    <h4 className="modal-title" id="modalLabel">Products Details</h4>
                                </div>
                                <div className="modal-body">

                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary exit" data-dismiss="modal">Exit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>

        )
    }
}
export default withRouter(TestPage);