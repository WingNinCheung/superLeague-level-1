import { useEffect, useState } from "react";

function App() {
  // initialize the clickCount state
  const [clickCount, setClickCount] = useState(0);

  // handle click event and update clickCount by 1 and set it in local storage
  const handleClick = (e) => {
    e.preventDefault();
    const newCount = clickCount + 1;
    setClickCount(newCount);
    localStorage.setItem("count", newCount);
  };

  // get the previous clickCount from local storage upon refresh
  useEffect(() => {
    setClickCount(parseInt(localStorage.getItem("count")) || 0);
  }, []);

  return (
    <div>
      <div>Click Count: {clickCount}</div>
      <button onClick={handleClick}>Click</button>
    </div>
  );
}

export default App;
