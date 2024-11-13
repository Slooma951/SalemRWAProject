"use client";
/// src/app/login/page.js
import { useState } from 'react';
import {TextField, Button, Typography, Box, Container, Link} from '@mui/material';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter(); // Using the new router from next/navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.success) {
            router.push('/customer');
        } else {
            setError(data.message);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 8,
                }}
            >
                <Typography variant="h5">Login</Typography>
                <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '20px' }}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>
                    <Link href="/register" sx={{ display: 'block', mt: 2, color: '#6c757d', textAlign: 'center', fontFamily: 'Roboto, sans-serif', textDecoration: 'underline' }}>
                        Dont have an account? Sign Up
                    </Link>
                </form>
            </Box>
        </Container>
    );
}
