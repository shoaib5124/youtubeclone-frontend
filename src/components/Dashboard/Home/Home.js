import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../LoadingScreen"


const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("https://youtubeclone-production-ae8d.up.railway.app/video/all");
        setVideos(res.data.videos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className={styles.homeContainer}>
      {/* Top section for login/signup */}
      {!user && (
        <div className={styles.authButtons}>
          <button onClick={() => navigate("/login")} className={styles.loginBtn}>
            Login
          </button>
          <button onClick={() => navigate("/signup")} className={styles.signupBtn}>
            Signup
          </button>
        </div>
      )}

      {/* Video grid */}
      <h2 className={styles.heading}>All Videos</h2>
      <div className={styles.videoGrid}>
        {videos.length > 0 ? (
          videos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              onClick={() => navigate(`/Dashboard/Video/${video._id}`, { state: video })}
            />
          ))
        ) : (
          <p className={styles.noVideos}>No videos found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;




const VideoCard = ({ video, onClick }) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.thumbnailWrapper}>
        <img src={video.thumbnailUrl} alt={video.title} className={styles.thumbnail} />
      </div>
      <div className={styles.info}>
        <img src={video.user_id?.logoUrl} alt="channel" className={styles.channelLogo} />
        <div>
          <h3 className={styles.title}>{video.title}</h3>
          <p className={styles.channelName}>{video.user_id?.channelName}</p>
          <p className={styles.meta}>{video.views} views • {video.category}</p>
        </div>
      </div>
    </div>
  );
};


