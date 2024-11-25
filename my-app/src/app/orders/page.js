"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            alert("Please log in to view your orders.");
            router.push("/login");
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch(`/api/orders?userId=${userId}`);
                const data = await response.json();

                if (response.ok) {
                    setOrders(data.orders || []);
                } else {
                    console.error(data.message || "Failed to fetch orders.");
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [router]);

    if (loading) {
        return (
            <Container sx={{ textAlign: "center", mt: 4 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading orders...
                </Typography>
            </Container>
        );
    }

    if (orders.length === 0) {
        return (
            <Container sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6" color="text.secondary">
                    No orders found for this user.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                    onClick={() => router.push("/customer")}
                >
                    Go to Customer Page
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Your Orders
            </Typography>
            <List>
                {orders.map((order) => (
                    <ListItem
                        key={order._id}
                        sx={{
                            mb: 2,
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "16px",
                        }}
                    >
                        <ListItemText
                            primary={`Order #${order._id}`}
                            secondary={
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="body2" component="div">
                                        <strong>Status:</strong> {order.status}
                                    </Typography>
                                    <Typography variant="body2" component="div">
                                        <strong>Items:</strong>{" "}
                                        {order.items
                                            .map((item) => `${item.pname} (x${item.quantity})`)
                                            .join(", ")}
                                    </Typography>
                                    <Typography variant="body2" component="div">
                                        <strong>Total:</strong> €{" "}
                                        {order.items
                                            .reduce(
                                                (sum, item) => sum + item.price * item.quantity,
                                                0
                                            )
                                            .toFixed(2)}
                                    </Typography>
                                </Box>
                            }
                        />
                    </ListItem>
                ))}
            </List>
            <Box sx={{ textAlign: "center", mt: 4 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push("/customer")}
                >
                    Go to Customer Page
                </Button>
            </Box>
        </Container>
    );
}
