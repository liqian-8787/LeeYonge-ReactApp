import React from 'react';
import { withRouter,Link} from 'react-router-dom';
import { Container } from 'reactstrap';

class AddErrMessage extends React.Component {
constructor(props) {
    super(props);
 this.errorCode=this.props.errorCode;
 this.isAdded=this.props.isAdded;
}

render(){
  
        return (
            <Container>
                {
                    this.errorCode?
                    <div className="alert-danger welcome-banner ">You are not log in yet. Please <Link to="/login" className="welcome-link"><span>log in</span></Link></div>
                    :this.isAdded?
                    <div className="alert-success welcome-banner">
                    A new product is added. Please check your <Link to='/shoppingcart' style={{textDecoration:'underline'}}>Cart</Link>
                    </div>
                    :<div></div>
                }
            </Container>
        )
}}
export default withRouter(AddErrMessage);