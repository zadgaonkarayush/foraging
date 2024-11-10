import React, { useState } from 'react'
import './RegistrationForm.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import SuccessModal from './SuccessModal';
const RegistrationForm = () => {
  const navigate = useNavigate();

  
    const[showModal,setShowModal] = useState(false);

  
    const [user, setUser] = useState({
      
        firstname: "",
        lastname: "",
        email: "",
        mobile:"",
        password:"",
    });
    const handleSubmit = (e) => {
        e.preventDefault();
         
      

        axios.post('http://localhost:3000/auth/register', user)
        .then(result => {
            if (result.data.Status) {
                console.log(result.data)
                setShowModal(true); // Show the modal after successful registration
              
            } else {
                alert(result.data.Error);
            }
        })
        .catch(err => console.log(err));
    };
    const handleCloseModal =() =>{
     setShowModal(false);
     navigate('/');
     }
  return (
    <>
    <div className='Register-container'>
       <div className='logo-container'>
          <h1>Sign Up</h1>
       </div>

       <div className='Register-form-container'>
        <div className='header-container'>
         <p>Already a member? <Link to={'/'} className='Register-form'>Sign In</Link> </p>

         <form onSubmit={handleSubmit}>
         <div className='input-group'>
            <label htmlFor='firstname'></label>
            <input id='firstname' type='text' placeholder='First Name*'
            onChange={(e) => setUser({...user,firstname:e.target.value})} />
          </div>
          <div className='input-group'>
            <label htmlFor='lastname'></label>
            <input id='lastname' type='text' placeholder='Last Name*' 
            onChange={(e) => setUser({...user,lastname:e.target.value})} />
          </div>

          <div className='input-group'>
            <label htmlFor='email'></label>
            <input id='email' type='email' autoComplete='off' placeholder='E-Mail ID*'
             onChange={(e) => setUser({...user,email:e.target.value})} />
          </div>
          <div className='input-group'>
            <label htmlFor='mobile'></label>
            <input id='mobile' type='tel'  placeholder='Mobile Number'
            onChange={(e) => setUser({...user,mobile:e.target.value})} />
          </div>
          <div className='input-group'>
            <label htmlFor='password'></label>
            <input id='password' type='password' placeholder='Password*'
            onChange={(e) => setUser({...user,password:e.target.value})} />
          </div>
         </form>
         <Link to={'/forgotPassword'} className='Register-forgot-password'>Forgot Password?</Link>

         <button type="submit" className='signup-button' onClick={handleSubmit}>Sign Up</button>
          
         <SuccessModal show={showModal} handleClose={handleCloseModal}  />
         
        </div>

       </div>
     </div>
    </>
  )
}

export default RegistrationForm
