import React from 'react';
import LoginForm from './components/LoginForm';
import { BrowserRouter,Routes,Route} from 'react-router-dom'
import RegistrationForm from './components/RegistrationForm';
import ForgotPassword from './components/ForgotPassword';
import DashBoard from './components/DashBoard';
import AddPlant from './components/AddPlant';
import Fourites from './components/Fourites';
import ResetPassword from './components/ResetPassword';
import EnterOtp from './components/EnterOtp';
import Search from './components/Search';
import Profile from './components/Profile.jsx';
import ProfileEdit from './components/ProfileEdit';
import PlantDetail from './components/PlantDetail.jsx';
import ChangePassword from './components/ChangePassword.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import AdminRegister from './components/AdminRegister.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import AdminPlant from './components/AdminPlant.jsx';
import AdminAddPlant from './components/AdminAddPlant.jsx';
import AdminUser from './components/AdminUser.jsx';

function App() {
  return (
   <>
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<LoginForm />}></Route>
    <Route path='/register' element={<RegistrationForm />}></Route>
    <Route path='/forgotPassword' element={<ForgotPassword />}></Route>
    <Route path='/resetpassword/:email' element={<ResetPassword />}></Route>
    <Route path='/enterotp/:email' element={<EnterOtp />}></Route>
    <Route path='/changepassword/:id' element={<ChangePassword />} ></Route>
    <Route path='/adminlogin' element={<AdminLogin />}></Route>
    <Route path='/adminregister' element={<AdminRegister />}></Route>

    <Route path='/dashboard/:id' element={<DashBoard />}> </Route>
    <Route path='/plant_detail/:id' element={<PlantDetail />} ></Route>
    <Route path='/add_plant' element={<AddPlant />} ></Route>
    <Route path='/wishlist/:id' element={<Fourites />} ></Route>
    <Route path='/search/:id' element={<Search />}></Route>
    <Route path='/viewprofile/:id' element={<Profile />} />
    <Route path='/editProfile/:id' element={<ProfileEdit />}></Route>
    <Route path='/admindashboard/:id' element={<AdminDashboard />}></Route>
    <Route path='/adminplant' element={<AdminPlant />} ></Route>
    <Route path='/adminaddplant' element={<AdminAddPlant />}></Route>
    <Route path='/adminuser' element={<AdminUser />}></Route>
    

   </Routes>
   </BrowserRouter>
   </>
  );
}

export default App;
