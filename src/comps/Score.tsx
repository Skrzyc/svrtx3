import { addLeadingZeros } from "../utils/utils";

/**
 * Score HUD element
 */
export const Score = ({ score }: { score: number }) => {
  const scoreFormatted = addLeadingZeros(score, 5);
  // small font if more then fight digits score
  const scoreSize =
    scoreFormatted.length <= 5 ? `text-lg sm:text-2xl` : `text-base sm:text-lg`;

  return (
    <div className="absolute z-50 top-0 right-0 justify-center items-center p-2 sm:p-4 flex flex-col gap-1">
      <p className="font-heading font-bold text-accent text-lg sm:text-2xl tracking-widest blackTextShadowBase sm:blackTextShadowBig">
        {`SCORE`}
      </p>
      <p
        className={`font-heading font-bold text-accent ${scoreSize} tracking-widest blackTextShadowBase sm:blackTextShadowBig`}
      >
        {scoreFormatted}
      </p>
    </div>
  );
};
