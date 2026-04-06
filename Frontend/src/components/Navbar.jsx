import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserFromToken } from '../utils/auth'
import '../styles/Navbar.css'

const Navbar = () => {
    const navigate = useNavigate()
    const user = getUserFromToken()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand" onClick={() => navigate('/')}>
                📚 StudentSphere
            </div>
            <div className="navbar-nav">
                {!user ? (
                    <>
                        <button className="nav-link" onClick={() => navigate('/')}>
                            Login
                        </button>
                        <button className="nav-link btn-secondary" onClick={() => navigate('/register')}>
                            Sign Up
                        </button>
                    </>
                ) : (
                    <>
                        {/* Student Navigation */}
                        {user.role === 'student' && (
                                <>
                                    <button className="nav-link" onClick={() => navigate('/student')}>
                                    Dashboard
                                </button>
                                    <button className="nav-link" onClick={() => navigate('/student/subjects')}>
                                    Subjects
                                </button>
                                    <button className="nav-link" onClick={() => navigate('/student/grades')}>
                                    📊 Grades
                                </button>
                                    <button className="nav-link" onClick={() => navigate('/student/profile')}>
                                    Profile
                                </button>
                                </>
                        )}

                        {/* Teacher Navigation */}
                        {user.role === 'teacher' && (
                                <>
                                    <button className="nav-link" onClick={() => navigate('/teacher')}>
                                    Dashboard
                                </button>
                                    <button className="nav-link" onClick={() => navigate('/teacher/subjects')}>
                                    Subjects
                                </button>
                                    <button className="nav-link" onClick={() => navigate('/teacher/myprofile')}>
                                    Profile
                                </button>
                                </>
                        )}

                            <div className="nav-divider"></div>
                            <div className="user-info">
                                <span className="user-name">👤 {user.name || user.email}</span>
                                <span className="user-role">{user.role}</span>
                            </div>
                            <button className="btn-logout" onClick={handleLogout}>
                                Logout
                            </button>
                    </>
                )}
            </div>
            {/* Mobile Menu Toggle */}
            {user && (
                <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                    ☰
                </button>
            )}
            {/* Mobile Menu */}
            {user && (
                <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                    <div className="navbar-nav">
                        {/* Student Navigation */}
                        {user.role === 'student' && (
                            <>
                                <button className="nav-link" onClick={() => { navigate('/student'); setIsMobileMenuOpen(false); }}>
                                    Dashboard
                                </button>
                                <button className="nav-link" onClick={() => { navigate('/student/subjects'); setIsMobileMenuOpen(false); }}>
                                    Subjects
                                </button>
                                <button className="nav-link" onClick={() => { navigate('/student/grades'); setIsMobileMenuOpen(false); }}>
                                    📊 Grades
                                </button>
                                <button className="nav-link" onClick={() => { navigate('/student/profile'); setIsMobileMenuOpen(false); }}>
                                    Profile
                                </button>
                            </>
                        )}

                        {/* Teacher Navigation */}
                        {user.role === 'teacher' && (
                            <>
                                <button className="nav-link" onClick={() => { navigate('/teacher'); setIsMobileMenuOpen(false); }}>
                                    Dashboard
                                </button>
                                <button className="nav-link" onClick={() => { navigate('/teacher/subjects'); setIsMobileMenuOpen(false); }}>
                                    Subjects
                                </button>
                                <button className="nav-link" onClick={() => { navigate('/teacher/myprofile'); setIsMobileMenuOpen(false); }}>
                                    Profile
                                </button>
                            </>
                        )}

                        <div className="nav-divider"></div>
                        <div className="user-info">
                            <span className="user-name">👤 {user.name || user.email}</span>
                            <span className="user-role">{user.role}</span>
                        </div>
                        <button className="btn-logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar