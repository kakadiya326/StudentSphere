import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getLessonsBySubject, getStudentSubmissions } from '../../services/lessonService'
import Toast from '../../components/Toast'

const StudentLessons = () => {
    const { subjectId } = useParams()
    const navigate = useNavigate()
    const [lessons, setLessons] = useState([])
    const [submissions, setSubmissions] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [type, setType] = useState("")
    const [subjectInfo, setSubjectInfo] = useState(null)

    const fetchData = async () => {
        try {
            const [lessonsRes, submissionsRes] = await Promise.all([
                getLessonsBySubject(subjectId),
                getStudentSubmissions(subjectId)
            ])
            setLessons(lessonsRes.data.lessons || [])
            setSubmissions(submissionsRes.data.submissions || [])
            // Get subject info from lesson if available
            if (lessonsRes.data.lessons?.length > 0) {
                setSubjectInfo(lessonsRes.data.lessons[0].subjectId)
            }
        } catch (error) {
            console.log(error)
            setMessage("Failed to load lessons")
            setType("error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [subjectId])

    const getSubmissionStatus = (lessonId) => {
        const lessonSubmissions = submissions.filter(s => s.lessonId === lessonId)
        if (lessonSubmissions.length === 0) return { status: 'not_started', completed: 0, total: 0, graded: 0 }

        const lesson = lessons.find(l => l._id === lessonId)
        const totalAssignments = lesson?.assignments?.length || 0
        const completedAssignments = lessonSubmissions.filter(s =>
            s.status === 'submitted' || s.status === 'graded'
        ).length
        const gradedAssignments = lessonSubmissions.filter(s =>
            s.status === 'graded'
        ).length

        return {
            status: completedAssignments === totalAssignments && totalAssignments > 0 ? 'completed' :
                completedAssignments > 0 ? 'in_progress' : 'not_started',
            completed: completedAssignments,
            total: totalAssignments,
            graded: gradedAssignments
        }
    }

    const calculateTotalProgress = () => {
        if (lessons.length === 0) return 0
        const totalSubmissions = lessons.reduce((sum, lesson) => {
            const status = getSubmissionStatus(lesson._id)
            return sum + status.completed
        }, 0)
        const totalAssignments = lessons.reduce((sum, lesson) => {
            return sum + (lesson.assignments?.length || 0)
        }, 0)
        return totalAssignments > 0 ? Math.round((totalSubmissions / totalAssignments) * 100) : 0
    }

    if (loading) {
        return <div style={{ padding: '20px' }}>Loading...</div>
    }

    const totalProgress = calculateTotalProgress()

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '30px' }}>
                <div>
                    <h1>📚 My Lessons</h1>
                    {subjectInfo && (
                        <p style={{ color: '#666', margin: '5px 0', fontSize: '16px' }}>
                            Subject: <strong>{subjectInfo?.name}</strong> {subjectInfo?.code && `(${subjectInfo.code})`}
                        </p>
                    )}
                </div>
                <button
                    onClick={() => navigate('/student/subjects')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    ← Back to Subjects
                </button>
            </div>

            <Toast
                msgText={message}
                msgType={type}
                clearMessage={() => setMessage("")}
            />

            {/* Overall Progress Summary */}
            {lessons.length > 0 && (
                <div style={{
                    border: '2px solid #007bff',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '30px',
                    backgroundColor: '#f8f9fa'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ margin: 0 }}>📊 Subject Progress</h3>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#007bff' }}>
                            {totalProgress}%
                        </div>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '20px',
                        backgroundColor: '#e9ecef',
                        borderRadius: '10px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${totalProgress}%`,
                            height: '100%',
                            backgroundColor: totalProgress === 100 ? '#28a745' : '#007bff',
                            transition: 'width 0.3s'
                        }} />
                    </div>
                    <p style={{ fontSize: '14px', color: '#666', margin: '10px 0 0 0' }}>
                        {lessons.reduce((sum, l) => sum + (l.assignments?.length || 0), 0)} total assignments •
                        {submissions.filter(s => s.status === 'graded').length} graded •
                        {submissions.filter(s => s.status === 'submitted').length} pending review
                    </p>
                </div>
            )}

            <div style={{ display: 'grid', gap: '20px' }}>
                {lessons.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 40px',
                        border: '2px dashed #ddd',
                        borderRadius: '8px',
                        color: '#666',
                        backgroundColor: '#f9f9f9'
                    }}>
                        <h3 style={{ fontSize: '24px', margin: '0 0 10px 0' }}>📭 No lessons yet</h3>
                        <p style={{ margin: 0 }}>Your teacher hasn't created any lessons for this subject yet.</p>
                        <button
                            onClick={() => navigate('/student/subjects')}
                            style={{
                                marginTop: '20px',
                                padding: '10px 20px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            View Other Subjects
                        </button>
                    </div>
                ) : (
                    lessons.map((lesson, index) => {
                        const submissionStatus = getSubmissionStatus(lesson._id)
                        const statusColors = {
                            completed: { bg: '#d4edda', border: '#c3e6cb', text: '#155724', icon: '🎉' },
                            in_progress: { bg: '#fff3cd', border: '#ffeaa7', text: '#856404', icon: '📚' },
                            not_started: { bg: '#f8f9fa', border: '#dee2e6', text: '#6c757d', icon: '📖' }
                        }
                        const colors = statusColors[submissionStatus.status]

                        return (
                            <div key={lesson._id} style={{
                                border: `2px solid ${colors.border}`,
                                borderRadius: '8px',
                                padding: '20px',
                                backgroundColor: colors.bg,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                transform: 'translateY(0)',
                                display: 'grid',
                                gridTemplateColumns: 'auto 1fr auto',
                                gap: '20px',
                                alignItems: 'center'
                            }}
                                onClick={() => navigate(`/student/lessons/${lesson._id}`)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                                    e.currentTarget.style.transform = 'translateY(0)'
                                }}
                            >
                                {/* Left: Status Icon */}
                                <div style={{
                                    fontSize: '40px',
                                    textAlign: 'center',
                                    minWidth: '60px'
                                }}>
                                    {colors.icon}
                                </div>

                                {/* Middle: Content */}
                                <div>
                                    <h3 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '18px' }}>
                                        {index + 1}. {lesson.title}
                                    </h3>
                                    {lesson.description && (
                                        <p style={{ margin: '0 0 12px 0', color: colors.text, fontSize: '14px' }}>
                                            {lesson.description}
                                        </p>
                                    )}
                                    <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: colors.text, flexWrap: 'wrap' }}>
                                        <span>📝 {lesson.assignments?.length || 0} assignments</span>
                                        {lesson.duration > 0 && <span>⏱️ {lesson.duration} mins</span>}
                                        <span>✓ {submissionStatus.completed}/{submissionStatus.total} completed</span>
                                        {submissionStatus.graded > 0 && <span>⭐ {submissionStatus.graded} graded</span>}
                                    </div>

                                    {/* Progress Bar */}
                                    {submissionStatus.total > 0 && (
                                        <div style={{ marginTop: '12px' }}>
                                            <div style={{
                                                width: '100%',
                                                height: '6px',
                                                backgroundColor: 'rgba(0,0,0,0.1)',
                                                borderRadius: '3px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${(submissionStatus.completed / submissionStatus.total) * 100}%`,
                                                    height: '100%',
                                                    backgroundColor: submissionStatus.status === 'completed' ? '#28a745' : '#007bff',
                                                    transition: 'width 0.3s ease'
                                                }} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right: Status Badge */}
                                <div style={{
                                    textAlign: 'center',
                                    minWidth: '100px'
                                }}>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        backgroundColor: 'white',
                                        border: `2px solid ${colors.border}`,
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        color: colors.text,
                                        marginBottom: '8px'
                                    }}>
                                        {submissionStatus.status === 'completed' ? '✅ COMPLETED' :
                                            submissionStatus.status === 'in_progress' ? '🔄 IN PROGRESS' : '⏳ START'}
                                    </div>
                                    <div style={{ fontSize: '12px', color: colors.text, fontWeight: '500' }}>
                                        {Math.round((submissionStatus.completed / submissionStatus.total) * 100) || 0}%
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default StudentLessons