import React from 'react'
import { useNavigate } from 'react-router-dom'
const Dashboard = () => {
    const navigate = useNavigate()
    return (
        <div>
            <h1>👨‍🏫 Teacher Dashboard</h1>
            <button onClick={() => navigate('/teacher/subjects')}>Manage Subjects</button>
        </div>

    )
}

export default Dashboard