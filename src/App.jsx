/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Favorites from "./components/Favorites";
import Details from "./components/Details";
import Navbar from "./components/Navbar";

const mapRawPairDataToSchema = (raw) => ({
  CHANNEL_ID: raw[0],
  BID: raw[1],
  BID_SIZE: raw[2],
  ASK: raw[3],
  ASK_SIZE: raw[4],
  DAILY_CHANGE: raw[5],
  DAILY_CHANGE_PERC: raw[6],
  LAST_PRICE: raw[7],
  VOLUME: raw[8],
  HIGH: raw[9],
  LOW: raw[10],
});

const pathParams = "tickers";
const queryParams = "symbols=ALL";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [pairs, setPairs] = useState([]);
  const [pairChannels, setPairChannels] = useState({});
  const [channelData, setChannelData] = useState({});
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  // FETCH PAIRS
  useEffect(() => {
    fetch(`/api/${pathParams}?${queryParams}`)
      .then((response) => response.json())
      .then((response) => {
        setPairs(response.slice(0, 5).map((pair) => pair[0]));
      })
      .catch((err) => console.error(err));
  }, []);

  // SUBSCRIBE TO LIVE UPDATE
  useEffect(() => {
    if (!pairs.length) return;

    const ws = new WebSocket("wss://api-pub.bitfinex.com/ws");

    ws.onopen = () => {
      pairs.map((pair) => {
        ws.send(
          JSON.stringify({
            event: "subscribe",
            channel: "ticker",
            symbol: pair,
          })
        );
      });
    };

    ws.onmessage = function (event) {
      const json = JSON.parse(event.data);

      // initialization
      if (json.event === "subscribed") {
        setPairChannels((prev) => ({ ...prev, [json.pair]: json.chanId }));
        setChannelData((prev) => ({
          ...prev,
          [json.chanId]: mapRawPairDataToSchema([]),
        }));
      }

      // ignore
      if (json[1] === "hb") return;

      // update
      setChannelData((prev) => ({
        ...prev,
        [json[0]]: mapRawPairDataToSchema(json),
      }));
    };

    return () => {
      ws.close();
    };
  }, [pairs]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const addFavorite = (id) => {
    setFavorites((prev) => [...prev, id]);
  };

  const removeFavorite = (id) => {
    setFavorites(favorites.filter((f) => f !== id));
  };

  console.log(channelData);
  console.log(pairChannels);
  console.log(favorites);

  return (
    <BrowserRouter>
      <Navbar handleLogin={handleLogin} isLoggedIn={isLoggedIn} />
      <Routes>
        <Route
          path="/"
          element={
            <Home pairChannels={pairChannels} channelData={channelData} />
          }
        ></Route>
        <Route
          path="favorites"
          element={
            <Favorites
              pairChannels={pairChannels}
              channelData={channelData}
              favorites={favorites}
            />
          }
        ></Route>
        <Route
          path="details/:id"
          element={
            <Details
              isLoggedIn={isLoggedIn}
              addFavorite={addFavorite}
              removeFavorite={removeFavorite}
              favorites={favorites}
            />
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
