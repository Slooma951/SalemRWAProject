"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function ManagerPage() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [allOrders, setAllOrders] = useState([]);
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

        const fetchOrders = async () => {
            try {
                const response = await fetch(`/api/orders?isManager=true`);
                const data = await response.json();

                if (response.ok) {
                    setAllOrders(data.orders || []);
                } else {
                    console.error(data.message || "Failed to fetch orders.");
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, [isAuthorized]);

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

            {/* All Orders Section */}
            <Typography variant="h5" sx={{ mb: 2 }}>
                All Orders
            </Typography>
            {allOrders.length > 0 ? (
                <Box sx={{ mb: 4, p: 2, border: "1px solid #ddd", borderRadius: "8px" }}>
                    {allOrders.map((order, idx) => (
                        <Box key={order._id} sx={{ mb: 2 }}>
                            <Typography variant="h6">
                                <strong>Order ID:</strong> {order._id} - <strong>Placed By:</strong> {order.username} ({order.email})
                            </Typography>
                            <Typography variant="body2">
                                <strong>Order Time:</strong> {new Date(order.createdAt).toLocaleString()}
                            </Typography>
                            <ul>
                                {order.items.map((item, itemIdx) => (
                                    <li key={itemIdx}>
                                        {item.name} - €{Number(item.price).toFixed(2)} x {item.quantity}
                                    </li>
                                ))}
                            </ul>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Typography>No orders found.</Typography>
            )}
        </Container>
    );
}