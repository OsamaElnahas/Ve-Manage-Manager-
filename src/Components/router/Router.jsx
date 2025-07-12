import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../Layout/Layout";
import Drivers from "../Drivers/Drivers";
import Dashboard from "../Dashboard/Dashboard";
import Login from "../Login/Login";
import ResetPassword from "../Forget-reset-password/ResetPassword";
import ForgetPassword from "../Forget-reset-password/ForgetPassword";
import Mechans from "../Mechanics/Mechanics";
import NotFound from "../NotFound/NotFound";
import Vehicles from "../Vehicles/Vehicles";
import Model from "../Vehicles/Model";
import Category from "../Vehicles/Category";
import Profile from "../Profile/Profile";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import VehiclesProfile from "../Vehicles/VehiclesProfile";
import DriverProfile from "../Drivers/DriverProfile";
import MechanicsProfile from "../Mechanics/MechanicsProfile";
import Trips from "../Trips/Trips";
import DriversReports from "../DriversReports/DriversReports";
import MechanicsReports from "../MechanicsReports/MechanicsReports";
import TripDetails from "../Trips/TripDetails";
import AssignTrip from "../Trips/AssignTrip";
import MaintenanceCard from "../Maintience/MaintenanceCard";
import MaintenanceHistory from "../Maintience/MaintenanceHistory";
import TripsHistory from "../DriversReports/TripsHistory";
import MechanicHistory from "../MechanicsReports/MechanicHistory";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "/Overview", element: <Dashboard /> },
          { path: "/users/drivers", element: <Drivers /> },
          { path: "/users/mechanics", element: <Mechans /> },
          { path: "/vehicles", element: <Vehicles /> },
          { path: "/vehicles/model", element: <Model /> },
          { path: "/vehicles/categories", element: <Category /> },
          {
            path: "vehicles/VehiclesProfile/:id",
            element: <VehiclesProfile />,
          },
          { path: "/driverProfile/:id", element: <DriverProfile /> },
          { path: "/mechanicProfile/:id", element: <MechanicsProfile /> },
          { path: "/trips", element: <Trips /> },
          { path: "/trips/:id", element: <TripDetails /> },
          { path: "/trips/add", element: <AssignTrip /> },
          { path: "/reports/drivers", element: <DriversReports /> },
          { path: "/reports/mechanics", element: <MechanicsReports /> },
          { path: "/maintience", element: <MaintenanceCard /> },
          { path: "/maintience/history", element: <MaintenanceHistory /> },
          { path: "/reports/drivers/history", element: <TripsHistory /> },
          { path: "/reports/mechanics/history", element: <MechanicHistory /> },
        ],
      },
    ],
  },
  { path: "login", element: <Login /> },
  { path: "ResetPassword", element: <ResetPassword /> },
  { path: "ForgetPassword", element: <ForgetPassword /> },
  { path: "*", element: <NotFound /> },
]);

export default Router;
