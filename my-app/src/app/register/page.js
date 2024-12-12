"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import validator from "email-validator";

export default function Register() {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [errorHolder, setErrorHolder] = useState("");
    const [open, setOpen] = useState(false);
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

    const validateForm = () => {
        let errorMessage = "";
        const { email, username, password } = formData;

        if (!username || username.length < 3) {
            errorMessage += "Username must be at least 3 characters long.\n";
        }
        if (!validator.validate(email)) {
            errorMessage += "Invalid email format.\n";
        }
        if (!password || password.length < 8) {
            errorMessage += "Password must be at least 8 characters long.\n";
        }
        return errorMessage;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorHolder("");
        setMessage("");

        const errorMessage = validateForm();
        if (errorMessage) {
            setErrorHolder(errorMessage);
            setOpen(true);
            return;
        }

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
                setErrorHolder(result.message || "Registration failed");
                setOpen(true);
            }
        } catch {
            setErrorHolder("Server error. Please try again.");
            setOpen(true);
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
                {message && (
                    <Typography variant="body2" color="primary" style={{ marginTop: "1rem" }}>
                        {message}
                    </Typography>
                )}
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Register
                </Button>
            </form>

            {/* Dialog for error messages */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Error</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{errorHolder}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
