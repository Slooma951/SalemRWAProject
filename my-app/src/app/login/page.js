"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link"; // Import Material-UI Link component
import Box from "@mui/material/Box"; // For layout

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    // Redirect to customer page if already logged in
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            router.push("/customer");
        }
    }, [router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("userId", data.user.id);
                localStorage.setItem("username", data.user.username);
                localStorage.setItem("email", data.user.email);
                router.push("/customer");
            } else {
                setError(data.message || "Invalid credentials.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" align="center" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    name="username"
                    fullWidth
                    margin="normal"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                {error && (
                    <Typography color="error" align="center">
                        {error}
                    </Typography>
                )}
                <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
                    Login
                </Button>
            </form>

            {/* Sign Up Link */}
            <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="body2">
                    Don't have an account?{" "}
                    <Link href="/register" underline="hover" color="primary">
                        Sign up
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
}
