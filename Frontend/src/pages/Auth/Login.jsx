import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../services/authService'
import { getToken, setToken } from '../../utils/storage'
import { jwtDecode } from "jwt-decode"
import Toast from '../../components/Toast'
import { getStudentProfile } from '../../services/studentService'
import { getTeacherProfile } from '../../services/teacherService'

const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    })

    const [message, setMessage] = useState("")
    const [type, setType] = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        const token = getToken()
        if (token) {
            try {
                const user = jwtDecode(token);
                if (user.role === "teacher") {
                    // Check profile
                    getTeacherProfile().then(res => {
                        if (res.data.teacher) {
                            navigate('/teacher')
                        } else {
                            navigate('/complete-teacher-profile')
                        }
                    }).catch(() => {
                        navigate('/complete-teacher-profile')
                    })
                }
                else if (user.role === "student") {
                    // Check profile
                    getStudentProfile().then(res => {
                        if (res.data.student) {
                            navigate('/student')
                        } else {
                            navigate('/complete-profile')
                        }
                    }).catch(() => {
                        navigate('/complete-profile')
                    })
                }
            } catch (error) {
                // Invalid token, remove it and stay on login
                localStorage.removeItem('token')
            }
        }

    }, [navigate])

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const ApiResponse = await loginUser(form);

            const token = ApiResponse.data.token
            setToken(token)

            try {
                const user = jwtDecode(token)

                if (user.role === "teacher") {
                    navigate("/teacher")
                } else if (user.role === "student") {
                    // Check if profile is complete
                    try {
                        const profileRes = await getStudentProfile()
                        if (profileRes.data.student) {
                            navigate("/student")
                        } else {
                            navigate("/complete-profile")
                        }
                    } catch {
                        // If error getting profile, assume not complete
                        navigate("/complete-profile")
                    }
                }

                setMessage("Login successful")
                setType("success")
            } catch (decodeError) {
                console.log(decodeError);
                setMessage("Invalid token received")
                setType("error")
                localStorage.removeItem('token')
            }

        } catch (error) {
            console.log(error);
            setMessage("Login failed")
            setType("error")
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
                        📚 Welcome Back
                    </h2>
                    <p style={{ color: '#666', margin: 0, fontSize: '16px' }}>
                        Sign in to your StudentSphere account
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
                            Email Address
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
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
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

                    <button
                        type='submit'
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                            marginTop: '10px'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                    >
                        Sign In
                    </button>
                </form>

                <div style={{
                    textAlign: 'center',
                    marginTop: '25px',
                    paddingTop: '20px',
                    borderTop: '1px solid #e0e0e0'
                }}>
                    <p style={{ color: '#666', margin: '0 0 10px 0', fontSize: '14px' }}>
                        Don't have an account?
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        style={{
                            background: 'none',
                            border: '2px solid #28a745',
                            color: '#28a745',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#28a745'
                            e.target.style.color = 'white'
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent'
                            e.target.style.color = '#28a745'
                        }}
                    >
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login