import api from "./api"

export const createLesson = (data) => {
    return api.post("/teacher/lessons", data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const getLessonsBySubject = (subjectId) => {
    return api.get(`/student/lessons/subject/${subjectId}`);
}

export const getTeacherLessonsBySubject = (subjectId) => {
    return api.get(`/teacher/lessons/subject/${subjectId}`);
}

export const getLesson = (lessonId) => {
    return api.get(`/teacher/lessons/${lessonId}`);
}

export const updateLesson = (lessonId, data) => {
    return api.put(`/teacher/lessons/${lessonId}`, data);
}

export const deleteLesson = (lessonId) => {
    return api.delete(`/teacher/lessons/${lessonId}`);
}

export const reorderLessons = (data) => {
    return api.put("/teacher/lessons/reorder", data);
}

// Assignment management
export const addAssignmentToLesson = (lessonId, assignmentData) => {
    return api.post(`/teacher/lessons/${lessonId}/assignments`, assignmentData);
}

export const updateAssignment = (lessonId, assignmentIndex, data) => {
    return api.put(`/teacher/lessons/${lessonId}/assignments/${assignmentIndex}`, data);
}

// Student submissions
export const submitAssignment = (data) => {
    const formData = new FormData()
    formData.append('lessonId', data.lessonId)
    formData.append('assignmentIndex', data.assignmentIndex)

    if (data.files && data.files.length > 0) {
        // Add files to form data
        data.files.forEach((file) => {
            formData.append('files', file)
        })
    } else {
        // For text and quiz, send answers as JSON
        formData.append('answers', JSON.stringify(data.answers || []))
        if (data.textSubmission) {
            formData.append('textSubmission', data.textSubmission)
        }
    }

    return api.post("/student/submit", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const getStudentSubmissions = (lessonId) => {
    return api.get(`/student/${lessonId}/submissions/student`);
}

export const getAllStudentSubmissions = () => {
    return api.get('/student/submissions/all');
}

export const getSubmissionsForLesson = (lessonId) => {
    return api.get(`/student/${lessonId}/submissions`);
}

export const gradeSubmission = (submissionId, data) => {
    return api.put(`/teacher/lessons/submissions/${submissionId}/grade`, data);
}

export const markLessonComplete = (data) => {
    return api.post("/teacher/lessons/complete", data);
}