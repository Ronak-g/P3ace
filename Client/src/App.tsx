import { BrowserRouter, Routes, Route } from "react-router";
import Landing from "./Pages/Landing.tsx";
import Login from "./Pages/Login.tsx";
import Page from "./Pages/Page.tsx";
import Register from "./Pages/Register.tsx";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/page" element={<Page />} />
          <Route path="/register" element={<Register />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}
