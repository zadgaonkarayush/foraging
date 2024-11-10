import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './plantDetail.css';
import { Button,Card, CardContent, CardMedia, Typography } from '@mui/material';

// import { Button } from 'shadcn';



// import { Card, CardHeader, CardContent } from 'shadcn';

function PlantDetail() {
  const {id } = useParams();
  const userId = localStorage.getItem('userId'); // Get the user ID from localStorage

  console.log(id);
  const [plant, setPlant] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/auth/plant_detail/${id}`)
      .then(result => {
        if (result.data.Result) {
          setPlant(result.data.Result);
        } else {
          alert('Plant not found');
        }
      })
      .catch(err => {
        console.error('Error fetching plant details:', err);
      });
  }, [id]);

  if (!plant) return <p>Loading...</p>;

  return (
     <>
     <header className='form-header'>
        <Link to={`/dashboard/${userId}}`}><Button className='back-button' sx={{fontSize:'36px',color:'black'}}>&lt;</Button>
        </Link>
        <Typography variant='h5'>Plant Information</Typography>
      </header>
      <div className='plant-detail'>
      <Card>
      <CardMedia
            component="img"
            height="300"
            image={`http://localhost:3000/Images/${plant.image}`}
            alt="Plant image"
          />
          <CardContent>
            <Typography variant="h5" component="div">
              {plant.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {plant.category}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <i className='fas fa-map-marker-alt'></i> {plant.location}
            </Typography>
            <Typography variant="body1" mt={2}>
              {plant.description}
            </Typography>
            </CardContent>
      </Card>
    </div>
     </>
  );
}

export default PlantDetail;
