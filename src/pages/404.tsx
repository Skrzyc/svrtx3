import { useEffect } from "react";
import placeholder from "../assets/placeholder.png";

export default function NotFound() {
  useEffect(() => {
    document.title = "404 | Not Found";
  }, []);

  return (
    <div className="bg-bg w-full h-screen flex flex-col gap-4 justify-center items-center">
      <img src={placeholder} />
      <h2 className="font-heading text-2xl uppercase"> Not Found</h2>
      <h2 className="font-heading text-3xl uppercase"> 404</h2>
    </div>
  );
}
