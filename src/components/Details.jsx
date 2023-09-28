/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Details = ({ isLoggedIn, addFavorite, removeFavorite, favorites }) => {
  const [singlePair, setSinglePair] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    fetch(`/v1/${id}`)
      .then((response) => response.json())
      .then((response) => {
        setSinglePair(response);
      })
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last</th>
            <th>High</th>
            <th>Low</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(singlePair)].map((pair) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{pair.last_price}</td>
              <td>{pair.high}</td>
              <td>{pair.low}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {isLoggedIn &&
        (favorites.includes(id) ? (
          <button onClick={() => removeFavorite(id)}>
            Remove from favorites
          </button>
        ) : (
          <button onClick={() => addFavorite(id)}>Add to favorites</button>
        ))}
    </>
  );
};

export default Details;
