import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './ResetPassword.css'
import axios from 'axios';
const ChangePassword = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [previousPassword, setPreviousPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrormessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword != confirmPassword) {
      setErrormessage('New Password and Confirm Password do not match.');
      return;
    }
    axios.put(`http://localhost:3000/auth/changepassword/${id}`,{previousPassword,newPassword})
      .then(result => {
        if (result.data.Status) {
          console.log(result.data.Result);
          navigate('/');
        }
      })
      .catch((err) => console.log(err));
  }



  return (
    <>
      <div className='Reset-container'>
        <div>
          <h1>Change
            Password</h1>
        </div>

        <div className='Reset-password-form'>
          <div className='header-container'>
            <p>Your new password must different <br />from previous used Password</p>
            <form onSubmit={handleSubmit}>
              <div className='Rinput-group'>
                <input
                  type="password"
                  placeholder="Previous Password"
                  value={previousPassword}
                  onChange={(e) => setPreviousPassword(e.target.value)}
                  required
                /></div>
              <div className='Rinput-group'>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className='Rinput-group'>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className='submit-button'>Submit</button>

            </form>

            {errorMessage && <p className='error'>{errorMessage}</p>}
            {successMessage && <p className='success'>{successMessage}</p>}

          </div>

        </div>
      </div>

    </>
  )
}

export default ChangePassword
