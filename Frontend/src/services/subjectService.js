import api from "./api"

export const createSubject = (data) => {
    return api.post("/teacher/subject", data);
}

export const getSubjects = () => {
    return api.get("/teacher/subject");
}

export const updateSubject = (newData, subjectID) => {
    return api.put(`/teacher/subject/${subjectID}`);
}

export const deleteSubject = (subjectID) => {
    return api.delete(`/teacher/subject/${subjectID}`);
}

export const getMySubjects = () => {
    return api.get("/teacher/subject");
}