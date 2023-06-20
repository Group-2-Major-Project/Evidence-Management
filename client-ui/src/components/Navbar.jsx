import React, { useState, useEffect } from 'react';
import { Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, MenuOutlined, UserAddOutlined, TableOutlined, LogoutOutlined } from '@ant-design/icons';

const Navbar = ({ headerIcon }) => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [screenSize, setScreenSize] = useState(undefined);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 800) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const closeMenu = () => {
    if (headerIcon) {
      setActiveMenu(!activeMenu)
    }
  }

  const logout = () => {
    if (headerIcon) {
      setActiveMenu(!activeMenu)
    }
    localStorage.removeItem("user");
  }

  return (
    <div className='nav-container'>
      <Button className="menu-control-container" onClick={() => setActiveMenu(!activeMenu)}><MenuOutlined /></Button>
      {activeMenu && (
        <Menu className='menu-items'>
          <Menu.Item icon={< HomeOutlined />} onClick={closeMenu} key="1">
            <Link to='/'>Home</Link>
          </Menu.Item>
          <Menu.Item icon={<UserAddOutlined />} onClick={closeMenu} key="2">
            <Link to='/addincident'>Add Incident</Link>
          </Menu.Item>
          <Menu.Item icon={<TableOutlined />} onClick={closeMenu} key="3">
            <Link to='/incidentlist'>Show Incident List</Link>
          </Menu.Item>
          <Menu.Item icon={<LogoutOutlined />} onClick={logout} key="4">
            <Link to='/logout'> Logout </Link>
          </Menu.Item>
        </Menu>
      )}
    </div>
  );
}

export default Navbar