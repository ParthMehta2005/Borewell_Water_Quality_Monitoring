import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 style={styles.logo}>AquaRover Analytics</h2>
      <ul style={styles.navLinks}>
        <li>
          <Link to="/" style={styles.link}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/how-it-works" style={styles.link}>
            How It Works
          </Link>
        </li>
        <li>
          <Link to="/dashboard" style={styles.link}>
            Live Dashboard
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  logo: { margin: 0 },
  navLinks: {
    listStyleType: "none",
    display: "flex",
    gap: "20px",
    margin: 0,
    padding: 0,
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "16px",
  },
};

export default Navbar;
