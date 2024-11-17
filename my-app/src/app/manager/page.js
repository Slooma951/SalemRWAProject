"use client";
import * as React from "react";
import { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

export default function ManagerPage() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: "",
        price: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        // Validation
        if (!formData.name || !formData.price) {
            setMessage({ type: "error", text: "Name and Price are required." });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();

            if (response.ok) {
                setMessage({ type: "success", text: "Product added successfully!" });
                setFormData({ name: "", description: "", image: "", price: "" });
            } else {
                setMessage({ type: "error", text: result.message || "Failed to add product." });
            }
        } catch (error) {
            console.error("Error adding product:", error);
            setMessage({ type: "error", text: "An error occurred. Please try again later." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{ mb: 2, fontFamily: "Roboto, sans-serif" }}>
                Add a New Product
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                    label="Product Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                />
                <TextField
                    label="Image URL"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Price (€)"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Add Product"}
                </Button>
            </Box>
            {message.text && (
                <Alert severity={message.type} sx={{ mt: 2 }}>
                    {message.text}
                </Alert>
            )}
        </Container>
    );
}
