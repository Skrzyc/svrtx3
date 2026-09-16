import { addLeadingZeros } from "../utils/utils";

/**
 * Score HUD element
 */
export const Score = ({ score }: { score: number }) => {
  return (
    <div className="absolute z-50 top-0 right-0 justify-center items-center p-4 flex flex-col gap-1">
      <p className="font-heading font-bold text-accent text-2xl tracking-widest">
        {`SCORE`}
      </p>
      <p className="font-heading font-bold text-accent text-2xl tracking-widest">
        {`${addLeadingZeros(score, 5)}`}
      </p>
    </div>
  );
};
