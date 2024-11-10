
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, IconButton, Typography, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { styled } from '@mui/system';

// Styled components for the sidebar
const SidebarContainer = styled('div')(({ theme }) => ({
  position: 'fixed',
  height: 'calc(100% - 80px)', // Full height minus the header's height
  width: 150,
  backgroundColor: theme.palette.background.paper,
  left: 0,
  top: 155,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
  transition: 'width 0.3s',
  [theme.breakpoints.down('md')]: {
    width: 80,
  },
  [theme.breakpoints.down('sm')]: {
    width: 60,
  },
}));

const NavButton = styled(Button)(({ theme, variant }) => ({
  width: '100%',
  justifyContent: 'flex-start',
  padding: theme.spacing(1),
  textTransform: 'none',
  color: variant === 'home' ? theme.palette.success.main :
         variant === 'wishlist' ? theme.palette.error.main :
         theme.palette.text.primary,
  fontWeight: 'bold',
  '&:hover': {
    color: variant === 'home' ? theme.palette.success.dark :
           variant === 'wishlist' ? theme.palette.error.dark :
           theme.palette.text.secondary,
  },
  [theme.breakpoints.down('sm')]:{
         '&.MuiTypography-root':{
               display:'none',
         },
         '& .MuiSvgIcon':{
          fontsize:20,
         },
  },
}));

const Sidebar = () => {
  const { id } = useParams();

  return (
    <SidebarContainer>
      <Link to={`/dashboard/${id}`} style={{ textDecoration: 'none' }}>
        <NavButton variant="home">
          <HomeIcon sx={{ marginRight: 1 }} />
          <Typography>Dashboard</Typography>
        </NavButton>
      </Link>
      <Link to={`/add_plant`} style={{ textDecoration: 'none' }}>
        <NavButton variant="add">
          <AddIcon sx={{ marginRight: 1 }} />
          <Typography>Add Plant</Typography>
        </NavButton>
      </Link>
      <Link to={`/wishlist/${id}`} style={{ textDecoration: 'none' }}>
        <NavButton variant="wishlist">
          <FavoriteIcon sx={{ marginRight: 1 }} />
          <Typography>WishList</Typography>
        </NavButton>
      </Link>
    </SidebarContainer>
  );
};

export default Sidebar;

