import React from 'react';
import './DashBoard.css';
import Header from './Header';
import MainSection from './MainSection';
import Footer from './Footer';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaHeart } from 'react-icons/fa'; // Import heart icon from react-icons
import { Card, CardMedia, CardContent, Typography, IconButton } from '@mui/material';




const DashBoard = () => {

  const id = localStorage.getItem('userId');
  const [plants, setPlants] = useState([]);
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);


  useEffect(() => {
    plantRecords();
    getWishlist();
    console.log("dashboard", id);
  }, [id]);

  const plantRecords = () => {
    axios.get('http://localhost:3000/auth/plant_records')
      .then(result => {
        if (result.data.Status) {
          setPlants(result.data.Result)
        } else {
          alert(result.data.Error)
        }
      })
  }

  const getWishlist = () => {
    axios.get(`http://localhost:3000/auth/wishlist/${id}`)
      .then(result => {
        if (result.data.Status) {
          setWishlist(result.data.Result.map(plant => plant.id)) // stores plant id in the wishlist
        } else {
          alert(result.data.Error)
        }
      })
  }

  
  const toggleWishlist = (plantId) => {
    axios.post('http://localhost:3000/auth/wishlist', { id, plantId })
      .then(result => {
        if (result.data.Status) {
          // Update state based on whether the item was added or removed
          setWishlist(prevWishlist => 
            prevWishlist.includes(plantId)
              ? prevWishlist.filter(id => id !== plantId) // Remove from wishlist
              : [...prevWishlist, plantId] // Add to wishlist
          );
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => {
        console.error('Error updating wishlist', err);
      });
  };
  
  const handlePlantClick = (id) => {
    navigate(`/plant_detail/${id}`)
  }
  return (
    <>
      {/* Header */}

      <Header id={id} />
      <Sidebar />
      <MainSection />
      <div className='List-top'>
        <Typography>List Of Plants</Typography>
        <Link to={`/search/${id}`} className='Link-p'><Typography variant='body1'>View All</Typography></Link>
      </div>
      <div className='plant-list'>
        {
          plants.map(e => (
            <Card key={e.id} className='plant-item'>

              <CardMedia src={`http://localhost:3000/images/${e.image}`} 
              sx={{ maxWidth: 345, margin: 2 }}
              alt='plant image' component="img"
               height="140"
                onClick={() => handlePlantClick(e.id)} />
              {/* <img src="http://localhost:3000/images/image_1725792320253.jpg" alt="Plant Image" /> */}

              <Typography variant='h6'>{e.name}</Typography>
              <Typography variant='body2' color='text.secondary'>{e.description.slice(0, 100)}</Typography>

              <IconButton style={{ color: wishlist.includes(e.id) ? 'red' : 'grey' }}
                                className='MuiIconButton-root'

                onClick={() => toggleWishlist(e.id)}>
              <FaHeart  />

              </IconButton>

            </Card>
          ))
        }
      </div>

      {/* <Footer /> */}
    </>
  )
}

export default DashBoard
