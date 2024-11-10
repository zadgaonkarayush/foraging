import React, { useEffect, useState } from 'react'
import Image from '../assets/plant.png';
import './DashBoard.css';
import axios from 'axios';
const MainSection = () => {
  const [plantNum,setPlantNum] = useState(0);
  useEffect(() =>{
    plantCount();
  },[]);
  const plantCount =() =>{
    axios.get('http://localhost:3000/auth/plant_count')
    .then(result =>{
      if(result.data.Result){
        setPlantNum(result.data.Result)
      }else{
        alert(result.data.Error)
      }
    })
  }


  return (
    <main className="main-section">
    <div className="plant-count">
        <img src={Image} alt="Plant" className="plant-img" />
      <div className='icons'>
      <h2>Total Plant Count </h2>
      <span className='plant-count'>{plantNum}</span>
      </div>
    
        
    </div>
</main>
  )
}

export default MainSection
