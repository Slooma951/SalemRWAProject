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

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({ username: "", email: "" });
    const router = useRouter();

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            alert("Please log in to proceed.");
            router.push("/login");
            return;
        }

        async function fetchUserAndCart() {
            try {
                const userResponse = await fetch(`/api/auth/user?userId=${userId}`);
                const userData = await userResponse.json();
                if (!userResponse.ok) throw new Error(userData.message);

                setUser({ userId, username: userData.username, email: userData.email });

                const cartResponse = await fetch(`/api/cart?userId=${userId}`);
                const cartData = await cartResponse.json();
                if (!cartResponse.ok) throw new Error(cartData.message);

                setCartItems(cartData.cartItems || []);
            } catch (error) {
                console.error("Error fetching data:", error.message);
                alert(error.message || "Failed to fetch checkout details.");
                router.push("/cart");
            } finally {
                setLoading(false);
            }
        }

        fetchUserAndCart();
    }, [router]);

    const handleCheckout = async () => {
        try {
            const response = await fetch(`/api/checkout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.userId,
                    username: user.username,
                    email: user.email,
                    items: cartItems,
                    status: "completed",
                }),
            });

            if (response.ok) {
                alert("Order placed successfully!");
                router.push("/orders");
            } else {
                alert("Failed to place order.");
            }
        } catch (error) {
            console.error("Error during checkout:", error.message);
            alert("An error occurred. Please try again.");
        }
    };

    if (loading) {
        return (
            <Container sx={{ textAlign: "center", mt: 4 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading checkout details...
                </Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Checkout
            </Typography>

            <Typography variant="h6">User Details</Typography>
            <Typography>Username: {user.username}</Typography>
            <Typography>Email: {user.email}</Typography>

            <Typography variant="h6" sx={{ mt: 3 }}>
                Items in Cart
            </Typography>
            <List>
                {cartItems.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={item.pname}
                            secondary={`Price: €${item.price} | Quantity: ${item.quantity}`}
                        />
                    </ListItem>
                ))}
            </List>

            <Button variant="contained" sx={{ mt: 3, mr: 2 }} onClick={handleCheckout}>
                Place Order
            </Button>
            <Button variant="outlined" sx={{ mt: 3 }} onClick={() => router.push("/customer")}>
                Back to Products
            </Button>
        </Container>
    );
}
