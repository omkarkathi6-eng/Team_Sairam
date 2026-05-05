import { closestIndexTo } from "date-fns";

const ResultBox = ({ result, error }) => {
    if (!result && !error) return null;
  
    return (
      <div id="resultBox" style={{ color: error ? "red" : "#222" }}>
        {error ? `Error: ${error}` : String(result).split("\n").map((question,index)=><div key={index}>{question}</div>)}
        
      </div>
    );
  };
  
  export default ResultBox;
