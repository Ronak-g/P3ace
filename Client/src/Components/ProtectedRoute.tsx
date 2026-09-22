import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { refreshSession } from "../Api/authApi";

export default function ProtectedRoute() {
  const [status, setStatus] = useState<"checking" | "authed" | "unauthed">(
    "checking",
  );

  useEffect(() => {
    refreshSession()
      .then(() => setStatus("authed"))
      .catch(() => setStatus("unauthed"));
  }, []);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0f14]">
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    );
  }

  if (status === "unauthed") return <Navigate to="/login" replace />;

  return <Outlet />;
}
