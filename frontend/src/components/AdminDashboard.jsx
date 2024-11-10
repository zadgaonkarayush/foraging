import React, { useEffect, useState } from 'react'
import { AppBar, Toolbar, Typography, Box, Button, Drawer, List, ListItem, ListItemText, Grid, Card, CardContent, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Image from '../assets/image.png';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';


Chart.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
 
    const [adminTotal,setAdminTotal] = useState();
    const [userTotal,setUserTotal] = useState();
    const [plantTotal,setPlantTotal] = useState();
    const [categoryData,setCategoryData] = useState([]);
    const [open,setOpen] = useState(false);
    const navigate = useNavigate();
   
    useEffect(() =>{
        adminCount();
        userCount();
        plantCount();
        fetchCategoryData();
      
    },[])

    const adminCount =() =>{
        axios.get('http://localhost:3000/admin/admin_count')
        .then(result =>{
            if(result.data.Status){
                setAdminTotal(result.data.Result[0].admin)
            }
        })
    }
    const userCount =() =>{
        axios.get('http://localhost:3000/admin/user_count')
        .then(result =>{
            if(result.data.Status){
                setUserTotal(result.data.Result[0].user)
            }
        })
    }
    const plantCount =() =>{
        axios.get('http://localhost:3000/admin/plant_count')
        .then(result =>{
            if(result.data.Status){
                setPlantTotal(result.data.Result[0].plant)
            }
        })
    }
    
    
      const fetchCategoryData = () =>{
        axios.get('http://localhost:3000/admin/categories')
      .then(result =>{
        if(result.data.Status){
          setCategoryData(result.data.Result);
        }
      })
      .catch((err) => console.log(err));
    
      }
    

    const NavBar =() =>(
      <AppBar position='static' sx={{backgroundColor:'rgba(219, 247, 229, 1)',padding:'20px'}}>
        <Toolbar sx={{justifyContent:'space-between',alignItems:'center'}}>
            <Typography variant='h6' sx={{flexGrow:1,display:'flex',alignItems:'center'}}>
              <img src={Image} alt='logo' style={{height:'100px'}} />
            </Typography>
       <Box  sx={{display:'flex',gap:2}}>
       <Button color='success'
        sx={{transition:'transform 0.3s ease-in-out',
          '&:hover':{
            transform:'scale(1.1)',}}} href='/adminaddplant'
       >Add Plant</Button>
       <Button color='success'
        sx={{transition:'transform 0.3s ease-in-out',
          '&:hover':{
            transform:'scale(1.1)',}}} href='/adminplant'
       >Plants</Button>
        <Button color='success'
         sx={{transition:'transform 0.3s ease-in-out',
          '&:hover':{
            transform:'scale(1.1)',}}}
           href='/adminuser'
        >Users</Button>
        <Button color='success'
          sx={{transition:'transform 0.3s ease-in-out',
            '&:hover':{
              transform:'scale(1.1)',}}}
            onClick={() => setOpen(true)}
        >Logout</Button>
       </Box>
        </Toolbar>

      </AppBar>
    );
 
    const pieData ={
      labels:categoryData.map(item => item.category),
      datasets:[
        {
          data:categoryData.map(item=> item.count),
          backgroundColor:['red','blue','yellow','pink','orange','violet','green']
        }
      ]
    };
    const handleClose = () =>{
      setOpen(false);
    }
    const handleLogout = () =>{
      axios.post('http://localhost:3000/admin/logout')
      .then(result =>{
        if(result.data.Status){
          navigate('/');
        }
      })
      .catch((err) => console.log(err));
    }

  return (
   

<Box sx={{ display: 'flex',flexDirection:'column',height:'100vh' }}>
  <NavBar />
  <Box component='main' sx={{ flexGrow: 1, p: 3, backgroundColor:'white' }}>
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ backgroundColor: 'rgba(219, 247, 229, 1)' }}>
          <CardContent>
            <Typography variant="h5">Total Users:</Typography>
            <Typography variant="h4">{userTotal}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ backgroundColor: 'rgba(219, 247, 229, 1)' }}>
          <CardContent>
            <Typography variant="h5">Total PlantsL:</Typography>
            <Typography variant="h4">{plantTotal}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4} >
        <Card sx={{ backgroundColor: 'rgba(219, 247, 229, 1)' }}>
          <CardContent>
            <Typography variant="h5">Total admins:</Typography>
            <Typography variant="h4">{adminTotal}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    <Paper sx={{ mt: 3,padding:2,maxWidth:'400px',margin:'auto' }}>
      <Typography variant='h5'>Plant Categories Distribution</Typography>
      <Pie data={pieData} />
    </Paper>
  </Box>
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>Logout Confirmation</DialogTitle>
    <DialogContent>
      <Typography>Are you sure you want to logout?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleLogout}>OK</Button>
      <Button onClick={handleClose}>Cancel</Button>
    </DialogActions>
  </Dialog>
</Box>

   
  );
}

export default AdminDashboard
