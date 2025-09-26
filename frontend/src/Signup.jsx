import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    verificationCode: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerificationSent, setIsVerificationSent] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationDigits, setVerificationDigits] = useState(['', '', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(0)
  const [canResend, setCanResend] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Special handling for verification code - only allow numbers and max 6 digits
    if (name === 'verificationCode') {
      const numericValue = value.replace(/\D/g, '') // Remove non-numeric characters
      if (numericValue.length <= 6) {
        setFormData(prev => ({
          ...prev,
          [name]: numericValue
        }))
      }
      return
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log('Signup attempt:', formData)
      // For demo purposes, navigate to home on any signup attempt
      navigate('/home')
      setIsLoading(false)
    }, 1000)
  }

  const handleSignIn = () => {
    navigate('/')
  }

  const handleSendVerification = async () => {
    if (!formData.email) {
      alert('Please enter your email address first')
      return
    }
    
    setIsVerifying(true)
    // Simulate API call to send verification code
    setTimeout(() => {
      console.log('Sending verification code to:', formData.email)
      setIsVerificationSent(true)
      setIsVerifying(false)
      setCanResend(false)
      setResendTimer(120) // 2 minutes
      alert('Verification code sent to your email!')
    }, 1000)
  }

  const handleResendCode = async () => {
    if (!canResend) return
    
    setIsVerifying(true)
    setTimeout(() => {
      console.log('Resending verification code to:', formData.email)
      setIsVerifying(false)
      setCanResend(false)
      setResendTimer(120) // Reset to 2 minutes
      alert('Verification code resent to your email!')
    }, 1000)
  }

  const handleDigitChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) return
    
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return
    
    const newDigits = [...verificationDigits]
    newDigits[index] = value
    setVerificationDigits(newDigits)
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      verificationCode: newDigits.join('')
    }))
    
    // Auto-focus next input if value entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`digit-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleDigitKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!verificationDigits[index] && index > 0) {
        // If current box is empty, move to previous box
        const prevInput = document.getElementById(`digit-${index - 1}`)
        if (prevInput) prevInput.focus()
      } else {
        // Clear current box
        const newDigits = [...verificationDigits]
        newDigits[index] = ''
        setVerificationDigits(newDigits)
        setFormData(prev => ({
          ...prev,
          verificationCode: newDigits.join('')
        }))
      }
    }
    
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.getElementById(`digit-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
    if (e.key === 'ArrowRight' && index < 5) {
      const nextInput = document.getElementById(`digit-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  // Timer effect
  React.useEffect(() => {
    let interval = null
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(timer => {
          if (timer <= 1) {
            setCanResend(true)
            return 0
          }
          return timer - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [resendTimer])

  return (
    <div className="min-h-screen flex items-center justify-center p-5 font-sans relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 via-emerald-700 via-emerald-800 to-emerald-900">
      {/* Animated moving gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/15 via-transparent to-emerald-600/15 animate-gradient-x"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-emerald-500/8 via-transparent to-emerald-700/8 animate-gradient-y"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/10 via-transparent to-emerald-800/10 animate-gradient-diagonal"></div>
      
      <div className="relative z-10 bg-gradient-to-br from-slate-50 via-white to-emerald-50 rounded-2xl shadow-lg p-10 w-full max-w-md border border-emerald-100 overflow-hidden">
        {/* Decorative corner elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-200/40 to-transparent rounded-bl-3xl"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-slate-200/30 to-transparent rounded-tr-3xl"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-8 left-8 w-2 h-2 bg-emerald-400 rounded-full"></div>
          <div className="absolute top-12 right-12 w-1 h-1 bg-emerald-500 rounded-full"></div>
          <div className="absolute bottom-16 left-12 w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
          <div className="absolute bottom-8 right-8 w-1 h-1 bg-slate-500 rounded-full"></div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-gray-900 text-2xl font-semibold mb-2 tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm">
            Join AromaTech to manage your diffusers
          </p>
          {/* Decorative line */}
          <div className="w-12 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto mt-3 rounded-full"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 relative">
          {/* Form background accent */}
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-50/30 via-transparent to-slate-50/20 rounded-xl -z-10"></div>
          
          {/* Username field */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-gray-700 text-sm font-semibold tracking-wide">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Choose a username"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 hover:border-emerald-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
            />
          </div>
          
          {/* Email field with verification button */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-gray-700 text-sm font-semibold tracking-wide">
              Email Address
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 hover:border-emerald-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
              />
              <button
                type="button"
                onClick={handleSendVerification}
                disabled={isVerifying || !formData.email}
                className="px-4 py-3 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                {isVerifying ? 'Sending...' : 'Send Code'}
              </button>
            </div>
          </div>
          
          {/* Email verification code field */}
          {isVerificationSent && (
            <div className="space-y-4">
              <label className="text-gray-700 text-sm font-semibold tracking-wide block text-center">
                Verification Code
              </label>
              <div className="flex justify-center gap-3">
                {verificationDigits.map((digit, index) => (
                  <input
                    key={index}
                    id={`digit-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleDigitKeyDown(index, e)}
                    maxLength={1}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 bg-white text-gray-900"
                    style={{ fontFamily: 'monospace' }}
                  />
                ))}
              </div>
              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend code in {Math.floor(resendTimer / 60)}:{(resendTimer % 60).toString().padStart(2, '0')}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isVerifying}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? 'Resending...' : "Didn't receive code? Resend"}
                  </button>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-gray-700 text-sm font-semibold tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                required
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg text-sm transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 hover:border-emerald-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all duration-200 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-gray-700 text-sm font-semibold tracking-wide">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg text-sm transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 hover:border-emerald-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all duration-200 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-emerald-700 text-white py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-emerald-800 hover:shadow-md hover:shadow-emerald-500/25 cursor-pointer"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="text-center mt-8 pt-6 border-t border-gray-100 relative">
          {/* Decorative elements */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-emerald-100 to-slate-100 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
          </div>
          
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <button
              type="button"
              className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors duration-200 cursor-pointer relative group"
              onClick={handleSignIn}
            >
              Sign in here
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 group-hover:w-full transition-all duration-300"></span>
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
