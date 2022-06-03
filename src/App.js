import './App.scss';
import { Route, Routes } from 'react-router-dom';
import { UsersList } from './components/users/users-list/UsersList';
import { User } from './components/users/user/User';
import { Register } from './components/auth/register/Register';
import { Login } from './components/auth/login/Login'
import { VehiclesList } from './components/vehicles/vehicles-list/VehiclesList'
import { Layout } from './components/layout/Layout';
import { VehicleForm } from './components/vehicles/vehicle-form/VehicleForm';
import { Vehicle } from './components/vehicles/vehicle/Vehicle';
import { UserForm } from './components/users/user-form/UserForm';
import { RentalEventForm } from './components/rental-events/rental-event-form/RentalEventForm';
import "react-datetime/css/react-datetime.css";

function App() {
  return (
    <div className="App">
        <Routes>
          <Route exact path='/' element={<Layout/>}>

            <Route path='*' element={<VehiclesList/>}/>

            {/* Auth */}
            <Route exact path='/register' element={<Register/>}/>
            <Route exact path='/login' element={<Login/>}/>
            
            {/* Vehicles */}
            <Route exact path="/vehicles" element={<VehiclesList/>}/>
            <Route path="/vehicle/:id" element={<Vehicle/>}/>
            <Route path="/vehicle/:id/edit" element={<VehicleForm/>}/>
            <Route exact path="/vehicles/create" element={<VehicleForm/>}/>

            {/* Users */}
            <Route exact path="/users" element={<UsersList/>}/>
            <Route path="/user/:id" element={<User/>}/>
            <Route path="/user/:id/edit" element={<UserForm/>}/>

            {/* Rental Events */}
            <Route exact path="/rented" element={<VehiclesList/>}/>
            <Route exact path="/vehicle/:id/rent" element={<RentalEventForm/>}/>

          </Route>
        </Routes>
    </div>
  );
}

export default App;
