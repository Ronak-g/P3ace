import { useNavigate } from "react-router";
import { logoutUser } from "../Api/authApi";

export default function Page() {
  const navigate = useNavigate();
  const logout = async () => {
    await logoutUser()
    navigate('/')
  }
  return (

    //placeholder till actual code comes
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center flex-col gap-4">
      {" "}
      <h1 className="text-5xl font-bold text-white"> Dashboard </h1>{" "}
      <button className=" bg-white rounded px-8 py-2" onClick={() => navigate('/')}>Landing</button>
      <button className=" bg-white rounded px-8 py-2" onClick={() => logout()}>Log Out</button>

    </main>
  );
}
