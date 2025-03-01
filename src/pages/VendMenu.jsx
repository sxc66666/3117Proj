import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";  
import axios from "axios";
import Navbar from "../components/Navbar";
import CardContainer from "../components/CardContainer";
import FoodList from "../components/FoodList";
import { menuLinksCust } from '../config/config';

export default function VendorMenu() {
    const [searchParams] = useSearchParams();
    const restaurantIdFromURL = searchParams.get("restaurant_id");
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [restaurantId, setRestaurantId] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log("📡 [DEBUG] Current user data:", user);

        if (restaurantIdFromURL) {
            console.log("📡 [DEBUG] Using restaurant_id from URL:", restaurantIdFromURL);
            setRestaurantId(restaurantIdFromURL);
        } else if (user && user.restaurant_id) {
            console.log("📡 [DEBUG] Using restaurant_id from user data:", user.restaurant_id);
            setRestaurantId(user.restaurant_id);
        } else {
            setError("Unauthorized: No restaurant ID found");
            setLoading(false);
        }
    }, [restaurantIdFromURL]);

    useEffect(() => {
        if (!restaurantId) return;

        const fetchMenu = async () => {
            try {
                console.log("📡 [DEBUG] Fetching menu for restaurant_id:", restaurantId);
                const response = await axios.get(`http://localhost:9000/api/vendor/menu?restaurant_id=${restaurantId}`);
                console.log("✅ [DEBUG] API response:", response.data);
                setMenu(response.data);
            } catch (err) {
                console.error("❌ [ERROR] Failed to load menu:", err.response);
                setError(err.response?.data?.error || "Failed to load menu");
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, [restaurantId]);

    return (
        <div>
            <Navbar links={menuLinksCust} />
            <CardContainer>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Manage Menu</h1>
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                <FoodList
                    foods={menu}
                    mode="vendor"
                    onEdit={(food) => console.log("Edit:", food)}
                    onDelete={(foodId) => setMenu(menu.filter(food => food.id !== foodId))}
                />
            </CardContainer>
        </div>
    );
}
