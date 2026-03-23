import React, { useEffect, useState } from 'react'
import { createSubject, getSubjects } from '../../services/subjectService';
import Toast from '../../components/Toast';

const Subjects = () => {
  const [form, setForm] = useState({
    name: "",
    code: ""
  })

  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const fetchSubjects = async () => {
    try {
      const res = await getSubjects()
      setSubjects(res.data.subjects)
    } catch {
      setMessage("Failed to load subjects");
      setType("error");
    }
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let res = await createSubject(form);

      setMessage(res.data.success||res.data.error);
      setType(res.data.success?"success":"error");
      setForm({ name: "", code: "" })
      fetchSubjects();
    } catch {
      setMessage("Failed to add subject")
      setType("error")
    }
  }
  return (
    <div>
      <h2>Subjects</h2>
      <Toast
        msgText={message}
        msgType={type}
        clearMessage={() => setMessage("")}
      />

      <form method='post' onSubmit={handleSubmit}>
        <input type="text" name='name' placeholder='Subject Name' value={form.name} onChange={handleChange} />
        <input type="text" name='code' placeholder='Subject Code' value={form.code} onChange={handleChange} />
        <button type='submit'>Add Subject</button>
      </form>

      {/* Subject List */}
      <ul>
        {
          subjects.map((subject) => (
            <li key={subject._id}>{subject.name} - {subject.code}</li>
          ))
        }
      </ul>
    </div>
  )
}

export default Subjects