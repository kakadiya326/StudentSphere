import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTeacherProfile } from '../../services/teacherService'
import { getMySubjects } from '../../services/subjectService'

const Dashboard = () => {
    const navigate = useNavigate()
    const [subjects, setSubjects] = useState([])
    const [profileCompleted, setProfileCompleted] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkProfile()
        getMySubjects().then((res) => {
            setSubjects(res.data.subjects || [])
        })

    }, [])

    const checkProfile = async () => {
        try {
            const res = await getTeacherProfile()
            setProfileCompleted(!!res.data.teacher)
        } catch {
            setProfileCompleted(false)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>👨‍🏫 Teacher Dashboard</h1>

            {!profileCompleted && (
                <div style={{
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffeaa7',
                    borderRadius: '4px',
                    padding: '15px',
                    marginBottom: '20px'
                }}>
                    <p style={{ margin: '0 0 10px 0', color: '#856404' }}>
                        ⚠️ Please complete your profile to access all features.
                    </p>
                    <button
                        onClick={() => navigate('/complete-teacher-profile')}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#ffc107',
                            color: '#212529',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Complete Profile
                    </button>
                </div>
            )}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                    onClick={() => navigate('/teacher/subjects')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: profileCompleted ? '#007bff' : '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: profileCompleted ? 'pointer' : 'not-allowed'
                    }}
                    disabled={!profileCompleted}
                >
                    Manage Subjects
                </button>
                <button
                    onClick={() => navigate('/teacher/myprofile')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    My Profile
                </button>
            </div>

            <div style={{ marginTop: '30px' }}>
                <h2>📚 My Subjects</h2>

                {subjects.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '20px'
                    }}>
                        {subjects.map((subject) => (
                            <div
                                key={subject._id}
                                style={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    backgroundColor: '#fff',
                                    transition: '0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                }}
                            >
                                <h3 style={{ marginBottom: '10px' }}>{subject.name}</h3>

                                <p style={{ margin: '5px 0', color: '#555' }}>
                                    <strong>Code:</strong> {subject.code}
                                </p>

                                <p style={{ margin: '5px 0', color: '#555' }}>
                                    <strong>Department:</strong> {subject.teacherId?.department || 'N/A'}
                                </p>

                                <p style={{ margin: '5px 0', color: '#555' }}>
                                    <strong>Teacher:</strong> {subject.teacherId?.userId?.name}
                                </p>

                                <p style={{ margin: '5px 0', color: '#555' }}>
                                    <strong>Email:</strong> {subject.teacherId?.userId?.email}
                                </p>

                                <button
                                    onClick={() => navigate(`/teacher/subjects/${subject._id}`)}
                                    style={{
                                        marginTop: '10px',
                                        padding: '8px 12px',
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No subjects found</p>
                )}
            </div>
        </div>
    )
}

export default Dashboard