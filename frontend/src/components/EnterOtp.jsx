import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EnterOtp = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/auth/verifyotp', { email, otp })
      .then(result => {
        if (result.data.Status) {
          console.log(result.data.Result);
          navigate(`/resetpassword/${email}`);
        }
      })
      .catch((err) => console.log(err))
  }
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  }
  return (
    <>
      <div className='Reset-container'>
        <div>
          <h1>Enter Otp</h1>
        </div>

        <div className='Reset-password-form'>
          <div className='header-container'>
            <p>Your new password must different <br />from previous used Password</p>
            <form onSubmit={handleSubmit}>
              <input
                type='text'
                placeholder='Enter otp'
                value={otp}
                onChange={handleOtpChange}

              />

              <button type="submit" className='submit-button'>Submit</button>

            </form>




          </div>

        </div>
      </div>

    </>
  )
}

export default EnterOtp
