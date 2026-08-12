import { Link, Route, Routes } from "react-router-dom";
import { useState } from "react";
import MainLayout from "./layouts/MainLayout";
import MyPageLayout from "./layouts/MyPageLayout";
import PublicProfileLayout from "./layouts/PublicProfileLayout";

import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Portfolio from "./pages/Portfolio";
import PortfolioEditor from "./pages/PortfolioEditor";
import Profile from "./pages/Profile";
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import MyProjects from "./pages/MyProjects";
import Collections from "./pages/Collections";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/gallery" element={<Gallery />} />
        <Route path="/portfolios/new" element={<PortfolioEditor />} />
        <Route path="/portfolios/:id" element={<Portfolio />} />
        <Route path="/portfolios/:id/edit" element={<PortfolioEditor />} />
        {/* MyPage */}
        <Route path="/mypage" element={<MyPageLayout />}>
          <Route index element={<Profile mode="mypage" />} />
          <Route path="projects" element={<MyProjects mode="mypage" />} />
          <Route path="collections" element={<Collections />} />
          <Route path="collections/:collectionId" element={<MyProjects mode="collection" />} />
        </Route>
        {/* Public Profile */}
        <Route path="/profiles/:userId" element={<PublicProfileLayout />}>
          <Route index element={<MyProjects mode="public" />} />
        </Route>
        {/* 테스트용 임시 라우트 */}
        <Route path="/test/collections/:userId" element={<Collections />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
