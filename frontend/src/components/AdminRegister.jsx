import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SuccessModal from './SuccessModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
const AdminRegister = () => {
    const navigate = useNavigate();

    const[showModal,setShowModal] = useState(false);

    const [user,setUser]  =useState({
        name:'',
        email:'',
        mobile:'',
        password:''
    });
    const handleSubmit =(e) =>{
        e.preventDefault();

        axios.post('http://localhost:3000/admin/adminregister',user)
        .then(result =>{
            if(result.data.Status){
                console.log(result.data.Result);
                 navigate('/adminlogin');
            }else{
                alert(result.data.Error)
            }
        })
        .catch((err) => console.log(err))
    };
    const handleCloseModal =() =>{
        setShowModal(false);
        navigate('/adminlogin');
        }
  return (
    <>
    <div className='Register-container'>
       <div className='logo-container'>
          <h1>Sign Up</h1>
       </div>

       <div className='Register-form-container'>
        <div className='header-container'>
         <p>Already a member? <Link to={'/adminlogin'} className='Register-form'>Sign In</Link> </p>

         <form onSubmit={handleSubmit}>
         <div className='input-group'>
            <label htmlFor='name'></label>
            <input id='name' type='text' placeholder='Name*'
            onChange={(e) => setUser({...user,name:e.target.value})} />
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
          <button type="submit" className='signup-button'>Sign Up</button>

         </form>

          
         <SuccessModal show={showModal} handleClose={handleCloseModal}  />
         
        </div>

       </div>
     </div>
    </>
  )
}

export default AdminRegister
