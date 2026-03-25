import api from "./api"

export const getAllSubjects = () => {
    return api.get("/student/subjects")
}

export const enrollSubject = (courseId) => {
    return api.put("/student/enroll", { courseId })
}

export const getMySubjects = () => {
    return api.get("/student/mysubjects")
}

export const updateProgress = (data) => {
    return api.post("/student/progress", data)
}
