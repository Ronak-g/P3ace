import { BrowserRouter, Routes, Route } from "react-router";
import Landing from "./Pages/Landing.tsx";
import Login from "./Pages/Login.tsx";
import Page from "./Pages/Page.tsx";
import Register from "./Pages/Register.tsx";
import TasksPage from "./Pages/Tasks.tsx";
import Ai from "./Pages/Ai.tsx";
import ProtectedRoute from "./Components/ProtectedRoute.tsx";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/page" element={<Page />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/ai" element={<Ai />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
