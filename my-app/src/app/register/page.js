import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const RegisterPage = () => {
    const [form, setForm] = useState({ username: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/auth/register', form).then(response => {
            alert('Registration successful!');
        });
    };

    return (
        <Container>
            <Typography variant="h4">Register</Typography>
            <form onSubmit={handleSubmit}>
                <TextField label="Username" fullWidth value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                <TextField label="Password" type="password" fullWidth value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <Button type="submit" variant="contained">Register</Button>
            </form>
        </Container>
    );
};

export default RegisterPage;
