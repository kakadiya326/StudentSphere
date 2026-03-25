import React from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const navigate = useNavigate()
    return (
        <div>
            <h1>🎓 Student Dashboard</h1>
            <button onClick={() => navigate("/student/subjects")}>
                View Subjects
            </button>
        </div>
    )
}

export default Dashboard