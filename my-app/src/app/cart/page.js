"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const userId = localStorage.getItem("userId");

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
                    calculateTotal(data.cartItems || []);
                } else {
                    setError(data.message || "Failed to fetch cart items.");
                }
            } catch (error) {
                setError("Error fetching cart items. Please try again.");
                console.error("Error fetching cart items:", error);
            }
        }

        fetchCartItems();
    }, [router]);

    const calculateTotal = (items) => {
        const totalAmount = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
        setTotal(totalAmount.toFixed(2));
    };

    const handleQuantityChange = async (pname, newQuantity) => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            alert("Please log in to update the cart.");
            return;
        }
        if (newQuantity > 10) {
            alert("Maximum quantity allowed is 10.");
            return;
        }
        try {
            const response = await fetch(`/api/cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pname, userId, quantity: newQuantity }),
            });

            const result = await response.json();
            if (response.ok) {
                const updatedCart = cartItems.map((item) =>
                    item.pname === pname ? { ...item, quantity: newQuantity } : item
                );
                setCartItems(updatedCart);
                calculateTotal(updatedCart);
            } else {
                alert(result.message || "Failed to update quantity.");
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
            alert("Error updating quantity.");
        }
    };

    const handleRemoveFromCart = async (pname) => {
        const userId = localStorage.getItem("userId");

        try {
            const response = await fetch(`/api/cart`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pname, userId }),
            });

            const result = await response.json();
            if (response.ok) {
                const updatedCart = cartItems.filter((item) => item.pname !== pname);
                setCartItems(updatedCart);
                calculateTotal(updatedCart);
            } else {
                alert(result.message || "Failed to remove item.");
            }
        } catch (error) {
            console.error("Error removing item:", error);
            alert("Error removing item.");
        }
    };

    const handleCheckout = () => {
        router.push("/checkout");
    };

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

            {error && <Typography color="error">{error}</Typography>}
            {cartItems.length === 0 ? (
                <Typography>No items in your cart yet.</Typography>
            ) : (
                <>
                    <List>
                        {cartItems.map((item, index) => (
                            <ListItem key={index} sx={{ display: "flex", alignItems: "center" }}>
                                <ListItemText
                                    primary={item.pname}
                                    secondary={`Price: €${Number(item.price).toFixed(2)} | Subtotal: €${(
                                        Number(item.price) * item.quantity
                                    ).toFixed(2)}`}
                                />

                                <FormControl sx={{ ml: 2, minWidth: 80 }}>
                                    <Select
                                        value={item.quantity || 1} // Ensures quantity is set to 1 if undefined
                                        onChange={(e) => handleQuantityChange(item.pname, e.target.value)}
                                    >
                                        {[...Array(10).keys()].map((qty) => (
                                            <MenuItem key={qty + 1} value={qty + 1}>
                                                {qty + 1}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{ ml: 2 }}
                                    onClick={() => handleRemoveFromCart(item.pname)}
                                >
                                    Remove
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                    <Typography variant="h5" sx={{ mt: 3 }}>
                        Total: €{total}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        onClick={handleCheckout}
                    >
                        Proceed to Checkout
                    </Button>
                </>
            )}
        </Container>
    );
}
