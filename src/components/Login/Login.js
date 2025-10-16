import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import logoImg from '../../assets/logo.png'
import styles from './Login.module.css'   // ✅ CSS Module

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.')
      return
    }

    setIsLoading(true)
    try {
      const res = await axios.post(
        'https://youtubeclone-production-ae8d.up.railway.app/user/login',
        { email, password }
      )

      const data = res.data
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem(
          'user',
          JSON.stringify({
            _id: data._id,
            channelName: data.channelName,
            email: data.email,
            logoUrl: data.logoUrl,
          })
        )

        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

        setSuccessMsg('Login successful — redirecting...')
        setIsLoading(false)
        setTimeout(() => navigate('/Dashboard'), 800)
      } else {
        setIsLoading(false)
        setErrorMsg('Login succeeded but no token received.')
      }
    } catch (err) {
      setIsLoading(false)
      if (err.response && err.response.data && err.response.data.error) {
        setErrorMsg(err.response.data.error)
      } else if (err.request) {
        setErrorMsg('Network error — check your connection.')
      } else {
        setErrorMsg('An unexpected error occurred.')
      }
      console.error('Login error:', err)
    }
  }

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.header}>
        <img className={styles.img} src={logoImg} alt="MyTube logo" />
        <h2 className={styles.heading}>My Tube</h2>
      </div>

      <form className={styles.formWrapper} onSubmit={handleSubmit} noValidate>
        <h3 className={styles.formTitle}>Login to your account</h3>

        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
          className={styles.input}
        />

        <div className={styles.passwordWrapper}>
          <input
            required
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
            className={styles.passwordInput}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className={styles.togglePasswordBtn}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Messages */}
        {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}
        {successMsg && <p className={styles.successText}>{successMsg}</p>}

        <button type="submit" disabled={isLoading} className={styles.submitBtn}>
          {isLoading ? <i className="fa-solid fa-spinner fa-spin-pulse" /> : 'Login'}
        </button>

        <div className={styles.switchText}>
          <small>
            Don’t have an account?{' '}
            <span onClick={() => navigate('/signup')} className={styles.signupLink}>
              Sign up
            </span>
          </small>
        </div>
      </form>
    </div>
  )
}

export default Login
