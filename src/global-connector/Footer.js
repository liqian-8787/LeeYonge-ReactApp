import React from 'react';
import { withRouter, Link, NavLink as RRNavLink, } from 'react-router-dom';

class Footer extends React.Component {
    
   
    render() {
        return (
        <footer className="footer">
            <div className="container">
                <p className="legal">@LeeYonge INC. 2020. All rights reserved.</p></div>
        </footer>
        )
        
    }
}
export default withRouter(Footer);