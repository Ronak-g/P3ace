import { useEffect, useState } from "react";
import { logoutUser, refreshSession } from "../Api/authApi";
import { useNavigate } from "react-router";

const Loginbutton: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [text, usetext] = useState("Login");
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await refreshSession();
        setAuthenticated(true);
      } catch (error) {
        console.log(error);
        setAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated) {
      usetext("Logout");
    } else {
      usetext("Login");
    }
  }, [authenticated]);

  return (
    <>
      <button
        type="button"
        onClick={async () => {
          if (text === "Login") {
            navigate("/login");
          } else {
            await logoutUser();
            window.location.reload();
          }
        }}
        className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/[0.05] hover:text-white"
      >
        {text}
      </button>
      {navigate("/")}
    </>
  );
};

export default Loginbutton;
