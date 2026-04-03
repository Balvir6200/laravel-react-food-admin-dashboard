import "./bootstrap";
import "../css/app.css";
import React from "react";
import ReactDOM from "react-dom/client";

import Dashboard from "./Pages/Dashboard";
import Restaurants from "./Pages/Restaurants/Index";
import Customers from "./Pages/Customers";
import Orders from "./Pages/Orders";

const dashboardRoot = document.getElementById("dashboard-root");
const restaurantsRoot = document.getElementById("restaurants-root");
const customersRoot = document.getElementById("customers-root");
const ordersRoot = document.getElementById("orders-root");

if (dashboardRoot) {
    const props = JSON.parse(dashboardRoot.dataset.props || "{}");
    ReactDOM.createRoot(dashboardRoot).render(<Dashboard {...props} />);
}

if (restaurantsRoot) {
    ReactDOM.createRoot(restaurantsRoot).render(<Restaurants />);
}

if (customersRoot) {
    ReactDOM.createRoot(customersRoot).render(<Customers />);
}

if (ordersRoot) {
    ReactDOM.createRoot(ordersRoot).render(<Orders />);
}