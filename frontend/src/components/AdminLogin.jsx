import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Image from '../assets/image.png';
import axios from 'axios';

const base64UrlDecode = (base64Url) => {
    const base64 = base64Url
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .concat('='.repeat((4 - base64Url.length % 4) % 4));
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
  };
  
  const parseJwt = (token) => {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token');
    }
    return JSON.parse(base64UrlDecode(parts[1]));
  };
const AdminLogin = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
      email: "",
      password: ""
    });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      axios.post("http://localhost:3000/admin/adminlogin", user)
        .then(result => {
          if (result.data.Status) {
            console.log(result.data);
  
            const { Token, id } = result.data;
            const decoded = parseJwt(Token);
            console.log('Decoded:', decoded); // Verify the token structure
  
            // Store the token and user ID in localStorage
            localStorage.setItem('token', Token);
            localStorage.setItem('userId', id);
            navigate(`/admindashboard/${id}`);
          } else {
            alert(result.data.Error);
          }
        })
        .catch(err => {
          console.error('Request failed', err);
          alert('Failed to login. Please check your network connection and try again.');
        });
    };
  
  return (
    <>
      <div className='login-container'>
        <div className='logo-container'>
          <img src={Image} alt='Foraging' className='logo-login' />
          <h1>Admin Login</h1>
        </div>

        <div className='form-container'>
          <div className='header-container'>
            <h2>Welcome to <br /> My Foraging Compass</h2>
            <p>Don't have an account? <Link to={'/adminregister'} className='Register'>Register</Link></p>

            <form onSubmit={handleSubmit}>
              <div className='input-group'>
                <div className='input-container'>
                  <label htmlFor='email' className='input-label'></label>
                  <i className="fas fa-envelope"></i>
                  <span className="required">*</span>
                  <input
                    id='email'
                    type='email'
                    autoComplete='off'
                    placeholder='E-Mail ID*'
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className='input-field'
                  />
                </div>
              </div>
              <div className='input-group'>
                <div className='input-container'>
                  <label htmlFor='password'></label>
                  <i className="fas fa-lock"></i>
                  <span className="required">*</span>
                  <input
                    id='password'
                    type='password'
                    placeholder='Password*'
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className='signin-button'>Sign In</button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminLogin

