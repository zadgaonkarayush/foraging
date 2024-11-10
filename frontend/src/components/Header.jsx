import React, { useEffect, useState } from 'react'
import './DashBoard.css';
import Logo from '../assets/image.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const Header = ({ id }) => {
  console.log('Header ID:', id);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({ firstname: '', image: '' });
  const [selectedImage, setSelectedImage] = useState(null); // For image upload
  const [ showLogoutModal,setShowLogoutModal] = useState(false);
 axios.defaults.withCredentials = true;

 const navigate = useNavigate();
  const handleProfileClick = () => {
    setDropdownOpen(prev => !prev);
  };
  useEffect(() => {
    axios.get(`http://localhost:3000/auth/viewprofile/${id}`)
      .then(result => {
        if (result.data.Status) {
          console.log(result.data.Result)
          setUser(result.data.Result)
        }
      })
      .catch((err) => console.log(err))
  }, [id])

  const handleLogoClick = () => {
    window.location.reload();
  };

  // Handle file input change
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleImageUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('profileImage', selectedImage);
    formData.append('id', id); // Send the user ID along with the image

    axios.post(`http://localhost:3000/auth/uploadProfileImage`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        if (response.data.Status) {
          alert('Image uploaded successfully!');
          setUser((prevUser) => ({ ...prevUser, image: response.data.imagePath }));
        }
      })
      .catch((error) => {
        console.log('Error uploading image:', error);
      });
  };
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
      <header className='header'>
        <img src={Logo} alt='logo' className='logo' onClick={handleLogoClick} />

        <div className="profile-section">
          <img src={`http://localhost:3000/uploads/${user.image}`  || Logo} alt="User" className="user-image" onClick={handleProfileClick} />
          <div className="profile-text">
            <p>Hi, {user.firstname}</p>
          </div>
          {dropdownOpen && (
            <div className='dropdown-menu'>
              <Link to={`/viewprofile/${id}`} className='dropdown-item'>View Profile</Link>
              <Link to={`/editProfile/${id}`} className='dropdown-item'>Settings</Link>
              <form onSubmit={handleImageUpload}>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <button type="submit" className="dropdown-item">Upload Profile Image</button>
            </form>
              <button className='dropdown-item' type='button' onClick={() => setShowLogoutModal(true)}>Logout</button>
            </div>
          )}
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
      </header>
    </>
  )
}

export default Header

