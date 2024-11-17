"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CircularProgress from "@mui/material/CircularProgress";

export default function CustomerPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState(null);
    const [cart, setCart] = useState([]);

    // Fetch products from the API
    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch("/api/customer");
                if (!response.ok) throw new Error("Failed to fetch products");
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    // Fetch weather information using WeatherAPI
    useEffect(() => {
        async function fetchWeather() {
            try {
                const response = await fetch(
                    `http://api.weatherapi.com/v1/current.json?key=a5bec305169942fe99f142501242110&q=Dublin&aqi=no`
                );
                if (!response.ok) throw new Error("Failed to fetch weather");
                const data = await response.json();
                console.log("Weather data:", data); // For debugging
                setWeather(data);
            } catch (error) {
                console.error("Error fetching weather:", error);
                setWeather(null); // Set to null to avoid breaking UI
            }
        }
        fetchWeather();
    }, []);

    // Add product to cart
    const addToCart = (product) => {
        setCart((prevCart) => [...prevCart, product]);
    };

    if (loading) {
        return (
            <Container sx={{ textAlign: "center", mt: 4 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading products...
                </Typography>
            </Container>
        );
    }

    return (
        <Container sx={styles.container}>
            {weather ? (
                weather.location && weather.current && (
                    <Box sx={styles.weather}>
                        <Typography variant="h6">
                            Weather in {weather.location.name}: {weather.current.temp_c}°C,{" "}
                            {weather.current.condition.text}
                        </Typography>
                    </Box>
                )
            ) : (
                <Typography variant="body1" sx={{ color: "red" }}>
                    Weather data unavailable.
                </Typography>
            )}
            <Typography variant="h4" sx={styles.heading}>
                Available Products
            </Typography>
            <Box sx={styles.products}>
                {products.length === 0 ? (
                    <Typography variant="h6" sx={styles.noProducts}>
                        No products available at the moment.
                    </Typography>
                ) : (
                    products.map((product) => (
                        <Card key={product._id} sx={styles.card}>
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
                                <Typography variant="h6" sx={styles.price}>
                                    €{product.price.toFixed(2)}
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={styles.addToCartButton}
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

const styles = {
    container: {
        mt: 4,
        fontFamily: "Roboto, sans-serif",
    },
    weather: {
        mb: 4,
        padding: "16px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
    },
    heading: {
        mb: 2,
        fontWeight: 500,
        color: "#212529",
        fontFamily: "Roboto, sans-serif",
    },
    products: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "16px",
    },
    card: {
        padding: "16px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
    },
    price: {
        mt: 2,
        color: "#007bff",
        fontWeight: 500,
    },
    addToCartButton: {
        mt: 2,
        backgroundColor: "#007bff",
        color: "white",
        "&:hover": {
            backgroundColor: "#0056b3",
        },
    },
    noProducts: {
        textAlign: "center",
        color: "#6c757d",
    },
};
