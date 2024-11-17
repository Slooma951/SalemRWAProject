"use client";
import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";

export default function Register() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage("Registration successful");
                setFormData({
                    firstName: "",
                    lastName: "",
                    username: "",
                    email: "",
                    password: "",
                });
            } else {
                setError(result.message || "Registration failed");
            }
        } catch (err) {
            setError("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={styles.container}>
            <Typography variant="h4" sx={styles.heading}>
                Register
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                {["firstName", "lastName", "username", "email", "password"].map(
                    (field) => (
                        <TextField
                            key={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            type={field === "password" ? "password" : "text"}
                            value={formData[field]}
                            onChange={handleChange}
                            required
                            sx={styles.textField}
                        />
                    )
                )}
                {error && (
                    <Typography variant="body2" color="error" sx={styles.error}>
                        {error}
                    </Typography>
                )}
                {message && (
                    <Typography variant="body2" color="green" sx={styles.message}>
                        {message}
                    </Typography>
                )}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={styles.button}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} sx={styles.spinner} /> : "Register"}
                </Button>
                <Link href="/login" sx={styles.link}>
                    Already have an account? Log in
                </Link>
            </Box>
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
    message: { mt: 1, fontFamily: "Roboto, sans-serif", textAlign: "center" },
    link: {
        display: "block",
        mt: 2,
        color: "#6c757d",
        textAlign: "center",
        fontFamily: "Roboto, sans-serif",
        textDecoration: "underline",
    },
};
