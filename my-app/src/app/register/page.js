"use client";
import { useState } from 'react';
import { Box, Button, TextField, Typography, Container, CircularProgress, Link } from '@mui/material';

export default function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateFields = () => {
        let tempErrors = {};
        if (!formData.firstName) tempErrors.firstName = 'First Name is required';
        if (!formData.lastName) tempErrors.lastName = 'Last Name is required';
        if (!formData.username) tempErrors.username = 'Username is required';
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'Valid Email is required';
        if (!formData.password || formData.password.length < 6) tempErrors.password = 'Password must be at least 6 characters';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        if (!validateFields()) return;

        setLoading(true);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();

            if (response.ok) {
                setMessage('Registration successful');
                setFormData({
                    firstName: '',
                    lastName: '',
                    username: '',
                    email: '',
                    password: ''
                });
            } else {
                setErrors(result.errors || {});
                setMessage(result.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error in registration:', error);
            setMessage('Server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Typography variant="h4" sx={{ mb: 2, fontFamily: 'Roboto, sans-serif', color: '#333' }}>Sign Up</Typography>
            <Box component="form" onSubmit={handleSubmit}>
                {['firstName', 'lastName', 'username', 'email', 'password'].map((field) => (
                    <TextField
                        key={field}
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        name={field}
                        type={field === 'password' ? 'password' : 'text'}
                        value={formData[field]}
                        onChange={handleChange}
                        error={Boolean(errors[field])}
                        helperText={errors[field] || ''}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{ style: { color: '#6c757d' } }}
                        inputProps={{ style: { fontFamily: 'Roboto, sans-serif' } }}
                        FormHelperTextProps={{ style: { fontFamily: 'Roboto, sans-serif', color: 'red' } }}
                    />
                ))}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        mt: 2,
                        backgroundColor: '#4caf50',
                        color: 'white',
                        fontFamily: 'Roboto, sans-serif',
                        '&:hover': { backgroundColor: '#45a049' }
                    }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Register'}
                </Button>
                {message && (
                    <Typography variant="body2" sx={{ mt: 2, color: message.includes('successful') ? 'green' : 'red' }}>
                        {message}
                    </Typography>
                )}
                <Link href="/login" sx={{ display: 'block', mt: 2, color: '#6c757d', textAlign: 'center', fontFamily: 'Roboto, sans-serif', textDecoration: 'underline' }}>
                    Already have an account? Log in
                </Link>
            </Box>
        </Container>
    );
}
