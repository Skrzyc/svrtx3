import { BrowserRouter, Route, Routes } from "react-router";
import { AppRoutes } from "./global/AppRoutes";
import NotFound from "./pages/404";
import { Error } from "./pages/Error";
import { Game } from "./pages/Game";
import Home from "./pages/Home";
import { LevelSelect } from "./pages/LevelSelect";
import { Loading } from "./pages/Loading";
import Privacy from "./pages/Privacy";
import logger from "./utils/logger";

function App() {
  logger.log("App : reloaded");

  return (
    <BrowserRouter>
      <Routes>
        <Route path={AppRoutes.home} element={<Home />} />
        <Route path={AppRoutes.levelSelect} element={<LevelSelect />} />
        <Route path={AppRoutes.loading} element={<Loading />} />
        <Route path={AppRoutes.game} element={<Game />} />
        <Route path={AppRoutes.privacy} element={<Privacy />} />
        <Route path={AppRoutes.error} element={<Error />} />
        <Route path={AppRoutes.notFoundWildcard} element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
