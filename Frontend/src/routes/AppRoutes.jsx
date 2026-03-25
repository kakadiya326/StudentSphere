import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../pages/Auth/Login'
import ProtectedRoute from './ProtectedRoute'
import StudentDashboard from '../pages/Student/Dashboard'
import TeacherDashboard from '../pages/Teacher/Dashboard'
import TeacherSubjects from '../pages/Teacher/Subjects'
import StudentSubjects from '../pages/Student/Subjects'
import MySubjects from '../pages/Student/MySubjects'

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public */}
                <Route path='/' element={<Login />} />

                {/* Student */}
                <Route
                    path='/student'
                    element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/student/subjects'
                    element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <StudentSubjects />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/student/mySubjects'
                    element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <MySubjects />
                        </ProtectedRoute>
                    }
                />




                {/* Teacher */}
                <Route
                    path='/teacher'
                    element={
                        <ProtectedRoute allowedRoles={['teacher']}>
                            <TeacherDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/teacher/subjects"
                    element={
                        <ProtectedRoute allowedRoles={["teacher"]}>
                            <TeacherSubjects />
                        </ProtectedRoute>
                    }
                />

                {/* Unauthorized */}
                <Route path='/Unauthorized' element={<h1>Access Denied</h1>} />

            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes