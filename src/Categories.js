import React from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

class Categories extends React.Component {
    constructor(props){
        super(props);
        this.state={
            categories:[]
           
        }
     
        this.getCategory=this.getCategory.bind(this);
        this.imageResourceUrl = process.env.REACT_APP_IMAGE_URL;
        this.apiServerUrl = process.env.REACT_APP_API_SEVER_URL;
    }

    getCategory(){
        return new Promise((resolve,reject)=>{
            fetch(`${this.apiServerUrl}/api/category`)
            .then(res=>res.json())
            .then(data=>{                
                resolve(data);
             
            }).catch(err=>{
                reject(err);
            })
        })
    }
  
    componentDidMount() {
         
        this.getCategory().then((data)=>{ 

            this.setState((state,props)=>{                
                return {
                    categories:data                   
                }              
            });
        })      

    }
    render(){

        if (this.state.categories.length>0){
            return(
                <div>
                    <h2>Product Category</h2>
                    <Container>
                        <Row>

                    {this.state.categories.map((category)=>{                        
                            return(
                                    <div className="category-container">
                                        <div className="category-item"> 
                                        <Col xs="12" md="6" lg="4">                          
                                            <p>{category.category}</p>
                                            </Col> 
                                        </div>                
                                    </div>
                            )                                            
                        })
                    }
                    </Row>
                    </Container>
                </div>
               )  
        }else{
            return(<div>Empty category</div>)
        }
    }
}

export default withRouter(Categories);