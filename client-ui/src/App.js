import { Avatar, Layout, Typography } from 'antd';
import { Link, Route, Routes } from 'react-router-dom';
import { AddIncident, AddIncidentData, Homepage, IncidentList, Login, Navbar, ShowIncidentData, Signup } from './components';

import './App.css';
import icon from './images/logo.png';

const App = () => {
  return (
    <div className='app'>
      <div className='logo-container'>
        <Avatar src={icon} size="large" />
        <Typography.Title level={2} className="logo">
          <Link to="/">Kerala Motor Vehicle Department
          </Link>
        </Typography.Title>
        <div className='header-nav-bar'>
          <Navbar headerIcon={true} />
        </div>
      </div>
      <div className='navbar'>
        <Navbar headerIcon={false} />
      </div>
      <div className='main'>
        <Layout>
          <div className="routes">
            <Routes>
              <Route path='/' element={<Homepage />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/addincident' element={<AddIncident />} />
              <Route path='/incidentlist' element={<IncidentList />} />
              <Route path='/incidentdata' element={<AddIncidentData />} />
              <Route path='/showincidentdata' element={<ShowIncidentData />} />
              <Route path='/logout' element={<Login />} />
            </Routes>
          </div>
        </Layout>
      </div>
    </div>
  );
}

export default App;