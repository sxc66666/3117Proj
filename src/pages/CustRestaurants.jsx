import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CardContainerCust from "../components/CardContainerCust";
import RestaurantList from "../components/RestaurantList";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axiosInstance";  // 引入 axios
import { menuLinksCust } from "../config/navbarConfig";  // 导入 menuLinksCust

export default function CustRestaurant() {
  const [restaurants, setRestaurants] = useState([]);  // 新增状态来存储餐厅数据
  const [loading, setLoading] = useState(true);  // 用于加载状态的管理
  const navigate = useNavigate();

  useEffect(() => {
    // 请求后端 API 获取餐厅数据
    axiosInstance.get('http://localhost:5000/api/restaurants')  // 假设你的后端在 localhost:5000
      .then((response) => {
        console.log("Fetched restaurants:", response.data);  // 打印获取的餐厅数据
        setRestaurants(response.data);  // 将获取的数据存储到状态中
        setLoading(false);  // 设置加载状态为 false
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);  // 处理错误
        setLoading(false);  // 即使出错，也停止加载
      });
  }, []);  // 空依赖数组意味着这个请求只在组件挂载时触发

  // 如果数据仍在加载中，显示 loading 提示
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar links={menuLinksCust} />
      <CardContainerCust
        steps={[
          { label: 'Choose restaurant', completed: true },
          { label: 'Order food', completed: false },
          { label: 'Checkout', completed: false },
          { label: 'Complete', completed: false },
        ]}
      >
        {/* 使用从后端获取的餐厅数据 */}
        <RestaurantList
          restaurants={restaurants}
          onSelect={(restaurant) => navigate(`/cust/restaurants/${restaurant.id}`, { state: { restaurantName: restaurant.name } })}
        />
      </CardContainerCust>
    </div>
  );
}
