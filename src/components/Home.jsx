/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const Home = ({ channelData, pairChannels }) => {
  const convertObjectToArray = (obj) => {
    let array = Object.values(obj);
    array.pop();
    console.log(array);
    return array;
  };

  const func = (id, arr) => {
    let final = [];

    Object.entries(arr).forEach((e) => {
      if (e[1] === id) {
        final.push(e[0]);
      }
    });

    console.log(final);

    return final;
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last</th>
            <th>Change</th>
            <th>Change Percent</th>
            <th>High</th>
            <th>Low</th>
          </tr>
        </thead>
        <tbody>
          {convertObjectToArray(channelData).map((arr) => (
            <tr key={arr.CHANNEL_ID}>
              <td>
                <Link to={`/details/${func(arr.CHANNEL_ID, pairChannels)}`}>
                  {func(arr.CHANNEL_ID, pairChannels)}
                </Link>
              </td>
              <td>{arr.LAST_PRICE}</td>
              <td>{arr.DAILY_CHANGE}</td>
              <td>{arr.DAILY_CHANGE_PERC}%</td>
              <td>{arr.HIGH}</td>
              <td>{arr.LOW}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
