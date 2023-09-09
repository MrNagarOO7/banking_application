// src/App.tsx
import React from "react";
import TransactionList from "../components/TransactionList";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../components/Header";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const userDetails = useSelector((state: any) => state.user.userDetails);
  const userName =
    `${userDetails.firstName} ${userDetails.lastName}`.toUpperCase();
  const balance = userDetails.balance || 0;
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    // Implement logout functionality here
    console.log("Logout clicked");
  };
  return (
    <div className="dashboard">
      <Header balance={balance} username={userName} onLogout={handleLogout} />
      <TransactionList userDetails={userDetails} />
    </div>
  );
};

export default Dashboard;
