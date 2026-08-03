import { Link, Route, Routes } from "react-router-dom";
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
    <>
      <Link to="/">Portfolio+</Link>

      <Link to="/">Home</Link>
      <Link to="/gallery">Explore</Link>
      <Link to="/portfolios/new">Upload</Link>
      <Link to="/mypage">MyPage</Link>

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/gallery" element={<Gallery />} />
          <Route path="/portfolios/new" element={<PortfolioEditor mode="create" />} />
          <Route path="/portfolios/:id" element={<Portfolio />} />
          <Route path="/portfolios/:id/edit" element={<PortfolioEditor mode="edit" />} />

          <Route path="/profiles/:userId" element={<Profile mode="public" />} />
          <Route path="/mypage" element={<Profile mode="mypage" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
