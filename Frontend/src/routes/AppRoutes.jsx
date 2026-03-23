import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../pages/Auth/Login'
import ProtectedRoute from './ProtectedRoute'
import StudentDashboard from '../pages/Student/Dashboard'
import TeacherDashboard from '../pages/Teacher/Dashboard'
import Subjects from '../pages/Teacher/Subjects'

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
                            <Subjects />
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