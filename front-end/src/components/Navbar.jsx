import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './navbar.css';

function Navbar() {
  const [activeLink, setActiveLink] = useState('Home');
  const [navbarOpen, setNavbarOpen] = useState(false);

  const handleToggle = () => {
    setNavbarOpen(!navbarOpen);
  };

  const closeMenu = () => {
    setNavbarOpen(false);
  };

  return (
    <nav className="bg-slate-800 h-16 w-full flex justify-between items-center px-4 md:px-32">
      <div className="md:hidden">
        <button onClick={handleToggle} className="text-white focus:outline-none">
          {navbarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <ul
        className={`md:flex md:items-center md:w-full md:justify-center absolute md:static bg-slate-800 w-full left-0 px-4 md:px-0 py-4 md:py-0 ${
          navbarOpen ? 'top-16' : 'top-[-500px]'
        } transition-all ease-in duration-500`}
      >
        <div className="md:flex md:justify-center md:w-full">
          <Link to="/" onClick={() => { setActiveLink('Home'); closeMenu(); }}>
            <li
              className={activeLink === 'Home' ? 'nav-item active' : 'nav-item'}
            >
              Home
            </li>
          </Link>
          <Link
            to="/linecounter"
            onClick={() => { setActiveLink('LineCounter'); closeMenu(); }}
          >
            <li
              className={
                activeLink === 'LineCounter' ? 'nav-item active' : 'nav-item'
              }
            >
              Line Counter
            </li>
          </Link>
          <Link
            to="/polygoncounter"
            onClick={() => { setActiveLink('PolygonCounter'); closeMenu(); }}
          >
            <li
              className={
                activeLink === 'PolygonCounter' ? 'nav-item active' : 'nav-item'
              }
            >
              Polygon Counter
            </li>
          </Link>
          <Link
            to="/heatmap"
            onClick={() => { setActiveLink('Heatmap'); closeMenu(); }}
          >
            <li
              className={
                activeLink === 'Heatmap' ? 'nav-item active' : 'nav-item'
              }
            >
              Heatmap
            </li>
          </Link>
          <Link
            to="/multi-video"
            onClick={() => { setActiveLink('Multi-video'); closeMenu(); }}
          >
            <li
              className={
                activeLink === 'Multi-video' ? 'nav-item active' : 'nav-item'
              }
            >
              Multi-video
            </li>
          </Link>
          <Link
            to="/parking"
            onClick={() => { setActiveLink('Parking'); closeMenu(); }}
          >
            <li
              className={
                activeLink === 'Parking' ? 'nav-item active' : 'nav-item'
              }
            >
              Parking Safety
            </li>
          </Link>
        </div>
      </ul>
    </nav>
  );
}

export default Navbar;