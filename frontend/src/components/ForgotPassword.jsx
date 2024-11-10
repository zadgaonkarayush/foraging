// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import './ForgotPassword.css'
// import axios from 'axios'
// const ForgotPassword = () => {
//   const [email,setEmail] = useState('');
//  const navigate = useNavigate();

//   const handleSubmit = () =>{
//     axios.post('http://localhost:3000/auth/forgotPassword',{email})
//     .then(result =>{
//       if(result.data.Status){
//         console.log(result.data.Result)
//         navigate(`/enterotp/${email}`);
//       }
//     })
//     .catch((err) => console.log(err));
//   }

//   return (
//     <div className='ForgotP-container'>
//     <div>
//        <h1>Forgot Password</h1>
//     </div>

//     <div className='ForgotP-form-container'>
//      <div className='header-container'>
//     <p> <Link to={'/'} className='Forgot-Register-form'>Log in to continue</Link></p>
//       <form onSubmit={handleSubmit}>
//        <div className='Finput-group'>
//          <label htmlFor='email'></label>
//          <input name='email' type='email' autoComplete='off' placeholder='Registered E-Mail ID'
//          value={email} onChange={(e) => setEmail(e.target.value)} />
//        </div>
       
//       </form>
      

//       <button type="submit" className='submit-button' onClick={handleSubmit}>Submit</button>
       
      
//      </div>

//     </div>
//   </div>
//   )
// }

// export default ForgotPassword
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3000/auth/forgotPassword', { email })
      .then(result => {
        if (result.data.Status) {
          setSuccess('OTP sent successfully!');
          setTimeout(() => navigate(`/enterotp/${email}`), 2000); // Redirect after 2 seconds
        } else {
          setError(result.data.Error || 'Failed to send OTP');
        }
      })
      .catch(err => setError('Error connecting to server'));
  };

  return (
    <div className='ForgotP-container'>
      <div>
        <h1>Forgot Password</h1>
      </div>
      <div className='ForgotP-form-container'>
        <div className='header-container'>
          <p><Link to={'/'} className='Forgot-Register-form'>Log in to continue</Link></p>
          <form onSubmit={handleSubmit}>
            <div className='Finput-group'>
              <label htmlFor='email'></label>
              <input 
                name='email' 
                type='email' 
                autoComplete='off' 
                placeholder='Registered E-Mail ID'
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <button type="submit" className='submit-button'>Submit</button>
            {error && <p className='error-message'>{error}</p>}
            {success && <p className='success-message'>{success}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
