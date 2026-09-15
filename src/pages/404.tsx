import { useEffect } from "react";
import { settings } from "../global/settings";

export default function NotFound() {
  useEffect(() => {
    document.title = `${settings.gameNameShort} | Not Found`;
  }, []);

  return (
    <div className="bg-bg w-full min-h-screen flex flex-col gap-4 justify-center items-center relative bg-[url('/src/assets/night-sky.png')] bg-center bg-no-repeat">
      <p className="hugeHeading">404 | Not Found</p>
    </div>
  );
}
