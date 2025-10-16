import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Video.module.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null); // track video being edited
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyVideos();
  }, []);

  const fetchMyVideos = () => {
    const token = localStorage.getItem("token");
    axios
      .get("https://youtubeclone-production-ae8d.up.railway.app/video/own-videos", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
      setVideos(res.data.videos.reverse());
      setLoading(false)
      //  console.log(res.data.videos[2])
  })
      .catch((err) =>{
        console.error("Error fetching videos:", err)
         setLoading(false)
  });
  };

  // ✅ Delete Video
  const deleteVideo = (id) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`https://youtubeclone-production-ae8d.up.railway.app/video/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setVideos(videos.filter((v) => v._id !== id)))
      .catch((err) => console.error("Error deleting video:", err));
  };

  // ✅ Like Video
  const likeVideo = (id) => {
    const token = localStorage.getItem("token");
    axios
      .put(`https://youtubeclone-production-ae8d.up.railway.app/video/like/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => fetchMyVideos())
      .catch((err) => console.error("Error liking video:", err));
  };

  // ✅ Dislike Video
  const dislikeVideo = (id) => {
    const token = localStorage.getItem("token");
    axios
      .put(`https://youtubeclone-production-ae8d.up.railway.app/video/dislike/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => fetchMyVideos())
      .catch((err) => console.error("Error disliking video:", err));
  };

  // ✅ Start Editing
  const startEditing = (video) => {
    setEditingVideo(video._id);
    setEditTitle(video.title);
    setEditDescription(video.description);
  };

  // ✅ Save Edit
  const saveEdit = (id) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `https://youtubeclone-production-ae8d.up.railway.app/video/${id}`,
        { title: editTitle, description: editDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setEditingVideo(null);
        fetchMyVideos();
        toast.success('Updated Video Successfully')
      })
      .catch((err=>{
         console.error("Error editing video:", err)
         toast.error("Failed to save video")
        }));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>📺 My Uploaded Videos</h2>
      <div className={styles.grid}>
        {videos.map((video) => (
          <div className={styles.card} key={video._id}>
           
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className={styles.thumbnail}
              onClick={()=> navigate(`/Dashboard/Video/${video._id}`,{state:video})}
            />
            <div className={styles.details}>
              {editingVideo === video._id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className={styles.input}
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className={styles.textarea}
                  />
                  <button onClick={() => saveEdit(video._id)} className={styles.saveBtn}>
                    ✅ Save
                  </button>
                  <button onClick={() => setEditingVideo(null)} className={styles.cancelBtn}>
                    ❌ Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3 className={styles.title}>{video.title}</h3>
                  <p className={styles.channel}>{video.user_id?.channelName || "My Channel"}</p>
                  <p className={styles.meta}>
                    {video.views || 0} views • {new Date(video.createdAt).toDateString()}
                  </p>
                  <p className={styles.meta}>
                    👍 {video.likes || 0} | 👎 {video.dislikes || 0}
                  </p>
                  <div className={styles.actions}>
                    <button onClick={() => likeVideo(video._id)} className={styles.likeBtn}>
                      👍 Like
                    </button>
                    <button onClick={() => dislikeVideo(video._id)} className={styles.dislikeBtn}>
                      👎 Dislike
                    </button>
                  </div>
                  <div className={styles.actions}>
                    <button onClick={() => startEditing(video)} className={styles.editBtn}>
                      ✏️ Edit
                    </button>
                    <button onClick={() => deleteVideo(video._id)} className={styles.deleteBtn}>
                      🗑️ Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        
        {loading ? (
          <p className={styles.noVideos}>Please wait...</p>
          ) : videos.length === 0 ? (
          <p className={styles.noVideos}>No videos uploaded yet.</p>
          ) : null}

      </div>
    </div>
  );
};

export default MyVideos;
