import React, { useEffect, useState } from 'react'
import { enrollSubject, getAllSubjects } from '../../services/studentService'
import Toast from '../../components/Toast'

const Subjects = () => {
    const [subjects, setSubjects] = useState([])
    const [message, setMessage] = useState("")
    const [type, setType] = useState("")

    const fetchSubjects = async () => {
        try {
            const res = await getAllSubjects()
            setSubjects(res.data.subjects)

        } catch (error) {
            setMessage("Failed to load subjects")
            setType("error")
        }
    }

    useEffect(() => {
        fetchSubjects()
    }, [])

    const handleEnroll = async (id) => {
        try {
            await enrollSubject(id)

            setMessage("Enrolled successfully")
            setType("success")
        } catch (error) {
            console.log(error);
            setMessage("Enrollment failed")
            setType("error")
        }
    }
    return (
        <div>
            <h2>Available Subjects</h2>
            <Toast
                msgText={message}
                msgType={type}
                clearMessage={() => setMessage("")}
            />
            <ul>
                {subjects.map((subject) => (
                    <li key={subject._id}>
                        {subject.name}-{subject.code}
                        <button onClick={() => handleEnroll(subject._id)}>
                            Enroll
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Subjects