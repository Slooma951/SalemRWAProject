"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

        if (!userId) {
            alert("Please log in to view your cart.");
            router.push("/login");
            return;
        }

        async function fetchCartItems() {
            try {
                const response = await fetch(`/api/cart?userId=${userId}`);
                const data = await response.json();

                if (response.ok) {
                    setCartItems(data.cartItems || []);
                } else {
                    setError(data.message || "Failed to fetch cart items.");
                }
            } catch (error) {
                setError("Error fetching cart items. Please try again.");
                console.error("Error fetching cart items:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchCartItems();
    }, [router]);

    return (
        <Container>
            <Button
                variant="outlined"
                onClick={() => router.push("/customer")}
                sx={{ mb: 2 }}
            >
                Back to Products
            </Button>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Your Cart
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : cartItems.length === 0 ? (
                <Typography>No items in your cart yet.</Typography>
            ) : (
                <List>
                    {cartItems.map((item, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={item.pname}
                                secondary={`Price: €${Number(item.price).toFixed(2)}`}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Container>
    );
}
