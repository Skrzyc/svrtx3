import { version } from "../../package.json";

export const VersionTag = () => {
  return (
    <div className="bg-black flex justify-center align-center pl-2 pr-3 py-2 rounded-tr-2xl">
      <p className="font-heading text-base text-accent"> {`v.${version}`} </p>
    </div>
  );
};
