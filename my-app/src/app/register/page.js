"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function Register() {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    // Redirect logged-in users
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            router.push("/customer");
        }
    }, [router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setMessage("Registration successful. Redirecting to login...");
                setTimeout(() => router.push("/login"), 2000);
            } else {
                const result = await response.json();
                setError(result.message || "Registration failed");
            }
        } catch {
            setError("Server error. Please try again.");
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: "2rem", textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
                Register
            </Typography>
            <form onSubmit={handleSubmit}>
                {["username", "email", "password"].map((field) => (
                    <TextField
                        key={field}
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        name={field}
                        fullWidth
                        margin="normal"
                        type={field === "password" ? "password" : "text"}
                        value={formData[field]}
                        onChange={handleChange}
                        required
                    />
                ))}
                {error && (
                    <Typography variant="body2" color="error" style={{ marginTop: "1rem" }}>
                        {error}
                    </Typography>
                )}
                {message && (
                    <Typography variant="body2" color="primary" style={{ marginTop: "1rem" }}>
                        {message}
                    </Typography>
                )}
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Register
                </Button>
            </form>
        </Container>
    );
}
