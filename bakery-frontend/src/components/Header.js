import React, { useState } from 'react';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
} from 'mdb-react-ui-kit';

import { LogoutButton } from './LogoutButton';
import { useContext } from 'react';
import { LoggedInContext } from './App';

/**
 * Organizes the header
 * 
 * @returns Navigation Bar
 */
function Header() {
  const [showBasic, setShowBasic] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useContext(LoggedInContext);

  return (
    <MDBNavbar expand='lg' light bgColor='light'>
      <MDBContainer fluid>
      <a class="navbar-brand me-2" href="/">
      <img
        src="https://i.imgur.com/WnhNlqY_d.webp?maxwidth=760&fidelity=grand"
        height="36"
        alt="GG Logo"
        loading="lazy"
       
      />
    </a>

        <MDBNavbarToggler
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setShowBasic(!showBasic)}
        >
          <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar show={showBasic}>
          <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
         

            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag='a' className='nav-link' role='button'>
                  Recipes
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem link href='/quick'>Quick</MDBDropdownItem>
                  <MDBDropdownItem link href='/breakfast'>Breakfast</MDBDropdownItem>
                  <MDBDropdownItem link href='/snack'>Snack</MDBDropdownItem>
                  <MDBDropdownItem link href='/dinner'>Dinner</MDBDropdownItem>
                  <MDBDropdownItem link href='/dessert'>Dessert</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='/culture'>Culture</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='/about'>About Us</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='/contact'>Contact</MDBNavbarLink>
            </MDBNavbarItem>
            
          </MDBNavbarNav>
         
          <a class="navbar-brand me-2" href="/search">
      <img
        src="https://i.imgur.com/drIqvV8.png"
        height="36"
        alt="GG Logo"
        loading="lazy"
       
      />
    </a>
          <a class="navbar-brand me-2" href="/favorite">
      <img
        src="https://i.imgur.com/lvcGbQi.png"
        height="36"
        alt="GG Logo"
        loading="lazy"
       
      />
    </a>
    <a class="navbar-brand me-2" href="/profile">
      <img
        src=" https://i.imgur.com/egDdRr4.png"
        height="36"
        alt="GG Logo"
        loading="lazy"
       
      />
    </a>

    {isLoggedIn ? <LogoutButton/> : null}
        
      
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}

export {Header};