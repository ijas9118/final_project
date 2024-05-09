import React, { useState } from 'react';
import './navbar.css'
import { Link } from 'react-router-dom';

function Navbar() {
  const [activeLink, setActiveLink] = useState('Home');

  return (
    <div className="bg-slate-800 h-16 w-full flex justify-between items-center px-32 gap-28">
        <div className="text-white flex items-center gap-3 text-3xl">Logo</div>
        <ul className="flex items-center justify-center">
            <li className={activeLink === 'Home' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveLink('Home')}><Link to={'/'}>Home</Link></li>
            <li className={activeLink === 'Heatmap' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveLink('Heatmap')}><Link to={'/heatmap'}>Heatmap</Link></li>
            <li className={activeLink === 'Multi-video' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveLink('Multi-video')}><Link to={'/multi-video'}>Multi-video</Link></li>
            <li className={activeLink === 'About' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveLink('About')}><Link to={'/about'}>About</Link></li>
        </ul>
        <button className="w-36 h-10 outline-none border-2 rounded-full text-slate-800 text-lg bg-slate-400">
            Login
        </button>
        {/* <div className="flex items-center">
            <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center ml-4">
            <span className="text-slate-500">U</span>
            </div>
        </div> */}
    </div>
  );
}

export default Navbar;
