import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../../services/authService'
import Toast from '../../components/Toast'

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student"
    })

    const [message, setMessage] = useState("")
    const [type, setType] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validation
        if (!form.name.trim()) {
            setMessage("Please enter your name")
            setType("error")
            return
        }

        if (!form.email.trim()) {
            setMessage("Please enter your email")
            setType("error")
            return
        }

        if (!form.password) {
            setMessage("Please enter a password")
            setType("error")
            return
        }

        if (form.password.length < 6) {
            setMessage("Password must be at least 6 characters long")
            setType("error")
            return
        }

        if (form.password !== form.confirmPassword) {
            setMessage("Passwords do not match")
            setType("error")
            return
        }

        setLoading(true)

        try {
            const response = await registerUser({
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
                role: form.role
            });

            setMessage("Registration successful! Please login to continue.")
            setType("success")

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/')
            }, 2000)

        } catch (error) {
            console.log(error);
            if (error.response?.data?.warning) {
                setMessage(error.response.data.warning)
            } else {
                setMessage("Registration failed. Please try again.")
            }
            setType("error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{
                        color: '#007bff',
                        margin: '0 0 10px 0',
                        fontSize: '28px',
                        fontWeight: '600'
                    }}>
                        📚 Join StudentSphere
                    </h2>
                    <p style={{ color: '#666', margin: 0, fontSize: '16px' }}>
                        Create your account to get started
                    </p>
                </div>

                <Toast
                    msgText={message}
                    msgType={type}
                    clearMessage={() => setMessage("")}
                />

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            color: '#333',
                            fontWeight: '500',
                            fontSize: '14px'
                        }}>
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '16px',
                                transition: 'border-color 0.3s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#007bff'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            color: '#333',
                            fontWeight: '500',
                            fontSize: '14px'
                        }}>
                            Email Address *
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '16px',
                                transition: 'border-color 0.3s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#007bff'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            color: '#333',
                            fontWeight: '500',
                            fontSize: '14px'
                        }}>
                            I am a *
                        </label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '16px',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                boxSizing: 'border-box'
                            }}
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            color: '#333',
                            fontWeight: '500',
                            fontSize: '14px'
                        }}>
                            Password *
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password (min 6 characters)"
                            value={form.password}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '16px',
                                transition: 'border-color 0.3s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#007bff'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            color: '#333',
                            fontWeight: '500',
                            fontSize: '14px'
                        }}>
                            Confirm Password *
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '16px',
                                transition: 'border-color 0.3s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#007bff'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: loading ? '#6c757d' : '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.3s',
                            marginTop: '10px'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) e.target.style.backgroundColor = '#218838'
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) e.target.style.backgroundColor = '#28a745'
                        }}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div style={{
                    textAlign: 'center',
                    marginTop: '25px',
                    paddingTop: '20px',
                    borderTop: '1px solid #e0e0e0'
                }}>
                    <p style={{ color: '#666', margin: '0 0 10px 0', fontSize: '14px' }}>
                        Already have an account?
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'none',
                            border: '2px solid #007bff',
                            color: '#007bff',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#007bff'
                            e.target.style.color = 'white'
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent'
                            e.target.style.color = '#007bff'
                        }}
                    >
                        Sign In Instead
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Register