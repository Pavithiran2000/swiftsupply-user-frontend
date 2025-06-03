import React from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@mui/material";

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top bar */}
      <div className="bg-white shadow px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="SwiftSupply Logo" className="h-10" />
          <span className="font-bold text-2xl text-maroon">SwiftSupply</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-700">
            Hi, {user?.first_name} {user?.last_name}
          </span>
          <Button
            variant="contained"
            color="primary"
            onClick={logout}
            sx={{
              backgroundColor: "#7b0a24",
              borderRadius: "10px",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#63051c" },
            }}
          >
            Logout
          </Button>
        </div>
      </div>
      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold mb-4 text-maroon">
          Welcome to your Dashboard!
        </h1>
        <div className="max-w-xl bg-white rounded-xl shadow-card p-8 mt-6">
          <p className="text-lg text-gray-800 mb-2">
            <b>Email:</b> {user?.email}
          </p>
          <p className="text-lg text-gray-800 mb-2">
            <b>Role:</b> {user?.role}
          </p>
          <p className="text-lg text-gray-800 mb-2">
            <b>Contact:</b> {user?.contact}
          </p>
          {user?.profile && (
            <div className="mt-2">
              <p className="text-md text-gray-700 font-semibold">Profile Details:</p>
              <pre className="text-sm text-gray-600 bg-gray-100 rounded p-2 mt-1">
                {JSON.stringify(user.profile, null, 2)}
              </pre>
            </div>
          )}
          <div className="mt-8">
            <span className="text-gray-600">
              (You can build out your dashboard features here!)
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
