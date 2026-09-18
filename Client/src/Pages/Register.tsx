import { useState } from "react";
import { useNavigate } from "react-router";
import { registerUser } from "../Api/authApi";
// import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name,
      email,
      password,
    };

    try {
      await registerUser(data);
      navigate("/page");
    } catch (error:any) {
      console.log(error);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0b0f14] px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121821] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>

          <p className="mt-2 text-sm text-gray-400">Register to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full rounded-lg border border-white/10 bg-[#0d131b] px-4 py-3 text-white placeholder-gray-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border border-white/10 bg-[#0d131b] px-4 py-3 text-white placeholder-gray-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-lg border border-white/10 bg-[#0d131b] px-4 py-3 text-white placeholder-gray-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-500"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already registered?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-medium text-indigo-400 transition hover:text-indigo-300"
          >
            Login
          </button>
        </p>
      </div>
    </main>
  );
}
