// import xd from './../assets/blue-sky.png'

import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { BestScore } from "../comps/BestScore";
import { Button } from "../comps/Button";
import { DevModeTag } from "../comps/DevModeTag";
import { Logo } from "../comps/Logo";
import { VersionTag } from "../comps/VersionTag";
import { AppRoutes } from "../global/AppRoutes";
import { UrlParams } from "../global/paramKeys";
import { settings } from "../global/settings";

const isDev = import.meta.env.DEV;

export default function Home() {
  const params = new URLSearchParams(window.location.search);
  const startFromGame = params.get(UrlParams.startFromGame);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `${settings.gameNameShort} | Home`;
  }, []);

  if (startFromGame && startFromGame === "true") {
    navigate(AppRoutes.loading);
    return null;
  }

  return (
    <div className="w-full min-h-screen m-0 p-0 relative nightSkyBackground">
      {/* DEV MODE TAG */}
      {isDev && settings.displayDevModeTagInDev ? <DevModeTag /> : null}

      {/* LOGO - title*/}
      <div className="absolute top-6 left-6 sm:top-12 sm:left-12">
        <Logo />
      </div>

      {/* PLAY BUTTON */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 flex flex-col items-center justify-center">
        <Button
          props={{
            name: "PLAY",
            navLink: AppRoutes.levelSelect,
            className: `pulseScale`,
          }}
        />
      </div>

      {/* PLAYER NAME - input */}
      {/* todo */}

      {/* BEST SCORE - (if exist) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <BestScore />
      </div>

      {/* PROJECT VERSION */}
      <div className="absolute bottom-0 -left-0.5 w-auto h-auto ">
        <VersionTag />
      </div>

      {isDev ? (
        <div className="absolute bottom-20 left-0 flex flex-col gap-2">
          <Link
            to={AppRoutes.error}
            className="font-details bg-black hover:bg-accent2 text-sm p-2 text-white"
          >
            Error Page
          </Link>
          <Link
            to={`404`}
            className="font-details bg-black hover:bg-accent2 text-sm p-2 text-white"
          >
            404 | Not Found
          </Link>
        </div>
      ) : null}
    </div>
  );
}
