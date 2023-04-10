import { useEffect, useState } from "react";
import "./index.css";

function App() {
  // initialize the clickCount state
  const [clickCount, setClickCount] = useState(0);
  const [stateClick, setStateClick] = useState({});

  // handle click event and update clickCount by 1 and set it in local storage
  const handleClick = (e) => {
    e.preventDefault();
    const newCount = clickCount + 1;
    setClickCount(newCount);
    localStorage.setItem("count", newCount);

    // handle clickers' locations
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );

        if (res.ok) {
          const data = await res.json();
          const state = data.principalSubdivision;

          // update the stateClick object by clickers' states
          setStateClick((prevData) => {
            const newData = { ...prevData };
            if (newData[state]) {
              newData[state]++;
            } else {
              newData[state] = 1;
            }
            localStorage.setItem("stateClick", JSON.stringify(newData));
            return newData;
          });
        } else {
          console.log("Error: " + res.status);
        }
      });
    } else {
      console.log("Location Not Available");
    }
  };

  // get the previous clickCount & stateClick from local storage upon refresh
  useEffect(() => {
    setClickCount(parseInt(localStorage.getItem("count")) || 0);
    setStateClick(JSON.parse(localStorage.getItem("stateClick")) || {});
  }, []);

  return (
    <div>
      <div>Click Count: {clickCount}</div>
      <button onClick={handleClick}>Click</button>
      <table>
        <thead>
          <tr>
            <th>Distribution of Clicks by States</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>State</td>
            <td>Count</td>
          </tr>
          {Object.keys(stateClick).map((state, i) => (
            <tr key={i}>
              <td>{state}</td>
              <td>{stateClick[state]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
