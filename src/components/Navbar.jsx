/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Login from "./Login";

const Navbar = ({ isLoggedIn, handleLogin }) => {
  return (
    <nav>
      <ul
        style={{
          display: "flex",
          gap: "30px",
          listStyleType: "none",
        }}
      >
        <li>
          <Link style={{ textDecoration: "none" }} to="/">
            Home
          </Link>
        </li>
        {isLoggedIn ? (
          <li>
            <Link style={{ textDecoration: "none" }} to="/favorites">
              Favorites
            </Link>
          </li>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
