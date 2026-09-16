/**
 * Display Health Points
 */
export const HealthPoints = ({ hpCount }: { hpCount: number }) => {
  return (
    <div className="absolute z-50 top-2 left-2 flex justify-center items-center w-auto">
      <div className="flex flex-row justify-center items-end gap-2">
        <div className="w-10 h-10">
          <img src="/src/assets/heart.png" />
        </div>
        <p className="font-heading text-2xl sm:text-5xl text-accent2 blackTextShadowBig">
          {hpCount}
        </p>
      </div>
    </div>
  );
};
