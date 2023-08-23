import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const AuthContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab("login")}
              className={`py-2 px-4 text-sm ${
                activeTab === "login"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`py-2 px-4 text-sm ml-2 ${
                activeTab === "signup"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600"
              }`}
            >
              Signup
            </button>
          </div>
        </div>
        {activeTab === "login" ? <Login /> : <Signup />}
      </div>
    </div>
  );
};

export default AuthContainer;
