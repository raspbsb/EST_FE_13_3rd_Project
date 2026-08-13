import { Route, Routes } from "react-router-dom";
import SeoMeta, { SITE_NAME } from "./components/SeoMeta";
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
import Collections from "./pages/Collections";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <>
              <SeoMeta
                title={`${SITE_NAME} | Home`}
                description="Create your portfolio and explore other projects."
                path="/"
              />
              <Home />
            </>
          }
        />

        <Route
          path="/gallery"
          element={
            <>
              <SeoMeta
                title={`Gallery | ${SITE_NAME}`}
                description="Browse public portfolios and projects."
                path="/gallery"
              />
              <Gallery />
            </>
          }
        />
        <Route path="/portfolios/new" element={<PortfolioEditor />} />
        <Route path="/portfolios/:id" element={<Portfolio />} />
        <Route path="/portfolios/:id/edit" element={<PortfolioEditor />} />
        {/* MyPage */}
        <Route path="/mypage" element={<MyPageLayout />}>
          <Route index element={<Profile mode="mypage" />} />
          <Route path="projects" element={<MyProjects mode="mypage" />} />
          <Route path="collections" element={<Collections />} />
        </Route>
        {/* Public Profile */}
        <Route path="/profiles/:userId" element={<PublicProfileLayout />}>
          <Route index element={<MyProjects mode="public" />} />
        </Route>

        <Route
          path="/login"
          element={
            <>
              <SeoMeta title={`Login | ${SITE_NAME}`} description="Log in to Portfolio+." path="/login" noindex />
              <Login />
            </>
          }
        />
        <Route
          path="/signup"
          element={
            <>
              <SeoMeta
                title={`Sign Up | ${SITE_NAME}`}
                description="Create a Portfolio+ account."
                path="/signup"
                noindex
              />
              <Signup />
            </>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
