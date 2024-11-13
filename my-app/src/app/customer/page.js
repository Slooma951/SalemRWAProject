'use client';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function MyApp() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [showFirstPage, setShowFirstPage] = useState(true);
    const router = useRouter();

    const handleLogin = () => {
        setIsLoggedIn(true);
        setShowFirstPage(false);
        router.push('/customer'); // Redirect to customer page
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setShowFirstPage(true);
        setShowCart(false);
        setShowCheckout(false);
        router.push('/login'); // Redirect to login page
    };

    const showCartPage = () => {
        if (isLoggedIn) {
            setShowCart(true);
            setShowCheckout(false);
        } else {
            router.push('/login'); // Redirect to login if not logged in
        }
    };

    const showCheckoutPage = () => {
        if (isLoggedIn) {
            setShowCart(false);
            setShowCheckout(true);
        } else {
            router.push('/login'); // Redirect to login if not logged in
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        MyApp
                    </Typography>
                        <>
                            <Button color="inherit" onClick={showCartPage}>Cart</Button>
                            <Button color="inherit" onClick={showCheckoutPage}>Checkout</Button>
                            <Button color="inherit" onClick={handleLogout}>Logout</Button>
                        </>

                </Toolbar>
            </AppBar>

            {showFirstPage && (
                <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
                    Welcome! Click Login to access the Customer, Cart, and Checkout pages.
                </Box>
            )}

            {isLoggedIn && showCart && (
                <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
                    This is your Cart page!
                </Box>
            )}

            {isLoggedIn && showCheckout && (
                <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
                    This is your Checkout page!
                </Box>
            )}
        </Box>
    );
}
