import { BrowserRouter, Route, Routes } from "react-router";
import { AppRoutes } from "./global/AppRoutes";
import NotFound from "./pages/404";
import Home from "./pages/Home";
import Privacy from "./pages/Privacy";
import logger from "./utils/logger";

const isDev = import.meta.env.DEV;

function App() {
  logger.log("App : reloaded");

  return (
    <BrowserRouter>
      <Routes>
        <Route path={AppRoutes.home} element={<Home />} />
        <Route path={AppRoutes.privacy} element={<Privacy />} />
        {isDev ? (
          <Route path={AppRoutes.notFound} element={<NotFound />} />
        ) : null}
        <Route path={AppRoutes.notFoundWildcard} element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
