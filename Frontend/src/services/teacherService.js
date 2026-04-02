import api from "./api"

export const getTeacherProfile = () => {
    return api.get("/teacher/profile/")
}

export const updateTeacherProfile = (data) => {
    return api.put("/teacher/profile/", data)
}