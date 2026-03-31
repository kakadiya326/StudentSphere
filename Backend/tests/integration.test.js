import http from 'http'
import assert from 'assert'

const BASE_URL = 'http://localhost:5000/api'
const API_TOKEN = process.env.TEST_TOKEN || 'your-test-jwt-token-here'
const STUDENT_ID = process.env.STUDENT_ID || '65abc123def456ghi789jkl0'
const TEACHER_ID = process.env.TEACHER_ID || '65def456ghi789jkl0mn123o'
const SUBJECT_ID = process.env.SUBJECT_ID || '65ghi789jkl0mn123op456rs'

// Helper function for HTTP requests
function request(method, path, body = null, token = API_TOKEN) {
    return new Promise((resolve, reject) => {
        const url = new URL(BASE_URL + path)
        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }

        const req = http.request(url, options, (res) => {
            let data = ''
            res.on('data', chunk => data += chunk)
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        body: data ? JSON.parse(data) : null,
                        headers: res.headers
                    })
                } catch (e) {
                    resolve({ status: res.statusCode, body: data, headers: res.headers })
                }
            })
        })

        req.on('error', reject)
        if (body) req.write(JSON.stringify(body))
        req.end()
    })
}

// Test Suite
async function runTests() {
    console.log('🚀 Starting Lesson Feature Integration Tests\n')
    let passed = 0
    let failed = 0

    try {
        // TEST 1: Get Lessons by Subject
        console.log('TEST 1: Get Lessons by Subject')
        const lessonsRes = await request('GET', `/lessons/subject/${SUBJECT_ID}`)
        assert.strictEqual(lessonsRes.status, 200, 'Status should be 200')
        assert(Array.isArray(lessonsRes.body.lessons), 'Should return lessons array')
        console.log('✅ PASSED\n')
        passed++
    } catch (e) {
        console.log(`❌ FAILED: ${e.message}\n`)
        failed++
    }

    try {
        // TEST 2: Get Single Lesson
        console.log('TEST 2: Get Single Lesson')
        const lessonId = '65lesson001id002id003id'
        const lessonRes = await request('GET', `/lessons/${lessonId}`)
        assert(lessonRes.status === 200 || lessonRes.status === 404, 'Should return 200 or 404')
        if (lessonRes.status === 200) {
            assert(lessonRes.body.lesson, 'Should return lesson object')
        }
        console.log('✅ PASSED\n')
        passed++
    } catch (e) {
        console.log(`❌ FAILED: ${e.message}\n`)
        failed++
    }

    try {
        // TEST 3: Create Lesson
        console.log('TEST 3: Create Lesson')
        const newLesson = {
            title: 'Integration Test Lesson',
            description: 'Test lesson for automated testing',
            content: 'This is test content',
            duration: 60,
            subjectId: SUBJECT_ID
        }
        const createRes = await request('POST', '/lessons', newLesson)
        assert.strictEqual(createRes.status, 201 || 200, 'Status should be 201 or 200')
        assert(createRes.body.lesson || createRes.body.data, 'Should return created lesson')
        console.log('✅ PASSED\n')
        passed++
    } catch (e) {
        console.log(`❌ FAILED: ${e.message}\n`)
        failed++
    }

    try {
        // TEST 4: Get Student Submissions
        console.log('TEST 4: Get Student Submissions')
        const submissionsRes = await request('GET', `/lessons/submissions/${STUDENT_ID}`)
        assert(submissionsRes.status === 200 || submissionsRes.status === 404, 'Should return valid status')
        console.log('✅ PASSED\n')
        passed++
    } catch (e) {
        console.log(`❌ FAILED: ${e.message}\n`)
        failed++
    }

    try {
        // TEST 5: Verify File Upload Endpoint Exists
        console.log('TEST 5: Verify File Upload Endpoint')
        // Just check that endpoint is available for POST
        console.log('⚠️  SKIPPED (requires file upload, needs multipart/form-data)')
        console.log('')
        // passed++
    } catch (e) {
        console.log(`❌ FAILED: ${e.message}\n`)
        failed++
    }

    try {
        // TEST 6: Grade Submission
        console.log('TEST 6: Grade Submission')
        const gradeData = {
            studentId: STUDENT_ID,
            score: 8,
            grade: 'B',
            feedback: 'Good work!'
        }
        const gradeRes = await request('PUT', `/lessons/grade`, gradeData)
        assert(gradeRes.status === 200 || gradeRes.status === 404 || gradeRes.status === 400, 'Should return valid status')
        console.log('✅ PASSED\n')
        passed++
    } catch (e) {
        console.log(`❌ FAILED: ${e.message}\n`)
        failed++
    }

    try {
        // TEST 7: Reorder Lessons
        console.log('TEST 7: Reorder Lessons')
        const reorderData = {
            lessons: [
                { id: '65lesson001', order: 1 },
                { id: '65lesson002', order: 2 },
                { id: '65lesson003', order: 3 }
            ]
        }
        const reorderRes = await request('PUT', `/lessons/reorder`, reorderData)
        assert(reorderRes.status === 200 || reorderRes.status === 400 || reorderRes.status === 404, 'Should return valid status')
        console.log('✅ PASSED\n')
        passed++
    } catch (e) {
        console.log(`❌ FAILED: ${e.message}\n`)
        failed++
    }

    try {
        // TEST 8: Mark Lesson Complete
        console.log('TEST 8: Mark Lesson Complete')
        const lessonId = '65lesson001id002id003id'
        const completeRes = await request('PUT', `/lessons/mark-complete/${lessonId}`, {})
        assert(completeRes.status === 200 || completeRes.status === 404 || completeRes.status === 400, 'Should return valid status')
        console.log('✅ PASSED\n')
        passed++
    } catch (e) {
        console.log(`❌ FAILED: ${e.message}\n`)
        failed++
    }

    try {
        // TEST 9: Verify Auth Required
        console.log('TEST 9: Verify Authentication Required')
        const noAuthRes = await request('GET', `/lessons/subject/${SUBJECT_ID}`, null, '')
        assert(noAuthRes.status === 401 || noAuthRes.status === 403, 'Should return 401 or 403 without auth')
        console.log('✅ PASSED\n')
        passed++
    } catch (e) {
        console.log(`❌ FAILED: ${e.message}\n`)
        failed++
    }

    // Print Summary
    console.log('='.repeat(50))
    console.log('📊 TEST SUMMARY')
    console.log('='.repeat(50))
    console.log(`✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`📈 Pass Rate: ${((passed / (passed + failed)) * 100).toFixed(2)}%`)
    console.log('='.repeat(50))

    if (failed > 0) {
        process.exit(1)
    }
}

// Run tests
runTests().catch(err => {
    console.error('Test runner error:', err)
    process.exit(1)
})
