import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getLesson, submitAssignment, getStudentSubmissions, markLessonComplete } from '../../services/lessonService'
import Toast from '../../components/Toast'

const LessonView = () => {
    const { lessonId } = useParams()
    const navigate = useNavigate()
    const [lesson, setLesson] = useState(null)
    const [submissions, setSubmissions] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [type, setType] = useState("")
    const [currentAssignment, setCurrentAssignment] = useState(0)
    const [assignmentAnswers, setAssignmentAnswers] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [showContentOnly, setShowContentOnly] = useState(true)

    const fetchData = async () => {
        try {
            const [lessonRes, submissionsRes] = await Promise.all([
                getLesson(lessonId),
                getStudentSubmissions(lessonId)
            ])
            setLesson(lessonRes.data.lesson)
            setSubmissions(submissionsRes.data.submissions || [])

            // Initialize assignment answers
            const answers = {}
            lessonRes.data.lesson?.assignments?.forEach((assignment, index) => {
                const existingSubmission = submissionsRes.data.submissions?.find(s =>
                    s.answers && s.answers[index]
                )
                if (existingSubmission) {
                    answers[index] = existingSubmission.answers[index]
                }
            })
            setAssignmentAnswers(answers)
        } catch (error) {
            console.log(error)
            setMessage("Failed to load lesson")
            setType("error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData() // eslint-disable-line react-hooks/exhaustive-deps
    }, [lessonId])

    const handleAssignmentSubmit = async (assignmentIndex) => {
        const assignment = lesson.assignments[assignmentIndex]
        const answer = assignmentAnswers[assignmentIndex]

        // Validate submission
        if (assignment.type === 'text' || assignment.type === 'essay') {
            if (!answer?.content?.trim()) {
                setMessage("Please write your answer before submitting")
                setType("error")
                return
            }
        } else if (assignment.type === 'file_upload') {
            if (!answer?.files || answer.files.length === 0) {
                setMessage("Please select at least one file to upload")
                setType("error")
                return
            }
        } else if (assignment.type === 'quiz') {
            if (!answer?.answers || answer.answers.some(a => !a)) {
                setMessage("Please answer all quiz questions")
                setType("error")
                return
            }
        }

        setSubmitting(true)
        try {
            // Prepare form data for file upload
            const formData = new FormData()
            formData.append('lessonId', lessonId)
            formData.append('assignmentIndex', assignmentIndex)

            if (assignment.type === 'file_upload' && answer.files) {
                // Add files to form data
                answer.files.forEach((file) => {
                    formData.append('files', file)
                })
            } else {
                // For text and quiz, send answers as JSON
                formData.append('answers', JSON.stringify(answer.answers || []))
                if (answer.content) {
                    formData.append('textSubmission', answer.content)
                }
            }

            // Submit using fetch instead of axios to handle FormData properly
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:5000/api/lessons/submit', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            if (!response.ok) {
                throw new Error('Submission failed')
            }

            setMessage("Assignment submitted successfully! 🎉")
            setType("success")
            fetchData() // Refresh submissions

            // Move to next assignment or mark lesson complete
            if (assignmentIndex < lesson.assignments.length - 1) {
                setCurrentAssignment(assignmentIndex + 1)
            }
        } catch (error) {
            console.log(error)
            setMessage("Failed to submit assignment")
            setType("error")
        } finally {
            setSubmitting(false)
        }
    }

    const updateAnswer = (assignmentIndex, field, value) => {
        setAssignmentAnswers(prev => ({
            ...prev,
            [assignmentIndex]: {
                ...prev[assignmentIndex],
                [field]: value
            }
        }))
    }

    const isAssignmentSubmitted = (assignmentIndex) => {
        return submissions.some(s => s.answers && s.answers[assignmentIndex])
    }

    const getSubmissionStatus = (assignmentIndex) => {
        const submission = submissions.find(s => s.assignmentIndex === assignmentIndex)
        if (!submission) return null
        return {
            status: submission.status,
            score: submission.grade,
            maxPoints: submission.maxPoints,
            feedback: submission.feedback,
            submittedAt: submission.submittedAt
        }
    }

    const isAssignmentOverdue = (dueDate) => {
        if (!dueDate) return false
        return new Date() > new Date(dueDate)
    }

    const getDaysUntilDue = (dueDate) => {
        if (!dueDate) return null
        const now = new Date()
        const due = new Date(dueDate)
        const days = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
        return days
    }

    if (loading) {
        return <div style={{ padding: '20px' }}>Loading...</div>
    }

    if (!lesson) {
        return <div style={{ padding: '20px' }}>Lesson not found</div>
    }

    const assignment = lesson.assignments?.[currentAssignment]
    const submissionStatus = getSubmissionStatus(currentAssignment)
    const isOverdue = assignment && isAssignmentOverdue(assignment.dueDate)
    const daysUntilDue = assignment && getDaysUntilDue(assignment.dueDate)

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div>
                    <h1>📖 {lesson.title}</h1>
                    <p style={{ color: '#666', margin: '5px 0' }}>
                        {lesson.description}
                    </p>
                    {lesson.duration > 0 && (
                        <p style={{ color: '#999', fontSize: '14px', margin: '5px 0' }}>
                            ⏱️ Estimated time: {lesson.duration} minutes
                        </p>
                    )}
                </div>
                <button
                    onClick={() => navigate(`/student/subjects/${lesson.subjectId._id}/lessons`)}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    ← Back
                </button>
            </div>

            {/* Lesson Content */}
            {showContentOnly && (lesson.content || lesson.description) && (
                <div style={{
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '25px',
                    backgroundColor: '#f8f9fa'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0 }}>📚 Lesson Content</h3>
                        <button
                            onClick={() => setShowContentOnly(!showContentOnly)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#007bff',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            {showContentOnly ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    <div style={{
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.6',
                        color: '#333',
                        maxHeight: '300px',
                        overflowY: 'auto'
                    }}>
                        {lesson.content}
                    </div>
                </div>
            )}

            <Toast
                msgText={message}
                msgType={type}
                clearMessage={() => setMessage("")}
            />

            {/* Assignment Navigation */}
            {lesson.assignments?.length > 0 && (
                <div style={{ marginBottom: '25px' }}>
                    <h3>📝 Assignments ({currentAssignment + 1}/{lesson.assignments.length})</h3>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {lesson.assignments.map((_, index) => {
                            const status = getSubmissionStatus(index)
                            return (
                                <button
                                    key={index}
                                    onClick={() => setCurrentAssignment(index)}
                                    style={{
                                        padding: '10px 14px',
                                        backgroundColor: currentAssignment === index ? '#007bff' : '#f8f9fa',
                                        color: currentAssignment === index ? 'white' : '#333',
                                        border: currentAssignment === index ? '2px solid #0056b3' : '1px solid #dee2e6',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        transition: 'all 0.2s'
                                    }}
                                    title={status?.status === 'graded' ? `Graded: ${status.score}/${status.maxPoints}` : status?.status === 'submitted' ? 'Pending grading' : 'Not submitted'}
                                >
                                    {index + 1}. {status?.status === 'graded' ? '✅' : status?.status === 'submitted' ? '⏳' : '⭕'}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Assignment Content */}
            {assignment ? (
                <div style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '25px',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    {/* Assignment Header */}
                    <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '2px solid #e0e0e0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>{assignment.title}</h2>
                                <p style={{ color: '#666', margin: '5px 0', fontSize: '15px' }}>{assignment.description}</p>

                                {/* Details Row */}
                                <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#666', marginTop: '10px', flexWrap: 'wrap' }}>
                                    <span>📋 Type: <strong>{assignment.type}</strong></span>
                                    {assignment.maxPoints > 0 && <span>⭐ Points: <strong>{assignment.maxPoints}</strong></span>}
                                    {assignment.dueDate && (
                                        <span style={{
                                            color: isOverdue ? '#dc3545' : daysUntilDue <= 2 ? '#ffc107' : '#28a745'
                                        }}>
                                            📅 Due: <strong>{new Date(assignment.dueDate).toLocaleDateString()}</strong>
                                            {daysUntilDue !== null && (
                                                <span> ({isOverdue ? `OVERDUE ${Math.abs(daysUntilDue)} days` : `${daysUntilDue} days left`})</span>
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Status Badge */}
                            {submissionStatus && (
                                <div style={{
                                    padding: '15px',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    backgroundColor: submissionStatus.status === 'graded' ? '#d4edda' :
                                        submissionStatus.status === 'submitted' ? '#fff3cd' : '#e7e7e7',
                                    border: '1px solid ' + (submissionStatus.status === 'graded' ? '#c3e6cb' :
                                        submissionStatus.status === 'submitted' ? '#ffeaa7' : '#d3d3d3'),
                                    minWidth: '130px'
                                }}>
                                    <div style={{
                                        fontSize: '12px',
                                        color: submissionStatus.status === 'graded' ? '#155724' :
                                            submissionStatus.status === 'submitted' ? '#856404' : '#666',
                                        marginBottom: '5px',
                                        fontWeight: 'bold'
                                    }}>
                                        {submissionStatus.status === 'graded' ? '✓ GRADED' :
                                            submissionStatus.status === 'submitted' ? '⏳ PENDING' : 'DRAFT'}
                                    </div>
                                    {submissionStatus.status === 'graded' && (
                                        <div style={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            color: '#155724'
                                        }}>
                                            {submissionStatus.score}/{submissionStatus.maxPoints}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Instructions */}
                    {assignment.instructions && (
                        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderLeft: '4px solid #2196f3', borderRadius: '4px' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>📋 Instructions:</h4>
                            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5', color: '#1565c0' }}>
                                {assignment.instructions}
                            </div>
                        </div>
                    )}

                    {/* Submission Form */}
                    {!submissionStatus || submissionStatus.status !== 'graded' ? (
                        <div style={{ marginTop: '20px' }}>
                            {assignment.type === 'text' || assignment.type === 'essay' ? (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
                                        Your Answer:
                                    </label>
                                    <textarea
                                        value={assignmentAnswers[currentAssignment]?.content || ''}
                                        onChange={(e) => updateAnswer(currentAssignment, 'content', e.target.value)}
                                        placeholder="Write your answer here..."
                                        style={{
                                            width: '100%',
                                            minHeight: '200px',
                                            padding: '15px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            fontSize: '14px',
                                            fontFamily: 'inherit',
                                            resize: 'vertical'
                                        }}
                                        disabled={submitting || submissionStatus?.status === 'submitted'}
                                    />
                                </div>
                            ) : assignment.type === 'file_upload' ? (
                                <div>
                                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
                                            Upload Files:
                                        </label>
                                    <input
                                        type="file"
                                        multiple
                                            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                                            onChange={(e) => updateAnswer(currentAssignment, 'files', Array.from(e.target.files))}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px'
                                        }}
                                            disabled={submitting || submissionStatus?.status === 'submitted'}
                                    />
                                        <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                                            Accepted formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB total)
                                        </small>
                                    {assignmentAnswers[currentAssignment]?.files?.length > 0 && (
                                            <div style={{ marginTop: '10px' }}>
                                                <strong>Selected files:</strong>
                                                <ul>
                                                    {assignmentAnswers[currentAssignment].files.map((file, index) => (
                                                    <li key={index} style={{ color: '#666' }}>{file.name}</li>
                                                ))}
                                                </ul>
                                        </div>
                                    )}
                                </div>
                            ) : assignment.type === 'quiz' ? (
                                <div>
                                            <h4 style={{ marginBottom: '15px', color: '#333' }}>Quiz Questions:</h4>
                                    {assignment.questions?.map((question, qIndex) => (
                                        <div key={qIndex} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '4px' }}>
                                            <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                                {qIndex + 1}. {question.question}
                                            </p>
                                            {question.type === 'multiple_choice' ? (
                                                <div>
                                                    {question.options?.map((option, oIndex) => (
                                                        <label key={oIndex} style={{ display: 'block', marginBottom: '5px', cursor: 'pointer' }}>
                                                            <input
                                                                type="radio"
                                                                name={`question-${qIndex}`}
                                                                value={option}
                                                                checked={assignmentAnswers[currentAssignment]?.answers?.[qIndex] === option}
                                                                onChange={(e) => {
                                                                    const newAnswers = [...(assignmentAnswers[currentAssignment]?.answers || [])]
                                                                    newAnswers[qIndex] = e.target.value
                                                                    updateAnswer(currentAssignment, 'answers', newAnswers)
                                                                }}
                                                                disabled={submitting || submissionStatus?.status === 'submitted'}
                                                                style={{ marginRight: '8px' }}
                                                            />
                                                            {option}
                                                        </label>
                                                    ))}
                                                </div>
                                            ) : (
                                                    <textarea
                                                        placeholder="Your answer..."
                                                    value={assignmentAnswers[currentAssignment]?.answers?.[qIndex] || ''}
                                                    onChange={(e) => {
                                                        const newAnswers = [...(assignmentAnswers[currentAssignment]?.answers || [])]
                                                        newAnswers[qIndex] = e.target.value
                                                        updateAnswer(currentAssignment, 'answers', newAnswers)
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        minHeight: '80px',
                                                        padding: '8px',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        fontSize: '14px'
                                                    }}
                                                        disabled={submitting || submissionStatus?.status === 'submitted'}
                                                    />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : null}

                            {/* Submit Button */}
                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <button
                                    onClick={() => handleAssignmentSubmit(currentAssignment)}
                                    disabled={submitting || submissionStatus?.status === 'submitted'}
                                    style={{
                                        padding: '12px 30px',
                                        backgroundColor: submitting ? '#6c757d' : '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: submitting || submissionStatus?.status === 'submitted' ? 'not-allowed' : 'pointer',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {submitting ? 'Submitting...' : submissionStatus?.status === 'submitted' ? 'Already Submitted' : 'Submit Assignment'}
                                </button>
                            </div>
                        </div>
                    ) : (
                            <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '4px', textAlign: 'center' }}>
                                <h4 style={{ color: '#28a745', margin: '0 0 10px 0' }}>✓ Assignment Graded</h4>
                                <p style={{ margin: '0', color: '#666' }}>
                                    Score: <strong>{submissionStatus.score}/{submissionStatus.maxPoints}</strong>
                                </p>
                                {submissionStatus.feedback && (
                                    <div style={{ marginTop: '15px', textAlign: 'left' }}>
                                        <strong>Teacher Feedback:</strong>
                                        <p style={{ margin: '5px 0 0 0', color: '#666', fontStyle: 'italic' }}>
                                            {submissionStatus.feedback}
                                        </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                        <h3>No assignments available</h3>
                </div>
            )}
        </div>
    )
}

export default LessonView
