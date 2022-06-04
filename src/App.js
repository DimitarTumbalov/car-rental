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
import { NonAuthenticatedGuard } from './utils/guards/NonAuthenticatedGuard';
import { AuthenticatedRoute } from './utils/guards/AuthenticatedGuard';
import { AuthorizedGuard } from './utils/guards/AuthorizedGuard';

function App() {
  return (
    <div className="App">
        <Routes>
          <Route exact path='/' element={<Layout/>}>

            {/* Default routes */}
            <Route path='' element={<VehiclesList/>}/>
            <Route path='*'  element={<VehiclesList/>}/>

            {/* Auth */}
            <Route exact path='/register' element={<NonAuthenticatedGuard> <Register/> </NonAuthenticatedGuard>}/>
            <Route exact path='/login' element={<NonAuthenticatedGuard> <Login/> </NonAuthenticatedGuard>}/>
            
            {/* Vehicles */}
            <Route exact path="/vehicles" element={<VehiclesList/>}/>
            <Route path="/vehicle/:id" element={<Vehicle/>}/>
            <Route path="/vehicle/:id/edit" element={<AuthorizedGuard> <VehicleForm/> </AuthorizedGuard>}/>
            <Route exact path="/vehicle/create" element={<AuthorizedGuard> <VehicleForm/> </AuthorizedGuard>}/>

            {/* Users */}
            <Route exact path="/users" element={<AuthorizedGuard> <UsersList/> </AuthorizedGuard>}/>
            <Route path="/user/:id" element={<AuthenticatedRoute> <User/> </AuthenticatedRoute>}/>
            <Route path="/user/:id/edit" element={<AuthenticatedRoute> <UserForm/> </AuthenticatedRoute>}/>

            {/* Rental Events */}
            <Route exact path="/rented" element={<AuthenticatedRoute> <VehiclesList/> </AuthenticatedRoute>}/>
            <Route exact path="/vehicle/:id/rent" element={<AuthenticatedRoute> <RentalEventForm/> </AuthenticatedRoute>}/>

          </Route>
        </Routes>
    </div>
  );
}

export default App;
