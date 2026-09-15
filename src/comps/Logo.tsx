import { settings } from "../global/settings";

export function Logo() {
  return (
    <div>
      <p className="hugeHeading">{settings.gameName}</p>
    </div>
  );
}
