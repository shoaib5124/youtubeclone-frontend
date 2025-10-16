import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Video.module.css"; // same module file as MyVideos (ok)
import { toast } from "react-toastify";

const BASE_URL = "https://youtubeclone-production-ae8d.up.railway.app";

const VideoDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { videoId } = useParams();
  // support both navigate(..., { state: { video } }) and navigate(..., { state: video })
  const initialVideo = location.state?.video || location.state || null;
  const [video, setVideo] = useState(initialVideo);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [related, setRelated] = useState([]);
  const token = localStorage.getItem("token");

  // fetch video when needed
  const fetchVideo = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/video/${id}`);
      setVideo(res.data);
    } catch (err) {
      console.error("Error fetching video:", err);
      toast.error("Failed to load video");
    }
  };

  const addView = async (id) => {
    try {
      await axios.put(`${BASE_URL}/video/views/${id}`);
      setVideo((prev) => (prev ? { ...prev, views: (prev.views || 0) + 1 } : prev));
    } catch (err) {
      console.error("Error adding view:", err);
    }
  };

  const fetchComments = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/comment/comments/${id}`);
      setComments(res.data.commentList || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const postComment = async () => {
    if (!commentText.trim()) return toast.info("Write a comment first");
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(
        `${BASE_URL}/comment/new-comment/${videoId}`,
        { commentText },
        { headers }
      );
      setComments((prev) => [res.data.newComment, ...prev]);
      setCommentText("");
      toast.success("Comment posted");
    } catch (err) {
      console.error("Error posting comment:", err);
      toast.error("Failed to post comment");
    }
  };

  const startEditComment = (cmt) => {
    setEditingCommentId(cmt._id);
    setEditingText(cmt.commentText);
  };

  const saveEditComment = async (commentId) => {
    if (!editingText.trim()) return toast.info("Comment can't be empty");
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.put(`${BASE_URL}/comment/${commentId}`, { commentText: editingText }, { headers });
      setComments((prev) => prev.map((c) => (c._id === commentId ? res.data.updatedComment : c)));
      setEditingCommentId(null);
      setEditingText("");
      toast.success("Comment updated");
    } catch (err) {
      console.error("Error updating comment:", err);
      toast.error("Failed to update comment");
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(`${BASE_URL}/comment/${commentId}`, { headers });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast.error("Failed to delete comment");
    }
  };

  const fetchRelated = async () => {
    try {
      if (!token) return setRelated([]);
      const res = await axios.get(`${BASE_URL}/video/own-videos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const vids = (res.data.videos || []).filter((v) => v._id !== (video?._id || videoId));
      setRelated(vids.slice(0, 6));
    } catch (err) {
      console.error("Error fetching related videos:", err);
    }
  };

  useEffect(() => {
    const id = videoId || (video && video._id);
    if (!video) fetchVideo(id);
    fetchComments(id);
    addView(id);
    fetchRelated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const openRelated = (v) => {
    // pass state same way MyVideos does: state: v (video object)
    navigate(`/Dashboard/Video/${v._id}`, { state: v });
    setVideo(v);
    fetchComments(v._id);
    fetchRelated();
  };

  return (
    <div className={styles.vdContainer}>
      <div className={styles.vdVideoSection}>
        {!video ? (
          <p>Loading video...</p>
        ) : (
          <>
            <div className={styles.vdPlayerWrap}>
              <video src={video.videoUrl} controls autoPlay className={styles.vdPlayer} />
            </div>

            <h2 className={styles.vdTitle}>{video.title}</h2>
            <p className={styles.vdMeta}>
              {video.views || 0} views • {video.createdAt ? new Date(video.createdAt).toDateString() : ""}
            </p>
            <p className={styles.vdChannel}>
              Uploaded by: <strong>{video.user_id?.channelName || "Unknown"}</strong>
            </p>
            <p className={styles.vdDescription}>{video.description}</p>

            <div className={styles.vdCommentsSection}>
              <h3>Comments ({comments.length})</h3>

              <div className={styles.vdCommentForm}>
                <textarea
                  placeholder="Add a public comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className={styles.vdCommentInput}
                />
                <div className={styles.vdCommentFormActions}>
                  <button onClick={() => setCommentText("")} className={styles.vdCancelBtnSmall}>
                    Cancel
                  </button>
                  <button onClick={postComment} className={styles.vdPostBtn}>
                    Post
                  </button>
                </div>
              </div>

              <div className={styles.vdCommentList}>
                {comments.map((c) => (
                  <div key={c._id} className={styles.vdComment}>
                    <div className={styles.vdCommentLeft}>
                      <img
                        src={c.user_id?.logoUrl || "/default-avatar.png"}
                        alt={c.user_id?.channelName || "avatar"}
                        className={styles.vdAvatar}
                      />
                    </div>

                    <div className={styles.vdCommentBody}>
                      <div className={styles.vdCommentHeader}>
                        <strong>{c.user_id?.channelName || "User"}</strong>
                        <span className={styles.vdCommentDate}>
                          • {new Date(c.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {editingCommentId === c._id ? (
                        <>
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className={styles.vdCommentEditInput}
                          />
                          <div className={styles.vdCommentActions}>
                            <button onClick={() => { setEditingCommentId(null); setEditingText(""); }} className={styles.vdCancelBtnSmall}>
                              Cancel
                            </button>
                            <button onClick={() => saveEditComment(c._id)} className={styles.vdSaveBtnSmall}>
                              Save
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className={styles.vdCommentText}>{c.commentText}</p>

                          {token && (
                            <div className={styles.vdCommentActions}>
                              <button onClick={() => startEditComment(c)} className={styles.vdSmallBtn}>
                                Edit
                              </button>
                              <button onClick={() => deleteComment(c._id)} className={styles.vdSmallBtnDanger}>
                                Delete
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {comments.length === 0 && <p className={styles.vdNoComments}>No comments yet — be first!</p>}
              </div>
            </div>
          </>
        )}
      </div>

      <aside className={styles.vdSidebar}>
        <h3>More from this uploader</h3>
        {related.map((rv) => (
          <div key={rv._id} className={styles.vdRelatedCard} onClick={() => openRelated(rv)}>
            <img src={rv.thumbnailUrl} alt={rv.title} className={styles.vdRelatedThumb} />
            <div className={styles.vdRelatedInfo}>
              <p className={styles.vdRelatedTitle}>{rv.title}</p>
              <p className={styles.vdRelatedMeta}>{rv.views || 0} views</p>
            </div>
          </div>
        ))}
        {related.length === 0 && <p className={styles.vdNoRelated}>No other videos</p>}
      </aside>
    </div>
  );
};

export default VideoDetail;
