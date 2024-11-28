"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, Button, List, ListItem, ListItemText } from "@mui/material";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) return router.push("/login");

        fetch(`/api/cart?userId=${userId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.cartItems) {
                    setCartItems(data.cartItems);
                    setTotal(data.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
                }
            })
            .catch(() => alert("Error fetching cart items."));
    }, [router]);

    const handleRemoveFromCart = async (pname) => {
        const userId = localStorage.getItem("userId");
        const response = await fetch(`/api/cart`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pname, userId }),
        });

        if (response.ok) {
            const updatedCart = cartItems.filter((item) => item.pname !== pname);
            setCartItems(updatedCart);
            setTotal(updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
        } else alert("Failed to remove item.");
    };

    return (
        <Container>
            <Button variant="outlined" onClick={() => router.push("/customer")} sx={{ mb: 2 }}>
                Back to Products
            </Button>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Your Cart
            </Typography>
            {cartItems.length === 0 ? (
                <Typography>No items in your cart yet.</Typography>
            ) : (
                <>
                    <List>
                        {cartItems.map((item, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={`${item.pname} (x${item.quantity})`}
                                    secondary={`Price: €${Number(item.price).toFixed(2)} | Subtotal: €${(
                                        Number(item.price) * item.quantity
                                    ).toFixed(2)}`}
                                />
                                <Button variant="contained" color="error" onClick={() => handleRemoveFromCart(item.pname)}>
                                    Remove
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                    <Typography variant="h5" sx={{ mt: 3 }}>
                        Total: €{total}
                    </Typography>
                    <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={() => router.push("/checkout")}>
                        Proceed to Checkout
                    </Button>
                </>
            )}
        </Container>
    );
}