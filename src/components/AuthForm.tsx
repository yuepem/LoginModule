"use client";

import { useState, useEffect, FormEvent } from "react";

interface AuthFormProps {
  mode: "Login" | "Sign up";
  onSubmit: (data: { email: string; password: string }) => void;
  resetForm?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit, resetForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (resetForm) {
      setEmail("");
      setPassword("");
    }
  }, [resetForm]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 ">
      <h2 className="text-2xl font-bold mb-4 text-center">{mode}</h2>
      <div>
        <label className="block text-gray-700 dark:text-gray-300">Email</label>
        <input
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-300">Password</label>
        <input
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
     <button
        type="submit"
        className="w-full py-2 bg-stone-800 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >{mode}
     </button>
    </form>
  );
};

export default AuthForm;
