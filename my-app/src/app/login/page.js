"use client";

import React, { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoginPage() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                // Save user information (if required) and redirect
                localStorage.setItem("userId", result.user.id);
                window.location.href = "/customer"; // Redirect to the customer page
            } else {
                setError(result.message || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={styles.container}>
            <Typography variant="h4" sx={styles.heading}>
                Login
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    name="username"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    sx={styles.textField}
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    sx={styles.textField}
                />
                {error && (
                    <Typography variant="body2" color="error" sx={styles.error}>
                        {error}
                    </Typography>
                )}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={styles.button}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} sx={styles.spinner} /> : "Login"}
                </Button>
            </form>
        </Container>
    );
}

const styles = {
    container: {
        mt: 8,
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        padding: "24px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        fontFamily: "Roboto, sans-serif",
    },
    heading: {
        mb: 2,
        fontFamily: "Roboto, sans-serif",
        color: "#212529",
        fontWeight: 500,
        textAlign: "center",
    },
    textField: {
        "& .MuiInputLabel-root": { color: "#495057" },
        "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#ced4da" },
            "&:hover fieldset": { borderColor: "#495057" },
            "&.Mui-focused fieldset": { borderColor: "#007bff" },
        },
    },
    button: {
        mt: 2,
        backgroundColor: "#007bff",
        color: "white",
        fontFamily: "Roboto, sans-serif",
        "&:hover": { backgroundColor: "#0056b3" },
    },
    spinner: { color: "white" },
    error: { mt: 1, fontFamily: "Roboto, sans-serif", textAlign: "center" },
};
