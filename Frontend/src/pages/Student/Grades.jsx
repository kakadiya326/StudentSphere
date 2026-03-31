import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import Toast from '../../components/Toast'

const StudentGrades = () => {
    const navigate = useNavigate()
    const [submissions, setSubmissions] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [type, setType] = useState("")
    const [filter, setFilter] = useState("all") // all, pending, graded
    const [selectedSubmission, setSelectedSubmission] = useState(null)

    const fetchSubmissions = async () => {
        try {
            setLoading(true)
            // This would need a new API endpoint to get student's all submissions
            // For now, we'll fetch from localStorage or use existing endpoint
            const response = await api.get('/lessons/submissions/student')
            setSubmissions(response.data.submissions || [])
        } catch (error) {
            console.log(error)
            setMessage("Failed to load submissions")
            setType("error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSubmissions()
    }, [])

    const getFilteredSubmissions = () => {
        return submissions.filter(submission => {
            if (filter === "pending") {
                return submission.status === "draft" || submission.status === "submitted"
            }
            if (filter === "graded") {
                return submission.status === "graded"
            }
            return true
        })
    }

    const calculateStats = () => {
        const graded = submissions.filter(s => s.status === "graded")
        const pending = submissions.filter(s => s.status === "submitted")
        const totalPoints = submissions.reduce((sum, s) => sum + (s.maxPoints || 0), 0)
        const earnedPoints = graded.reduce((sum, s) => sum + (s.score || 0), 0)
        const percentage = totalPoints > 0 ? ((earnedPoints / totalPoints) * 100).toFixed(1) : 0

        return {
            total: submissions.length,
            graded: graded.length,
            pending: pending.length,
            totalPoints,
            earnedPoints,
            percentage
        }
    }

    const stats = calculateStats()
    const filteredSubmissions = getFilteredSubmissions()

    if (loading) {
        return <div style={{ padding: '20px' }}>Loading...</div>
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '30px' }}>
                <h1>📊 My Grades & Submissions</h1>
                <p style={{ color: '#666', margin: '5px 0' }}>Track your academic performance</p>
            </div>

            <Toast
                msgText={message}
                msgType={type}
                clearMessage={() => setMessage("")}
            />

            {/* Statistics Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: '30px'
            }}>
                <div style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#007bff', marginBottom: '5px' }}>
                        {stats.total}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Total Submissions</div>
                </div>

                <div style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745', marginBottom: '5px' }}>
                        {stats.graded}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Graded</div>
                </div>

                <div style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffc107', marginBottom: '5px' }}>
                        {stats.pending}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Pending</div>
                </div>

                <div style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#17a2b8', marginBottom: '5px' }}>
                        {stats.percentage}%
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Overall Score</div>
                </div>
            </div>

            {/* Points Summary */}
            {stats.earnedPoints > 0 && (
                <div style={{
                    border: '2px solid #28a745',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '30px',
                    backgroundColor: '#f1f5f1'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#28a745' }}>
                        📈 Points: {stats.earnedPoints} / {stats.totalPoints}
                    </h3>
                    <div style={{
                        width: '100%',
                        height: '20px',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '10px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${stats.percentage}%`,
                            height: '100%',
                            backgroundColor: '#28a745',
                            transition: 'width 0.3s'
                        }} />
                    </div>
                </div>
            )}

            {/* Filter Tabs */}
            <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '20px',
                borderBottom: '2px solid #e0e0e0'
            }}>
                {['all', 'pending', 'graded'].map(filterOption => (
                    <button
                        key={filterOption}
                        onClick={() => setFilter(filterOption)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: filter === filterOption ? '#007bff' : 'transparent',
                            color: filter === filterOption ? 'white' : '#333',
                            border: 'none',
                            borderBottom: filter === filterOption ? '3px solid #007bff' : 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            textTransform: 'capitalize'
                        }}
                    >
                        {filterOption === 'all' && `All (${submissions.length})`}
                        {filterOption === 'pending' && `Pending (${submissions.filter(s => s.status === 'submitted').length})`}
                        {filterOption === 'graded' && `Graded (${submissions.filter(s => s.status === 'graded').length})`}
                    </button>
                ))}
            </div>

            {/* Submissions List */}
            <div>
                {filteredSubmissions.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        border: '2px dashed #ddd',
                        borderRadius: '8px',
                        color: '#666'
                    }}>
                        <h3>No submissions found</h3>
                        <p>
                            {filter === 'all' && 'You haven\'t submitted anything yet.'}
                            {filter === 'pending' && 'No pending submissions.'}
                            {filter === 'graded' && 'No graded submissions.'}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {filteredSubmissions.map((submission) => (
                            <div key={submission._id} style={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                padding: '20px',
                                backgroundColor: 'white',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                                transition: 'box-shadow 0.3s'
                            }}
                                onClick={() => setSelectedSubmission(submission)}
                                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'}
                                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>
                                            {submission.assignmentTitle || 'Assignment'}
                                        </h4>
                                        <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                                            {submission.lessonTitle || 'Lesson'} • {submission.subjectTitle || 'Subject'}
                                        </p>
                                        <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#777' }}>
                                            <span>📅 Submitted: {new Date(submission.submittedAt || submission.createdAt).toLocaleDateString()}</span>
                                            {submission.dueDate && (
                                                <span>🎯 Due: {new Date(submission.dueDate).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', minWidth: '120px' }}>
                                        <div style={{
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            marginBottom: '5px',
                                            color: submission.status === 'graded' ? '#28a745' : '#ffc107'
                                        }}>
                                            {submission.status === 'graded' ? `${submission.score || 0}/${submission.maxPoints || 0}` : '—'}
                                        </div>
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            backgroundColor:
                                                submission.status === 'graded' ? '#d4edda' :
                                                    submission.status === 'submitted' ? '#fff3cd' : '#e7e7e7',
                                            color:
                                                submission.status === 'graded' ? '#155724' :
                                                    submission.status === 'submitted' ? '#856404' : '#666'
                                        }}>
                                            {submission.status === 'graded' ? '✓ Graded' :
                                                submission.status === 'submitted' ? '⏳ Pending' : 'Draft'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedSubmission && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '30px',
                        width: '100%',
                        maxWidth: '600px',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>Submission Details</h2>
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e0e0e0' }}>
                            <h3 style={{ margin: '0 0 10px 0' }}>{selectedSubmission.assignmentTitle || 'Assignment'}</h3>
                            <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                                {selectedSubmission.lessonTitle || 'Lesson'} • {selectedSubmission.subjectTitle || 'Subject'}
                            </p>
                            <p style={{ margin: '0', color: '#999', fontSize: '14px' }}>
                                Submitted: {new Date(selectedSubmission.submittedAt || selectedSubmission.createdAt).toLocaleString()}
                            </p>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <h4>Status & Score</h4>
                            <div style={{
                                display: 'flex',
                                gap: '20px',
                                alignItems: 'center',
                                padding: '15px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '6px'
                            }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Status</div>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '6px 12px',
                                        borderRadius: '4px',
                                        backgroundColor:
                                            selectedSubmission.status === 'graded' ? '#d4edda' :
                                                selectedSubmission.status === 'submitted' ? '#fff3cd' : '#e7e7e7',
                                        color:
                                            selectedSubmission.status === 'graded' ? '#155724' :
                                                selectedSubmission.status === 'submitted' ? '#856404' : '#666',
                                        fontWeight: 'bold'
                                    }}>
                                        {selectedSubmission.status === 'graded' ? '✓ Graded' :
                                            selectedSubmission.status === 'submitted' ? '⏳ Pending' : 'Draft'}
                                    </div>
                                </div>
                                {selectedSubmission.status === 'graded' && (
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Score</div>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                                            {selectedSubmission.score || 0} / {selectedSubmission.maxPoints || 0}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {selectedSubmission.feedback && (
                            <div style={{ marginBottom: '20px' }}>
                                <h4>Teacher Feedback</h4>
                                <div style={{
                                    padding: '15px',
                                    backgroundColor: '#e3f2fd',
                                    borderLeft: '4px solid #2196f3',
                                    borderRadius: '4px',
                                    whiteSpace: 'pre-wrap',
                                    color: '#1565c0'
                                }}>
                                    {selectedSubmission.feedback}
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    navigate(`/student/lessons/${selectedSubmission.lessonId}`)
                                    setSelectedSubmission(null)
                                }}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                View Lesson
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StudentGrades
