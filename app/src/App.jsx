import { Link, Route, Routes } from "react-router-dom";
import { useState } from "react";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Portfolio from "./pages/Portfolio";
import PortfolioEditor from "./pages/PortfolioEditor";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/gallery" element={<Gallery />} />
        <Route path="/portfolios/new" element={<PortfolioEditor />} />
        <Route path="/portfolios/:id" element={<Portfolio />} />
        <Route path="/portfolios/:id/edit" element={<PortfolioEditor />} />

        <Route path="/profiles/:userId" element={<Profile mode="public" />} />
        <Route path="/mypage" element={<Profile mode="mypage" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
