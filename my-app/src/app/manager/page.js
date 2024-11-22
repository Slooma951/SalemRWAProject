"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [orderStats, setOrderStats] = useState(null); // To hold order statistics
    const [statsLoading, setStatsLoading] = useState(true); // Separate loading for stats
    const router = useRouter();

    useEffect(() => {
        const verifyManager = async () => {
            const userId = localStorage.getItem("userId");

            if (!userId) {
                alert("You must log in as a manager to access this page.");
                router.push("/login");
                return;
            }

            try {
                const response = await fetch(`/api/auth/user?userId=${userId}`);
                const data = await response.json();

                if (response.ok && data.role === "manager") {
                    setIsAuthorized(true);
                } else {
                    alert("You are not authorized to access this page.");
                    router.push("/login");
                }
            } catch (error) {
                console.error("Authorization error:", error);
                alert("An error occurred while verifying your access.");
                router.push("/login");
            }
        };

        verifyManager();
    }, [router]);

    useEffect(() => {
        if (!isAuthorized) return;

        const fetchOrderStats = async () => {
            try {
                const response = await fetch(`/api/orders?isManager=true`); // Correct endpoint for stats
                const data = await response.json();

                if (response.ok) {
                    setOrderStats(data);
                } else {
                    console.error(data.message || "Failed to fetch order statistics.");
                }
            } catch (error) {
                console.error("Error fetching order statistics:", error);
            } finally {
                setStatsLoading(false);
            }
        };

        fetchOrderStats();
    }, [isAuthorized]);

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

    if (!isAuthorized) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Verifying access...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{ mb: 2, fontFamily: "Roboto, sans-serif" }}>
                Manager Dashboard
            </Typography>

            {/* Order Statistics Section */}
            {statsLoading ? (
                <CircularProgress size={24} sx={{ mb: 4 }} />
            ) : orderStats ? (
                <Box sx={{ mb: 4, p: 2, border: "1px solid #ddd", borderRadius: "8px" }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Order Statistics
                    </Typography>
                    <Typography variant="body1">
                        <strong>Total Orders:</strong> {orderStats.totalOrders}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Total Revenue:</strong> €{orderStats.totalRevenue.toFixed(2)}
                    </Typography>
                </Box>
            ) : (
                <Typography variant="body1" color="error">
                    Failed to load order statistics.
                </Typography>
            )}

            {/* Add Product Form */}
            <Typography variant="h5" sx={{ mb: 2 }}>
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
