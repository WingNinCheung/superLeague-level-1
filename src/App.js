import { useEffect, useState } from "react";
import "./index.css";
import { getDatabase, ref, set, onValue, off } from "firebase/database";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "level-1-14094.firebaseapp.com",
  databaseURL: "https://level-1-14094-default-rtdb.firebaseio.com",
  projectId: "level-1-14094",
  storageBucket: "level-1-14094.appspot.com",
  messagingSenderId: "277650364875",
  appId: "1:277650364875:web:2c6aa02762f8db24f43e4e",
  measurementId: "G-SH7GRB8ZZC",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

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
            set(ref(db, "stateClick"), newData);
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

  // get the previous clickCount & stateClick from local storage and firebase upon refresh
  useEffect(() => {
    setClickCount(parseInt(localStorage.getItem("count")) || 0);

    const stateClickRef = ref(db, "stateClick");
    onValue(stateClickRef, (snapshot) => {
      const count = snapshot.val() || {};
      setStateClick(count);
    });

    return () => {
      off(stateClickRef);
    };
  }, []);

  return (
    <div className="main">
      <h1>Super League Level 1 Challenge</h1>
      <div className="click-main">
        <div id="count-div">Click Count: {clickCount}</div>
        <button id="click-btn" onClick={handleClick}>
          Click
        </button>
      </div>
      <table className="table-main">
        <thead>
          <tr>
            <th id="table-title">Distribution of Click by State</th>
          </tr>
        </thead>
        <tbody className="table-body">
          <tr className="label">
            <td className="state">State</td>
            <td>Count</td>
          </tr>
          {Object.keys(stateClick).map((state, i) => (
            <tr key={i} className="label">
              <td>{state}</td>
              <td>{stateClick[state]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="footer">
        <img
          className="pic"
          alt="my-pic"
          src="https://avatars.githubusercontent.com/u/96600317?v=4"
        ></img>
        <div>
          <div className="name">Ricky Cheung</div>
          <a href="https://www.linkedin.com/in/wingnincheung/" target="popup">
            <i class="fa-brands fa-linkedin"></i>
          </a>
          <a
            href="https://github.com/WingNinCheung/superLeague-level-1"
            target="popup"
          >
            <i class="fa-brands fa-github"></i>
          </a>
          <a href="mailto:rickycheung.dev@gmail.com" className="a-links">
            <i class="fa-solid fa-envelope"></i>
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
