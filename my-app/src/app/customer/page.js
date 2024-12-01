"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, Box, Button, Card, CardContent, CardMedia } from "@mui/material";

export default function CustomerPage() {
    const [username, setUsername] = useState("");
    const [products, setProducts] = useState([]);
    const [weather, setWeather] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) router.push("/login");
        setUsername(localStorage.getItem("username") || "User");
    }, [router]);

    useEffect(() => {
        fetch("/api/products?type=products")
            .then((res) => res.json())
            .then((data) => setProducts(data.products || []))
            .catch(() => console.error("Failed to load products."));
    }, []);

    useEffect(() => {
        fetch("https://api.weatherapi.com/v1/current.json?key=a5bec305169942fe99f142501242110&q=Dublin&aqi=no")
            .then((res) => res.json())
            .then((data) => setWeather(data))
            .catch(() => setWeather(null));
    }, []);

    const addToCart = (product) => {
        const userId = localStorage.getItem("userId");
        if (!userId) return router.push("/login");

        fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pname: product.name, price: product.price, userId }),
        }).catch(() => alert("Failed to add product to cart."));
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push("/login");
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{ mb: 2, color: "#007bff", textAlign: "center" }}>
                Welcome
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Button variant="contained" color="error" onClick={handleLogout}>
                    Logout
                </Button>
            </Box>
            <Box sx={{ mb: 4, textAlign: "center" }}>
                <Typography variant="h5">Current Weather in Dublin</Typography>
                {weather ? (
                    <Box sx={{ mt: 2 }}>
                        <Typography>Condition: {weather.current.condition.text}</Typography>
                        <Typography>Temperature: {weather.current.temp_c}°C</Typography>
                    </Box>
                ) : (
                    <Typography color="text.secondary">Unable to load weather data.</Typography>
                )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "16px", mb: 4 }}>
                <Button
                    variant="outlined"
                    onClick={() => router.push(`/cart?userId=${localStorage.getItem("userId")}`)}
                >
                    Cart
                </Button>
            </Box>
            <Typography variant="h4" sx={{ mb: 2, color: "#212529" }}>
                Available Products
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
                {products.length === 0 ? (
                    <Typography textAlign="center" color="text.secondary">
                        No products available at the moment.
                    </Typography>
                ) : (
                    products.map((product) => (
                        <Card key={product._id} sx={{ padding: "16px", textAlign: "center", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={product.image || "/placeholder.png"}
                                alt={product.name}
                            />
                            <CardContent>
                                <Typography variant="h5">{product.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {product.description}
                                </Typography>
                                <Typography variant="h6" sx={{ mt: 2, color: "#007bff" }}>
                                    €{Number(product.price).toFixed(2)}
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{ mt: 2, backgroundColor: "#007bff", color: "#fff" }}
                                    onClick={() => addToCart(product)}
                                >
                                    Add to Cart
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>
        </Container>
    );
}