import React, { useEffect } from 'react'
import '../styles/global.css'

const Toast = ({ msgText, msgType, clearMessage }) => {
    useEffect(() => {
        if (msgText) {
            const timer = setTimeout(() => clearMessage(), 3000)

            return () => clearTimeout(timer)
        }
    }, [msgText, clearMessage])

    if (!msgText) return null
    return (
        <div className={`toast ${msgType}`}>
            {msgText}
        </div>
    )
}

export default Toast