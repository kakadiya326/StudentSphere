#!/usr/bin/env node

/**
 * Quick Test Data Setup for Lesson Submission Testing
 * Creates a teacher, student, subject, lesson with assignments
 */

// Use local node_modules
const path = require('path')
const modulePath = path.join(__dirname, 'Backend', 'node_modules')

// Set NODE_PATH to include Backend node_modules
process.env.NODE_PATH = modulePath
require('module').Module._initPaths()

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Import models
const User = require('./Backend/models/userModel')
const Teacher = require('./Backend/models/teacherModel')
const Student = require('./Backend/models/studentModel')
const Subject = require('./Backend/models/subjectModel')
const Lesson = require('./Backend/models/lessonModel')

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/studentsphere', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('✅ MongoDB connected')
    } catch (error) {
        console.error('❌ MongoDB connection error:', error)
        process.exit(1)
    }
}

const createTestData = async () => {
    try {
        console.log('\n🚀 Setting up test data for lesson submission...\n')

        // Clear existing test data
        await User.deleteMany({ email: { $in: ['teacher@test.com', 'student@test.com'] } })
        await Teacher.deleteMany({})
        await Student.deleteMany({})
        await Subject.deleteMany({ code: 'TEST101' })
        await Lesson.deleteMany({ title: 'Test Lesson: Introduction to Algorithms' })

        // Create teacher user
        const teacherUser = new User({
            name: 'Test Teacher',
            email: 'teacher@test.com',
            password: await bcrypt.hash('teacher123', 10),
            role: 'teacher'
        })
        await teacherUser.save()
        console.log('✅ Created teacher user')

        // Create teacher profile
        const teacher = new Teacher({
            userId: teacherUser._id,
            qualifications: 'MS Computer Science',
            specialization: 'Data Structures and Algorithms'
        })
        await teacher.save()
        console.log('✅ Created teacher profile')

        // Create student user
        const studentUser = new User({
            name: 'Test Student',
            email: 'student@test.com',
            password: await bcrypt.hash('student123', 10),
            role: 'student'
        })
        await studentUser.save()
        console.log('✅ Created student user')

        // Create student profile
        const student = new Student({
            userId: studentUser._id,
            enrollment: 'TEST2026',
            gradeLevel: '10'
        })
        await student.save()
        console.log('✅ Created student profile')

        // Create subject
        const subject = new Subject({
            name: 'Test Algorithms',
            code: 'TEST101',
            description: 'Introduction to algorithms and data structures',
            teacherId: teacher._id
        })
        await subject.save()
        console.log('✅ Created subject')

        // Enroll student in subject
        student.courseIds.push(subject._id)
        await student.save()
        console.log('✅ Enrolled student in subject')

        // Create lesson with assignments
        const lesson = new Lesson({
            title: 'Test Lesson: Introduction to Algorithms',
            description: 'Learn the basics of algorithms and complexity analysis',
            content: `# Introduction to Algorithms

This lesson covers the fundamental concepts of algorithms including:

## What is an Algorithm?
An algorithm is a step-by-step procedure for solving a problem.

## Time Complexity
- O(1) - Constant time
- O(n) - Linear time
- O(n²) - Quadratic time

## Example Algorithm
\`\`\`python
def find_max(arr):
    max_val = arr[0]
    for num in arr:
        if num > max_val:
            max_val = num
    return max_val
\`\`\`
`,
            subjectId: subject._id,
            order: 1,
            duration: 60,
            assignments: [
                {
                    title: 'Explain Time Complexity',
                    description: 'Write a short explanation of time complexity',
                    type: 'text',
                    instructions: 'Explain what O(n) means with an example. Write at least 100 words.',
                    maxPoints: 10,
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                    isRequired: true
                },
                {
                    title: 'Submit Algorithm Code',
                    description: 'Implement a simple sorting algorithm',
                    type: 'file_upload',
                    instructions: 'Write a Python or Java program that implements bubble sort. Submit the source code file.',
                    maxPoints: 20,
                    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
                    isRequired: true
                },
                {
                    title: 'Algorithm Quiz',
                    description: 'Test your understanding of basic algorithms',
                    type: 'quiz',
                    instructions: 'Answer all questions about algorithm concepts.',
                    questions: [
                        {
                            question: 'What is the time complexity of a simple loop that runs n times?',
                            type: 'multiple_choice',
                            options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'],
                            correctAnswer: 'O(n)',
                            points: 5
                        },
                        {
                            question: 'Explain the difference between O(n) and O(n²) complexity.',
                            type: 'text',
                            points: 10
                        }
                    ],
                    maxPoints: 15,
                    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                    isRequired: true
                }
            ]
        })
        await lesson.save()
        console.log('✅ Created lesson with 3 assignments')

        console.log('\n🎉 Test data setup complete!')
        console.log('\n📋 Test Accounts:')
        console.log('Teacher: teacher@test.com / teacher123')
        console.log('Student: student@test.com / student123')
        console.log('\n📚 Test Subject: Test Algorithms (TEST101)')
        console.log('📖 Test Lesson: Test Lesson: Introduction to Algorithms')
        console.log('\n📝 Assignments:')
        console.log('1. Text Assignment: Explain Time Complexity (10 points)')
        console.log('2. File Upload: Submit Algorithm Code (20 points)')
        console.log('3. Quiz: Algorithm Quiz (15 points)')
        console.log('\n🚀 You can now test the lesson submission feature!')

    } catch (error) {
        console.error('❌ Error setting up test data:', error)
    } finally {
        mongoose.connection.close()
    }
}

// Run the setup
connectDB().then(createTestData)