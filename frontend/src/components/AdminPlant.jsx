import { Button, Typography, Card, CardMedia, IconButton } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete';


const AdminPlant = () => {
  const { id } = useParams();

  const [plants, setPlants] = useState([]);
  const navigate = useNavigate();




  useEffect(() => {
    plantRecords();
    console.log("admindashboard", id);
  }, [id]);

  const plantRecords = () => {
    axios.get('http://localhost:3000/auth/plant_fullrecords')
      .then(result => {
        if (result.data.Status) {
          setPlants(result.data.Result)
        } else {
          alert(result.data.Error)
        }
      })
  }

  const handleDelete = (plantId) => {
    if (window.confirm("Are you sure you want to delete this plant ?")) {
      axios.delete(`http://localhost:3000/admin/delete_plant/${plantId}`)
        .then(result => {
          if (result.data.Status) {
            alert('Plant deleted successfully!');

            setPlants(plants.filter(plant => plant.id !== plantId)); // update page
          } else {
            alert(result.data.Error);
          }
        })
        .catch(err => console.log('Error deleting plant', err));
    }
  }
  return (
    <>
      <header className='form-header'>
        <Link to={`/admindashboard/${id}`}>
          <Button sx={{ fontSize: '36px', color: 'black' }} >&lt;</Button>
        </Link>
        <Typography variant='h4'>Plants List</Typography>
      </header>
      <div className='plant-list'>
        {
          plants.map(e => (
            <Card key={e.id} className='plant-item'>

              <CardMedia src={`http://localhost:3000/images/${e.image}`}
                sx={{ maxWidth: 345, margin: 2 }}
                alt='plant image' component="img"
                height="140"
                onClick={() => console.log(`View plant ${e.id}`)}
              />

              <Typography variant='h6'>{e.name}</Typography>
              <Typography variant='body2' color='text.secondary'>{e.description.slice(0, 100)}</Typography>

              <IconButton
                aria-label='delette'
                color='error'
                onClick={() => handleDelete(e.id)}
              >
                <DeleteIcon />
              </IconButton>

            </Card>
          ))
        }
      </div>
    </>
  )
}

export default AdminPlant
