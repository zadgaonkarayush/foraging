// import React, { useEffect, useState } from 'react'
// import Footer from './Footer'
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';
// import { FaHeart } from 'react-icons/fa'; // Import heart icon from react-icons


// const Fourites = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [wishlist, setWishlist] = useState([]);
//   useEffect(() => {
//     getWishlist();
//   }, [id,wishlist]);

//   const getWishlist = () => {
//     axios.get(`http://localhost:3000/auth/wishlist/${id}`)
//       .then(result => {
//         if (result.data.Status) {
//           setWishlist(result.data.Result) // stores plant id in the wishlist
//         } else {
//           alert(result.data.Error)
//         }
//       })
//   }
//   const toggleWishlist = (plantId) => {
//     axios.post(`http://localhost:3000/auth/wishlist`, { id, plantId })
//       .then(result => {
//         if (result.data.Status) {
//           if (wishlist.includes(plantId)) {
//             setWishlist(wishlist.filter(id => id !== plantId)); //remove from wishlist

//           } else {
//             getWishlist();
//           }
//         } else {
//           alert(result.data.Error)
//         }
//       })
//       .catch(err => {
//         console.error('Error updating wishlist', err)
//       });
//   }
//   const handlePlantClick = (id) => {
//     navigate(`/plant_detail/${id}`)
//   }
//   return (
//     <>
//       <div className='plant-list'>
//         {
//           wishlist.length > 0 ? (
//             wishlist.map((item, index) => (
//               <div key={index} className='plant-item'>
//                 <img
//                   src={`http://localhost:3000/images/${item.image}`}
//                   alt='plant image'
//                   className='plant-image'
//                 />
//                 <h2>{item.name}</h2>
//                 <p>{item.description ? item.description.slice(0, 100) : 'No description available'}</p>
//                 <FaHeart
//                   style={{ color: wishlist.includes(item.id) ? 'rgb(250, 246, 246)' : 'red' }}
//                   className='heart-icon'
//                   onClick={() => toggleWishlist(item.id)}
//                 />

//               </div>
//             ))
//           ) : (
//             <p>No items in Wishlist</p>
//           )
//         }
//       </div>

//       <Footer id={id} />
//     </>
//   )
// }

// export default Fourites
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, IconButton, Grid, CircularProgress, Container } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Footer from './Footer';

const Fourites = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWishlist();
  }, [id]);

  const getWishlist = () => {
    setLoading(true);
    axios.get(`http://localhost:3000/auth/wishlist/${id}`)
      .then(result => {
        if (result.data.Status) {
          setWishlist(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .finally(() => setLoading(false));
  };

  const toggleWishlist = (plantId) => {
    axios.post(`http://localhost:3000/auth/wishlist`, { id, plantId })
      .then(result => {
        if (result.data.Status) {
          setWishlist(prevWishlist =>
            prevWishlist.includes(plantId)
              ? prevWishlist.filter(id => id !== plantId)
              : [...prevWishlist, plantId]
          );
          getWishlist();
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => {
        console.error('Error updating wishlist', err);
      });
  };

  const handlePlantClick = (plantId) => {
    navigate(`/plant_detail/${plantId}`);
  };

  return (
    <Container>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {wishlist.length > 0 ? (
            wishlist.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardMedia
                    component='img'
                    height='140'
                    image={`http://localhost:3000/images/${item.image}`}
                    alt='plant image'
                    onClick={() => handlePlantClick(item.id)}
                    sx={{ cursor: 'pointer' }}
                  />
                  <CardContent>
                    <Typography variant='h6'>{item.name}</Typography>
                    <Typography variant='body2' color='textSecondary'>
                      {item.description ? item.description.slice(0, 100) : 'No description available'}
                    </Typography>
                    <IconButton
                      color={wishlist.includes(item.id) ? 'default' : 'error'}
                      onClick={() => toggleWishlist(item.id)}
                    >
                      <FavoriteIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant='h6'>No items in Wishlist</Typography>
          )}
        </Grid>
      )}
      <Footer id={id} />
    </Container>
  );
};

export default Fourites;
