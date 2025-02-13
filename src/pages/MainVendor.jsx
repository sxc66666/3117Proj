import React from "react";
import Navbar from "../components/Navbar";

export default function MainVendor() {
    const menuLinks = [
        { label: 'Home', href: '/' },
        {
          label: '*Username',
          children: [
            { label: 'Orders', href: '/services/web' },
            { label: 'Account', href: '/services/app' },
            { label: 'Logout', href: '/services/design' },
          ],
        }
    ];
    
    return (
        <div>
            <Navbar links={menuLinks} />
            <h1 className="text-center text-3xl font-bold mt-10">Welcome to the dashboard of vendor!</h1>
        </div>
    );
}