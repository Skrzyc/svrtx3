import { useEffect } from "react";

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy";
  }, []);

  return (
    <div className="bg-bg2 w-full h-auto py-12 px-4 min-h-screen flex flex-col gap-4">
      <h2 className="text-2xl font-bold font-heading uppercase">
        Privacy Policy
      </h2>
      <h3 className="font-base text-lg"> Lorem Ipsum </h3>
      <h3 className="font-details text-lg"> Lorem Ipsum </h3>
    </div>
  );
}
