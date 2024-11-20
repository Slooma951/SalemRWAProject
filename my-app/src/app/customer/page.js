"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CircularProgress from "@mui/material/CircularProgress";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function CustomerPage() {
    const [username, setUsername] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartCount, setCartCount] = useState(0);
    const [error, setError] = useState("");
    const [weather, setWeather] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const username = localStorage.getItem("username");

        if (!userId) {
            alert("Please log in to access this page.");
            router.push("/login");
        } else {
            setUsername(username || "User");
        }
    }, [router]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch("/api/products?type=products");
                if (!response.ok) throw new Error("Failed to fetch products.");
                const data = await response.json();
                setProducts(data.products || []);
            } catch (error) {
                setError("Unable to load products. Please try again later.");
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    useEffect(() => {
        async function fetchWeather() {
            try {
                const response = await fetch(
                    `http://api.weatherapi.com/v1/current.json?key=a5bec305169942fe99f142501242110&q=Dublin&aqi=no`
                );
                if (!response.ok) throw new Error("Failed to fetch weather");
                const data = await response.json();
                setWeather(data);
            } catch (error) {
                console.error("Error fetching weather:", error);
                setWeather(null);
            }
        }
        fetchWeather();
    }, []);

    useEffect(() => {
        async function fetchCartCount() {
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) return;

                const response = await fetch(`/api/cart?type=count&userId=${userId}`);
                if (!response.ok) throw new Error("Failed to fetch cart count.");
                const data = await response.json();
                setCartCount(data.count || 0);
            } catch (error) {
                console.error("Error fetching cart count:", error);
            }
        }
        fetchCartCount();
    }, []);

    const addToCart = async (product) => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                alert("Please log in to add items to the cart.");
                router.push("/login");
                return;
            }

            const response = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pname: product.name,
                    price: product.price,
                    userId,
                }),
            });

            if (response.ok) {
                setCartCount((prev) => prev + 1);
            } else {
                const errorResponse = await response.json();
                alert(errorResponse.message || "Failed to add product to cart.");
            }
        } catch (error) {
            console.error("Error adding product to cart:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("email");

        alert("You have logged out.");
        router.push("/login");
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

    if (error) {
        return (
            <Container sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container sx={styles.container}>
            {/* Welcome Section */}
            <Typography variant="h4" sx={styles.welcomeText}>
                Welcome, {username}!
            </Typography>

            {/* Logout Button */}
            <Box sx={styles.logoutButtonContainer}>
                <Button variant="contained" color="error" onClick={handleLogout}>
                    Logout
                </Button>
            </Box>

            {/* Weather Section */}
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

            {/* Buttons Section */}
            <Box sx={styles.buttonsContainer}>
                {/* Cart Button */}
                <Badge badgeContent={cartCount} color="secondary">
                    <Button
                        variant="outlined"
                        sx={styles.cartButton}
                        onClick={() => router.push(`/cart?userId=${localStorage.getItem("userId")}`)}
                        startIcon={<ShoppingCartIcon />}
                    >
                        Cart
                    </Button>
                </Badge>

                {/* View Orders Button */}
                <Button
                    variant="outlined"
                    sx={styles.ordersButton}
                    onClick={() => router.push("/orders")}
                >
                    View Orders
                </Button>
            </Box>

            {/* Products Section */}
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
                                    €{Number(product.price).toFixed(2)}
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
    container: { mt: 4, fontFamily: "Roboto, sans-serif" },
    welcomeText: { mb: 2, fontWeight: 500, color: "#007bff", fontFamily: "Roboto, sans-serif", textAlign: "center" },
    logoutButtonContainer: { display: "flex", justifyContent: "flex-end", mb: 2 },
    buttonsContainer: { display: "flex", justifyContent: "flex-end", gap: "16px", mb: 2 },
    cartButton: { backgroundColor: "#007bff", color: "white", "&:hover": { backgroundColor: "#0056b3" } },
    ordersButton: { backgroundColor: "#28a745", color: "white", "&:hover": { backgroundColor: "#218838" } },
    heading: { mb: 2, fontWeight: 500, color: "#212529", fontFamily: "Roboto, sans-serif" },
    products: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" },
    card: {
        padding: "16px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
    },
    price: { mt: 2, color: "#007bff", fontWeight: 500 },
    addToCartButton: { mt: 2, backgroundColor: "#007bff", color: "white", "&:hover": { backgroundColor: "#0056b3" } },
    noProducts: { textAlign: "center", color: "#6c757d" },
};
