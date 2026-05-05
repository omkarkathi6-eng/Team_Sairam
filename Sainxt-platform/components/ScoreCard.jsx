import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";

const ScoreCard = ({ label, score = 0, color = "#3b82f6" }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center shadow-sm hover:scale-[1.02] transition-transform duration-200">
      <div className="w-35 h-35 relative flex items-center justify-center">
        <CircularProgressbarWithChildren
          value={score * 20}
          maxValue={100}
          styles={buildStyles({
            pathColor: color,
            trailColor: "#d1d5db",
          })}
        >
          <p className="text-[9px] font-medium text-gray-700 dark:text-gray-200 text-center leading-tight px-1 break-words">
            {label}
          </p>
        </CircularProgressbarWithChildren>
      </div>
      <p className="text-sm font-semibold text-gray-800 dark:text-white mt-2">
        {score.toFixed(1)}/5.0
      </p>
    </div>
  );
};

export default ScoreCard;
