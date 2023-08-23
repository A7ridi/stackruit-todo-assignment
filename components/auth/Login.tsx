import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../../firebase";

const initialState = {
  email: "",
  password: "",
};

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email: string; password: string }>(
    initialState
  );
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const validateForm = () => {
    let isValid = true;
    const updatedErrors: { email: string; password: string } = initialState;

    if (!email) {
      updatedErrors.email = "Email is required";
      isValid = false;
    }

    if (password.length < 6) {
      updatedErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(updatedErrors);
    return isValid;
  };

  const logInWithEmailAndPassword = () => {
    setLoading(true);
    setErrors(initialState);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: any) => {
        const user = userCredential.user;
        console.log("user", user);
        // getUserFromFB(user);
        setLoading(false);
      })
      .catch((error: any) => {
        setLoading(false);
        console.log({ error });
        const { code } = error;
        let errorMessage = "";
        if (code === "auth/user-not-found") errorMessage = "User not found";
        else if (code === "auth/invalid-email")
          errorMessage = "Email incorrect";
        else if (code === "auth/wrong-password")
          errorMessage = "Mot de passe incorrect";
        else errorMessage = error?.message;
        setErrors({
          ...errors,
          email: errorMessage,
        });
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("====================================");
    console.log(validateForm());
    console.log("====================================");
    if (validateForm()) {
      console.log("called");
      logInWithEmailAndPassword();
    }
  };

  return (
    <div>
      <form>
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
        <div className="mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Please wait..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
