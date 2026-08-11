import { Link, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import MyPageLayout from './layouts/MyPageLayout';

import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Portfolio from './pages/Portfolio';
import PortfolioEditor from './pages/PortfolioEditor';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import MyProjects from './pages/MyProjects';
import Collections from './pages/Collections';
import PublicProfileLayout from './layouts/PublicProfileLayout';
import MyProjectsSection from './components/mypage/MyProjectsSection';

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
          <Route path="projects" element={<MyProjects />} />
          <Route path="collections" element={<Collections />} />
        </Route>
        {/* Public Profile */}
        <Route path="/profiles/:userId" element={<PublicProfileLayout />}>
          <Route index element={<MyProjectsSection mode="public" />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
