import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './ResetPassword.css'
import axios from 'axios';
const ResetPassword = () => {
 
  const {email} = useParams();
  const [newPassword,setNewPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit =(e) =>{
     e.preventDefault();

     if(newPassword !== confirmPassword){
      alert('Password do not match!');
      return;
     }
     axios.post('http://localhost:3000/auth/resetpassword',{email,newPassword})
     .then(result =>{
      if(result.data.Status){
        console.log(result.data.Result);
            navigate('/');
      }else{
        alert(result.data.Error)
      }
     })
     .catch((err) => console.log(err));
  }

  return (
    <>
    <div className='Reset-container'>
    <div>
       <h1>Reset Password</h1>
    </div>

    <div className='Reset-password-form'>
     <div className='header-container'>
    <p>Your new password must different <br/>from previous used Password</p>
      <form onSubmit={handleSubmit}>
       <div className='Rinput-group'>
       <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
       </div>
       <div className='Rinput-group'>
       <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
       </div>

       <button type="submit" className='submit-button'>Submit</button>

      </form>
             
      
     </div>

    </div>
    </div>

    </>
  )
}

export default ResetPassword
