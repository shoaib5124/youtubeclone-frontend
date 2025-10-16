import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import styles from "./Dashboard.module.css";
import LoadingScreen from "../../LoadingScreen"



const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const handleLogout = () => {
    setLoggingOut(true); // show spinner first

    setTimeout(() => {
      // remove login data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // then redirect
      navigate("/", { replace: true });

      setLoggingOut(false);
    }, 800); // wait 0.8 sec for smooth transition
  }
if (loggingOut) return <LoadingScreen />;


  return (
    <div className={styles.dashboardWrapper}>
      {/* ✅ Topbar for mobile */}
      <div className={styles.topbar}>
        <button
          className={styles.menuBtn}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <h2 className={styles.logoText}>Dashboard</h2>
      </div>

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${
          isSidebarOpen ? styles.sidebarOpen : ""
        }`}
      >
        <div className={styles.profileSection}>
          <img
            src={user.logoUrl}
            alt="Profile"
            className={styles.profileImg}
          />
          <h3 className={styles.profileName}>
            {user.channelName || "User"}
          </h3>
          <p className={styles.profileEmail}>{user.email}</p>
        </div>

        <nav className={styles.nav}>
          <Link
            to="Home"
            className={styles.navLink}
            onClick={() => setIsSidebarOpen(false)}
          >
            Home
          </Link>
          <Link
            to="MyVideos"
            className={styles.navLink}
            onClick={() => setIsSidebarOpen(false)}
          >
            My Videos
          </Link>
          <Link
            to="Upload"
            className={styles.navLink}
            onClick={() => setIsSidebarOpen(false)}
          >
            Upload Video
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setIsSidebarOpen(false);
            }}
            className={styles.logoutBtn}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
