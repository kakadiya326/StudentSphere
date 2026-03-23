import api from "./api"

export const createSubject = (data) => {
    return api.post("/admin/subject", data);
}

export const getSubjects = () => {
    return api.get("/admin/subjects");
}

export const updateSubject = (newData, subjectID) => {
    return api.put(`/admin/subjects/${subjectID}`);
}

export const deleteSubject = (subjectID) => {
    return api.delete(`/admin/subjects/${subjectID}`);
}

export const getMySubjects = () => {
    return api.get("/admin/subject");
}