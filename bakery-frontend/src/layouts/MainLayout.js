import React from "react";
import {Outlet} from "react-router-dom";
import {Header} from '../components/Header';
import {Footer} from '../components/Footer';

/**
 * Helps maintain the header and footer in all the pages
 * 
 * @returns Layout of the application
 */
function MainLayout() {
    return <div>
             <Header />
             <Outlet />
             <Footer />	
           </div>
 } 
 
 export {MainLayout};