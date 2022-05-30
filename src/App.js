import './App.scss';
import { Route, Routes } from 'react-router-dom';
import { UsersList } from './components/users/users-list/UsersList';
import { User } from './components/users/user/User';
import { Register } from './components/auth/register/Register';
import { Login } from './components/auth/login/Login'
import { VehiclesList } from './components/vehicles/vehicles-list/VehiclesList'
import { VehicleCard } from './components/vehicles/vehicle-card/VehicleCard'
import { Layout } from './components/layout/Layout';
import { VehicleForm } from './components/vehicles/vehicle-form/VehicleForm';
import { Vehicle } from './components/vehicles/vehicle/Vehicle';
import { UserForm } from './components/users/user-form/UserForm';

function App() {
  return (
    <div className="App">
        <Routes>
          <Route exact path='/' element={<Layout/>}>

            {/* Auth */}
            <Route exact path='/register' element={<Register/>}/>
            <Route exact path='/login' element={<Login/>}/>
            
            {/* Vehicles */}
            <Route exact path="/vehicles-list" element={<VehiclesList/>}/>
            <Route path="/vehicle/:id" element={<Vehicle/>}/>
            <Route path="/vehicle/:id/edit" element={<VehicleForm/>}/>
            <Route exact path="/vehicles/create" element={<VehicleForm/>}/>

            {/* Users */}
            <Route exact path="/users-list" element={<UsersList/>}/>
            <Route path="/user/:id" element={<User/>}/>
            <Route path="/user/:id/edit" element={<UserForm/>}/>

          </Route>
        </Routes>
    </div>
  );
}

export default App;
