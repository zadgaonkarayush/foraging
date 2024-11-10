
import React, { useEffect, useState } from 'react'
import './DashBoard.css'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter,faSearch} from '@fortawesome/free-solid-svg-icons'; // Import any specific icons you need
import Footer from './Footer';
import { useNavigate, useParams } from 'react-router-dom';



const Search = (id) => {

  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('http://localhost:3000/auth/plant_fullrecords')
      .then(result => {
        if (result.data.Status) {
          setPlants(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch(error => {
        console.error('Error fetching plant records:', error);
      });
  }, []);
  useEffect(() =>{
   let updatedPlants = plants;
   if(searchQuery){
    updatedPlants=updatedPlants.filter(plant =>
      plant.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
   }
   if(selectedCategory){
    updatedPlants=updatedPlants.filter(plant => 
      plant.category === selectedCategory
    );
   }
   updatedPlants.sort((a, b) => {
    const aIncludesQuery = a.name.toLowerCase().includes(searchQuery.toLowerCase());
    const bIncludesQuery = b.name.toLowerCase().includes(searchQuery.toLowerCase());
    return (aIncludesQuery === bIncludesQuery) ? 0 : aIncludesQuery ? -1 : 1;
  });
  
   setFilteredPlants(updatedPlants);
  },[searchQuery,selectedCategory,plants]);
  const handlePlantClick = (id) =>{
    navigate(`/plant_detail/${id}`)
}


  return (
  <div className='search-container'>
    
    <input type='text' className='search-input' placeholder='Search plants'
    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
  
    <div className='filter-container'>
    <FontAwesomeIcon icon={faFilter} className='filter-icon' />
    <select value={selectedCategory} className='category-select' onChange={(e) => setSelectedCategory(e.target.value)}>
      <option value='values'></option>
    <option value="Vegetables">Vegetables</option>
            <option value="Berries">Berries</option>
            <option value='Herbs'>Herbs</option>
            <option value='Mushrooms'>Mushrooms</option>
            <option value='Fungi'>Fungi</option>
            <option value="Fruits">Fruits</option>
            <option value='Algae'>Algae</option>
    </select>
    </div>
      <div className='plant-list'>
      {
        filteredPlants.map(e => (

          <div key={e.id} className='plant-item'  >

            <img src={`http://localhost:3000/images/${e.image}`} alt='plant image' className='plant-image'
           onClick={() => handlePlantClick(e.id)} />
            <h2>{e.name}</h2>


            <p>{e.description.slice(0, 100)}</p>
          </div>

        ))
      }
    </div>
    <Footer id={id} />
  </div>
  )
}

export default Search
