import React, { useState,useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Logo from '../assets/image.png';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { id } = useParams();  // Assuming the user ID is passed via the URL
  console.log('Profile ID:', id);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
     image:'',
      firstname: '',
      lastname: '',
      email: '',
      mobile: ''
  });
 const [ showLogoutModal,setShowLogoutModal] = useState(false);
 axios.defaults.withCredentials = true;


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
  
    const handleLogout = () => {
      axios.post(`http://localhost:3000/auth/logout`)
      .then(result => {
          if (result.data.Status) {
              navigate('/');
          }
      })
      .catch((err) => console.log(err));
  }
  
  
  return (
    <>
    
    <div className='profilecontainer'>
     <div className='profile-header'>
     <Link to={`/dashboard/${id}`}><button className='profile-back-button'>&lt;</button></Link>
     <h1>My Account</h1>
        <Link to={`/editProfile/${id}`}><button className="edit-button">&#9998;</button>
        </Link>
     </div>
     <div className='profile-pic'>
      <img src={`http://localhost:3000/uploads/${userData.image}` || Logo} alt='profile-pic' />
     </div>
     <div className='profile-details'>
     <input type="text"  value={userData.firstname}  readOnly />
        <input type="text" value={userData.lastname}  readOnly />
        <input type="email" value={userData.email}  readOnly />
        <input type="text" value={userData.mobile}  readOnly />
     </div>
     <div className="change-password">
        <button>Change Password &#9654;</button>
      </div>
      <div className="profile-logout">
        <button className="logout-button"
        onClick={() => setShowLogoutModal(true)}
        >Log out</button>
      </div>
    </div>
    {showLogoutModal && (
          <div className='logout-modal'>
          <div className='logout-Modal-Content'>
         <h2>Are You Sure  You Want to Logout ?</h2>
         <div className='logout-Modal-buttons'>
           <button className='yes-btn' type='button' onClick={handleLogout}>Yes</button>
           <button onClick={() => setShowLogoutModal(false)} className='cancel-btn' >Cancel</button>
         </div>
          </div>
    
        </div>
    )}
    </>
  )
}
export default Profile;