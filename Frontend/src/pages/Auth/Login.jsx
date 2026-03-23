import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../services/authService'
import { getToken, setToken } from '../../utils/storage'
import { jwtDecode } from "jwt-decode"
import Toast from '../../components/Toast'

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
            const user = jwtDecode(token);
            if (user.role === "teacher") {
                navigate('/teacher')
            }
            else {
                navigate('/student')
            }
        }

    }, [])

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

            const user = jwtDecode(token)

            if (user.role === "teacher") {
                navigate("/teacher")
            } else if (user.role === "student") {
                navigate("/student")
            }

            setMessage("Login successful")
            setType("success")

        } catch (error) {
            console.log(error);
            setMessage("Login failed")
            setType("error")
        }
    }
    return (
        <div>
            <h2>Login</h2>
            <Toast
                msgText={message}
                msgType={type}
                clearMessage={() => setMessage("")}
            />
            <form method='post' onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={form.email}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={form.password}
                    onChange={handleChange}
                />
                <button type='submit'>Login</button>

            </form>
        </div>
    )
}

export default Login