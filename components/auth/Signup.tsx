import React, { useState } from "react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import app, { db } from "../../firebase";

const initialState = {
  email: "",
  password: "",
  confirmPassword: "",
};

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email: string;
    password: string;
    confirmPassword: string;
  }>(initialState);
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors({ ...errors, email: "" });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrors({ ...errors, password: "" });
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    setErrors({ ...errors, confirmPassword: "" });
  };

  const validateForm = () => {
    let isValid = true;
    const updatedErrors: {
      email: string;
      password: string;
      confirmPassword: string;
    } = initialState;

    if (!email) {
      updatedErrors.email = "Email is required";
      isValid = false;
    } else {
      updatedErrors.email = "";
      isValid = true;
    }

    if (password.length < 6) {
      updatedErrors.password = "Password must be at least 6 characters";
      isValid = false;
    } else {
      updatedErrors.password = "";
      isValid = true;
    }

    if (confirmPassword.length < 6) {
      updatedErrors.confirmPassword =
        "Confirm Password must be at least 6 characters";
      isValid = false;
    } else if (password !== confirmPassword) {
      updatedErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    } else {
      updatedErrors.confirmPassword = "";
      isValid = true;
    }

    setErrors(updatedErrors);
    return isValid;
  };

  const handleSignup = () => {
    setLoading(true);
    setErrors(initialState);
    if (password !== confirmPassword) {
      setLoading(false);
      setErrors({ ...errors, password: "Passwords do not match" });
    } else
      createUserWithEmailAndPassword(auth, email, password)
        .then(async () => {
          await addDoc(collection(db, "users"), {
            email,
            admin: false,
          });
          setLoading(false);
        })
        .catch((error) => {
          let errorMessage = error.errorMessage;
          const { code } = error;
          if (code === "auth/invalid-email") errorMessage = "Email incorrect";
          else errorMessage = error?.message;
          setErrors({ ...errors, email: errorMessage });
          console.log({ error });
          setLoading(false);
        });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("validatyion", validateForm());
    if (validateForm()) {
      handleSignup();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className={`mt-1 p-2 w-full border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-md`}
            value={email}
            onChange={handleEmailChange}
          />
          {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className={`mt-1 p-2 w-full border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-md`}
            value={password}
            onChange={handlePasswordChange}
          />
          {errors.password && (
            <p className="text-red-500 mt-1">{errors.password}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className={`mt-1 p-2 w-full border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } rounded-md`}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 mt-1">{errors.confirmPassword}</p>
          )}
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            disabled={loading}
          >
            {loading ? "Please wait..." : "Signup"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
