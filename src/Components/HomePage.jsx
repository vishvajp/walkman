import React from 'react';
import logo from "../Assets/images/iww logo.png";
import { Outlet, useNavigate } from 'react-router-dom';
import "../Css/HomePage.css";
import { MdEmail } from "react-icons/md";
import { FaPhoneVolume, FaWhatsapp, FaFacebook, FaLinkedinIn } from "react-icons/fa6";
import { RiWhatsappFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate()
  return (
    <div className="app-container">
      <header className='row'>
        <div className='col-3'>
          <img className="homepage-logo" src={logo} alt="Logo" />
        </div>
        <div className='col-7' style={{height:"100%"}}>
          <div className='row' style={{height:"50%"}}>
            <div className='col'>
              <div className='d-flex justify-content-center align-items-center home-contact-div'>
                <MdEmail className='home-contact-icons'/>
                <span className='home-contact-text'>Tabsquareinfotec@gmail.com</span>
              </div>
            </div>
            <div className='col'>
              <div className='d-flex justify-content-center align-items-center home-contact-div'>
                <FaPhoneVolume className='home-contact-icons' />
                <span className='home-contact-text'>123456789</span>
              </div>
            </div>
            <div className='col'>
              <div className='d-flex justify-content-center align-items-center home-contact-div'>
                <RiWhatsappFill className='home-contact-icons'/>
                <span className='home-contact-text'>Whatsapp</span>
              </div>
            </div>
          </div>
          <div className='row' style={{height:"50%"}}>
            <div className='col'>
              <div className='d-flex justify-content-center align-items-end' style={{height:"100%"}}>
              <div className='homepage-navigators d-flex'>
  <NavLink to="/" className={({ isActive }) => isActive ? "homepage-navigators-span active-link" : "homepage-navigators-span"} activeClassName="active-link">Home</NavLink>
  <NavLink to="/test" className={({ isActive }) => isActive ? "homepage-navigators-span active-link" : "homepage-navigators-span"} activeClassName="active-link">About</NavLink>
  <NavLink to="/product" className={({ isActive }) => isActive ? "homepage-navigators-span active-link" : "homepage-navigators-span"} activeClassName="active-link">Product</NavLink>
</div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-2' style={{height:"100%"}}>
          <div className='row' style={{height:"50%"}}>
            <div className='col'>
              <div className='d-flex gap-2 justify-content-center align-items-center' style={{height:"100%"}}>
                <span><FaLinkedinIn  className='home-contact-icons-last-col'/></span>
                <span><FaFacebook className='home-contact-icons-last-col'/></span>
                <span><FaLinkedinIn  className='home-contact-icons-last-col'/></span>
              </div>
            </div>
          </div>
          <div className='row'  style={{height:"50%"}}>
            <div className='col'>
              <div className='d-flex justify-content-center align-items-end' style={{height:"100%"}}>
                <span className='homepage-enquire-text'>Enquire Now</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="content">
        <Outlet /> {/* This will load the different pages */}
      </div>

      <footer>
        <div className='d-flex justify-content-center'>
          <span>@2025 Walkman</span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
