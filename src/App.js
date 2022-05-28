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

function App() {
  return (
    <div className="App">
        <Routes>
        <Route exact path='/' element={<Layout/>}>
            <Route exact path='/register' element={<Register/>}/>
            <Route exact path='/login' element={<Login/>}/>
            <Route exact path="/vehicles-list" element={<VehiclesList/>}/>
            <Route path="/vehicle/:id" element={<VehicleCard/>}/>
            <Route exact path="/vehicles/create" element={<VehicleForm/>}/>
            <Route exact path="/users-list" element={<UsersList/>}/>
            <Route path="/user/:id" element={<User/>}/>
          </Route>
        </Routes>
    </div>
  );
}

export default App;
