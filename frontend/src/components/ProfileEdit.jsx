import React, { useState,useEffect } from 'react'
import Logo from '../assets/image.png';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './Profile.css';
import axios from 'axios';
const ProfileEdit = () => {
    
  const navigate = useNavigate();
  const {id} = useParams();
  console.log('Profile ID:', id);
  const [userData, setUserData] = useState({
     image:'',
      firstname: '',
      lastname: '',
      email: '',
      mobile: ''
  });

  useEffect(() => {
      axios.get(`http://localhost:3000/auth/viewprofile/${id}`)
          .then(result => {
             if(result.data.Status){
              console.log(result.data.Result)
              setUserData(result.data.Result)
             }
          })
          .catch(error => {
              console.error('There was an error fetching the user data!', error);
          });
  }, [id]);
 
  const handleSubmit =(e) =>{
     e.preventDefault();
     axios.put(`http://localhost:3000/auth/editprofile/${id}`,userData)
     .then(result =>{
      if(result.data.Status){
        console.log(result.data.Result)
        navigate(`/viewprofile/${id}`)
      }
     })
     .catch((err) => console.log(err))
  }
  
 const handlePassword = () =>{
  navigate(`/changepassword/${id}`);
 }

  return (
    <>
    <div className='profilecontainer'>
     <div className='profile-header'>
     <Link to={`/dashboard/${id}`}><button className='profile-back-button'>&lt;</button></Link>
     <h1>Edit Account</h1>
     <Link to={`/editProfile/${id}`}><button className="edit-button">&#9998;</button>
        </Link>
     </div>
     <div className='profile-pic'>
      <img src={ `http://localhost:3000/uploads/${userData.image}` || Logo} alt='profile-pic' />
     </div>
     <div className='profile-details'>
     <input type="text"  value={userData.firstname} 
     onChange={(e) => setUserData({...userData,firstname:e.target.value})}  />

        <input type="text" value={userData.lastname} 
        onChange={(e) => setUserData({...userData,lastname:e.target.value})}  />

        <input type="email" value={userData.email}
        onChange={(e) => setUserData({...userData,email:e.target.value})}   />

        <input type="text" value={userData.mobile}
        onChange={(e) => setUserData({...userData,mobile:e.target.mobile})}  />
     </div>
     <div className="change-password">
        <button type='button' onClick={handlePassword}>Change Password &#9654;</button>
      </div>
      <div className="profile-update">
        <button className="update-button" onClick={handleSubmit}>Update-Profile</button>
      </div>
    </div>
    </>
  )
}

export default ProfileEdit
