import React, { useState } from 'react'
import styles from './Signup.module.css'
import logoImg from '../../assets/logo.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const [ChannelName, setChannelName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [logo, setLogo] = useState('')
  const [imgUrl, setImgUrl] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('') // 👈 state for errors

  const navigate = useNavigate()

  const fileHandler = (e) => {
    setLogo(e.target.files[0])
    setImgUrl(URL.createObjectURL(e.target.files[0]))
  }

  const submitHandler = (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('') // reset error before new request

    const formData = new FormData()
    formData.append('channelName', ChannelName)
    formData.append('email', email)
    formData.append('phone', phone)
    formData.append('password', password)
    formData.append('logo', logo)

    axios
      .post('https://youtubeclone-production-ae8d.up.railway.app/user/signup', formData, { timeout: 30000 })
      .then((res) => {
        console.log(res.data)
        setLoading(false)          
        navigate('/login') // success → redirect
      })
      .catch((err) => {
        setLoading(false)
        if (err.response && err.response.data.error) {
          setErrorMsg(err.response.data.error) // backend error
        } else {
          setErrorMsg('Network error, please try again later.')
        }
        console.error(err)
      })
  }

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.header}>
        <img className={styles.img} src={logoImg} alt="logo" />
        <h2 className={styles.headding}>My Tube</h2>
      </div>

      <form className={styles.formWrapper} onSubmit={submitHandler}>
        <input
          required
          onChange={(e) => setChannelName(e.target.value)}
          type="text"
          placeholder="Channel Name"
        />
        <input
          required
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
        />
        <input
          required
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <input
          required
          onChange={(e) => setPhone(e.target.value)}
          type="text"
          placeholder="Phone"
        />
        <input required onChange={fileHandler} type="file" />

        {imgUrl && <img className={styles.previewImg} alt="logo-preview" src={imgUrl} />}

        {/* 🔴 Show error if exists */}
        {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? <i className="fa-solid fa-spinner fa-spin-pulse"></i> : 'Submit'}
        </button>

        {/* 👇 New "Already have account?" option */}
        <div className={styles.switchText}>
          <small>
            Already have an account?{' '}
            <span onClick={() => navigate('/login')}>Login</span>
          </small>
        </div>
      </form>
    </div>
  )
}

export default Signup
