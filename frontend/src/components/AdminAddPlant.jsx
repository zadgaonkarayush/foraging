import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import { Button, TextField, IconButton, Typography, Card, CardMedia, CardContent, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import Image from '../assets/upload.png';
import Footer from './Footer';
import 'leaflet/dist/leaflet.css';
import './AddPlant.css';

const AdminAddPlant = ({ id }) => {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [plantName, setPlantName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [getLocation, setGetLocation] = useState(false);
  const navigate = useNavigate();

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const coords = e.latlng;
        setLocation(coords);

        // Fetch the location name using reverse geocoding with axios
        axios.get('https://nominatim.openstreetmap.org/reverse', {
          params: {
            lat: coords.lat,
            lon: coords.lng,
            format: 'json',
          },
        })
        .then(response => setLocationName(response.data.display_name))
        .catch(error => console.error('Error fetching location name:', error));
      },
    });
    return location ? (
      <Marker position={location}>
        <Popup>{locationName || 'You are here'}</Popup>
      </Marker>
    ) : null;
  };

  const handleIconClick = () => {
    document.getElementById('upload').click();
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('plantname', plantName);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('location', locationName || `${location.lat}, ${location.lng}`);

    if (file) {
      formData.append('file', file);
    }
    axios.post('http://localhost:3000/auth/add_plant', formData)
      .then(result => {
        if (result.data.Status) {
          navigate(`/adminplant`);
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className='add-plant-form'>
      <header className='form-header'>
        <Link to={`/admindashboard/${id}`}>
          <Button  sx={{color:'black',fontSize:'26px'}}>&lt;</Button>
        </Link>
        <Typography variant="h5">Add Plant</Typography>
      </header>
      <form className='form-content' onSubmit={handleSubmit}>
        <div className='form-group1'>
          <label htmlFor='upload' className='upload-label'>
            Upload Plant Photos
            <img src={Image} alt='Upload Icon' className='upload-icon' onClick={handleIconClick} />
          </label>
          <input type='file' name='file' id='upload' style={{ display: 'none' }} onChange={handleFileChange} />
        </div>
        <div className='form-groupAdd'>
          <TextField
            fullWidth
            label='Plant Name'
            variant='outlined'
            value={plantName}
            onChange={(e) => setPlantName(e.target.value)}
          />
        </div>
        <div className='form-groupAdd'>
          <TextField
            fullWidth
            label='Description / Notes'
            variant='outlined'
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className='form-groupAdd'>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label='Category'
            >
              <MenuItem value="Vegetables">Vegetables</MenuItem>
              <MenuItem value="Berries">Berries</MenuItem>
              <MenuItem value="Herbs">Herbs</MenuItem>
              <MenuItem value="Mushrooms">Mushrooms</MenuItem>
              <MenuItem value="Fungi">Fungi</MenuItem>
              <MenuItem value="Fruits">Fruits</MenuItem>
              <MenuItem value="Algae">Algae</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className='form-groupAdd'>
          <FormControlLabel
            control={<Checkbox checked={getLocation} onChange={() => { setGetLocation(!getLocation); if (!getLocation) handleLocation(); }} />}
            label='Get Location'
          />
        </div>
        <div className='form-groupAdd'>
          <TextField
            fullWidth
            label='Location'
            variant='outlined'
            value={locationName || (location ? `${location.lat}, ${location.lng}` : '')}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        {location && (
          <div className='form-groupAdd'>
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={13}
              style={{ height: '300px', width: '100%' }}
              className='map-container'
            >
              <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
              <LocationMarker />
            </MapContainer>
          </div>
        )}
        <Button type='submit' variant='contained' color='primary' className='submit-btn'>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default AdminAddPlant;
