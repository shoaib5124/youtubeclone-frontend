import React, { useState,useRef } from 'react'
import axios from 'axios'
import styles from './Video.module.css'
import { toast } from 'react-toastify'
import { Navigate, useNavigate } from 'react-router-dom'

const Upload = () => {
    const [title,setTitle] = useState('')
    const [description,setDescription] = useState('')
    const [category,setCategory] = useState('')
    const [tags,setTags] = useState('')
    const [video,setVideo] = useState('')
    const [thumbnail,setThumbnail]=  useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [imgUrl,setImgUrl] = useState(null)
    const navigate = useNavigate()

    // refs for actual DOM file inputs (used to clear the file picker UI)
    const videoRef = useRef(null);
    const thumbnailRef = useRef(null);


    const videoHandler = (e)=>{
      setVideo(e.target.files[0])
    }
    const thumbnailHandler = (e)=>{
    // 2) Clear preview and revoke blob URL to avoid memory leak
    if (imgUrl) {
      URL.revokeObjectURL(imgUrl);
      setImgUrl(null);
    }

    setThumbnail(e.target.files[0])
    setImgUrl(  URL.createObjectURL(e.target.files[0]))
    }

    const clearForm = () => {
    // 1) Clear React state (controlled fields)
    setTitle("");
    setDescription("");
    setCategory("");
    setTags("");
    setVideo(null);
    setThumbnail(null);

    // 2) Clear preview and revoke blob URL to avoid memory leak
    if (imgUrl) {
      URL.revokeObjectURL(imgUrl);
      setImgUrl(null);
    }

    // 3) Clear the actual browser file inputs using refs
    if (videoRef.current) videoRef.current.value = "";
    if (thumbnailRef.current) thumbnailRef.current.value = "";
  };



    const submitHandler = (e)=>{
      e.preventDefault();
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('category', category)
      formData.append('tags', tags)
      formData.append('video', video)
      formData.append('thumbnail', thumbnail)
      const token = localStorage.getItem("token");
      setIsLoading(true)
      axios.
      post('https://youtubeclone-production-ae8d.up.railway.app/video/upload',formData,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      .then(res=>{
        clearForm();    
        console.log(res)
        setIsLoading(false)
        toast.success('Video is uploaded successfully')
        navigate('/Dashboard/MyVideos')
      })
      .catch(err=>{
        console.log(err)
        setIsLoading(false)
        toast.error(err?.response?.data?.error || "Upload failed ❌")
      })
    }
  return (
    <div className={styles.uploadContainer}>
        <h2>Upload Video</h2>
        <form onSubmit={submitHandler} className={styles.uploadForm}>
            <input value={title}  onChange={(e)=>{setTitle(e.target.value)}} placeholder='Title' required/>
            <textarea value={description}  onChange={(e)=>{setDescription(e.target.value)}} required placeholder='Description'></textarea>
            <select value={category} onChange={(e)=>{setCategory(e.target.value)}} required>
                <option value=''>Select Category</option>
                <option value='science'>Science</option>
                <option value='technology'>Technology</option>
                <option value='education'>Education</option>
                <option value='motivation'>Motivation</option>
                <option value='entertainment'>Entertainment</option>
            </select>
            <textarea value={tags} required  onChange={(e)=>{setTags(e.target.value)}} placeholder='tags'></textarea>
            <label>Select Video</label>
            <input ref={videoRef} required onChange={videoHandler} type='file'/>

            <label>thumbnail</label>
            <input ref={thumbnailRef} onChange={thumbnailHandler} type='file' required/>
            {imgUrl && <img className={styles.previewImg} alt='thumbnail' src={imgUrl} required/>}
            <button type='Submit'> {isLoading ? <i className="fa-solid fa-spinner fa-spin-pulse" /> : 'Upload'}</button>
        </form>
    </div>
  )
}

export default Upload
