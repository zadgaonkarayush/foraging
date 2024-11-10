// src/components/Footer.js
import React from 'react';
import './footer.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useParams } from 'react-router-dom';

const Footer = () => {
    const {id} = useParams();
    return (
        <footer className="footer">
           <Link to={`/dashboard/${id}`}><button className='nav-btn home-btn'><i className='fas fa-home'></i></button></Link>
            <Link to={'/add_plant'}> <button className="nav-btn add-btn" type='button'><i className="fas fa-plus"></i></button></Link>
            <Link to ={`/wishlist/${id}`}><button className="nav-btn heart-btn" ><i className="fas fa-heart"></i></button></Link>
        </footer>
    );
};

export default Footer;
