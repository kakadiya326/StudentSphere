# Test Data Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create Test Accounts

#### Teacher Account
1. Open frontend at `http://localhost:5173`
2. Click "Register"
3. Fill form:
   - Name: `Test Teacher`
   - Email: `teacher@test.com`
   - Password: `teacher123`
4. Complete profile:
   - Qualifications: `MS Computer Science`
   - Specialization: `Data Structures`
5. Mark as "Teacher" role

#### Student Account
1. Register new account:
   - Name: `Test Student`
   - Email: `student@test.com`
   - Password: `student123`
2. Complete profile:
   - Grade Level: `10`
3. Keep as "Student" role

---

### Step 2: Create Test Subject

**Login as Teacher**

1. Go to Dashboard → Create Subject
2. Fill form:
   - Name: `Test Algorithms`
   - Code: `CS101`
   - Description: `Basic algorithm concepts and complexity analysis`
3. Click "Create"

---

### Step 3: Enroll Student

**Still logged in as Teacher**

1. Go to Subject → Manage Enrollment
2. Search for "Test Student"
3. Click "Enroll"

---

### Step 4: Create Test Lesson with Assignments

**As Teacher, in Test Algorithms subject:**

1. Click "Create Lesson"
2. Fill form:
   - Title: `Lesson 1: Introduction to Big O`
   - Description: `Understanding time and space complexity`
   - Content: `
     # Big O Notation
     Big O notation is a mathematical notation used to describe the performance of an algorithm.
     
     ## Common Complexities:
     - O(1) - Constant time
     - O(n) - Linear time
     - O(n²) - Quadratic time
     - O(log n) - Logarithmic time
     - O(n log n) - Linearithmic time
     
     ## Example:
     A simple loop counting elements is O(n) because it visits each element once.
     `
   - Duration: `60`
3. Click "Save"

**Add Assignment 1 - Text**

1. Click "Edit" on the lesson
2. Click "Add Assignment"
3. Fill:
   - Type: `Text/Essay`
   - Name: `Explain Big O Notation`
   - Instructions: `Provide a detailed explanation of Big O notation with at least 2 examples`
   - Due Date: Tomorrow
   - Points: `10`
4. Save

**Add Assignment 2 - File Upload**

1. Click "Add Assignment"
2. Fill:
   - Type: `File Upload`
   - Name: `Submit Algorithm Implementation`
   - Instructions: `Write and submit a Python or Java program demonstrating sorting algorithm`
   - Due Date: 5 days from now
   - Points: `20`
3. Save

**Add Assignment 3 - Quiz** (Optional)

1. Click "Add Assignment"
2. Fill:
   - Type: `Quiz`
   - Name: `Big O Quiz`
   - Questions:
     ```
     Q1: What is the time complexity of binary search?
     A) O(n)
     B) O(log n)  ← CORRECT
     C) O(n²)
     D) O(1)
     
     Q2: Bubble sort has what complexity?
     A) O(n)
     B) O(n log n)
     C) O(n²)     ← CORRECT
     D) O(log n)
     
     Q3: Which is NOT a Big O complexity class?
     A) O(n!)    ← CORRECT
     B) O(n²)
     C) O(log n)
     D) O(n)
     ```
   - Points: `15`
3. Save

---

### Step 5: Create Second Lesson

**Repeat Step 4 to create "Lesson 2: Sorting Algorithms"**

This allows testing of multiple lessons, progress tracking, and navigation.

---

## Test Data Environment Variables

Create `.env.test` file in Backend directory:

```env
# Test Database (use separate test DB)
MONGO_URI=mongodb://localhost:27017/studentsphere_test

# Test User IDs (retrieve after creating test accounts)
TEACHER_ID=65abc123def456ghi789jkl0
STUDENT_ID=65def456ghi789jkl0mn123o
SUBJECT_ID=65ghi789jkl0mn123op456rs
LESSON_ID=65jkl0mn123op456rs1234jk

# Test JWT Token (get from browser localStorage after login)
TEST_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Test Configuration
NODE_ENV=test
```

### Getting Test IDs and Token

1. **Get Teacher ID & Token:**
   - Login as teacher
   - Open DevTools (F12) → Console
   - Run: `localStorage.getItem('auth_token')`
   - Copy token to `.env.test`
   - Run: `localStorage.getItem('user_id')`
   - Copy to `TEACHER_ID`

2. **Get Student ID:**
   - Logout, login as student
   - Run: `localStorage.getItem('user_id')`
   - Copy to `STUDENT_ID`

3. **Get Lesson & Subject IDs:**
   - In DevTools Network tab, create lesson
   - Find POST `/api/lessons` response
   - Copy `_id` from response to `LESSON_ID`
   - Similarly get `SUBJECT_ID` from subject creation response

---

## Test Data File Samples

### For File Upload Assignment Testing

Create these test files in a `test-uploads/` folder:

**1. test-solution.pdf** (500KB)
- Use any existing PDF or create blank one

**2. solution.py** (Text file)
```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr
```

**3. solution.zip** (containing multiple files)
- Zip the Python and PDF files

---

## Database Cleanup

### Reset Test Database

**For Development (safe):**

```bash
# In MongoDB CLI
use studentsphere_test
db.dropDatabase()
```

**Or via Node:**

```javascript
// scripts/reset-test-db.js
const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/studentsphere_test'

mongoose.connect(MONGO_URI).then(async () => {
  await mongoose.connection.db.dropDatabase()
  console.log('✅ Test database cleared')
  process.exit(0)
})
```

Run: `node scripts/reset-test-db.js`

---

## Running Tests

### Frontend: Run E2E Tests Manually

Use the [TEST_PLAN.md](../TEST_PLAN.md) for step-by-step manual testing.

### Backend: Run Unit Tests

```bash
cd Backend
node tests/component.test.js
```

Expected output:
```
TEST 1: Calculate Submission Status
✅ PASSED

TEST 2: Calculate Due Date Status
✅ PASSED
...
📊 TEST SUMMARY
✅ Passed: 7
❌ Failed: 0
📈 Pass Rate: 100.00%
```

### Backend: Run Integration Tests

```bash
# First set environment variables
$env:TEST_TOKEN = "your-jwt-token"
$env:STUDENT_ID = "student-id"
$env:TEACHER_ID = "teacher-id"
$env:SUBJECT_ID = "subject-id"

# Run tests
node tests/integration.test.js
```

---

## Test Scenarios Matrix

| Scenario         | User    | Precondition          | Expected            | Status |
| ---------------- | ------- | --------------------- | ------------------- | ------ |
| View lessons     | Student | Enrolled in subject   | See progress card   | ⬜      |
| Submit text      | Student | Assignment exists     | Toast success       | ⬜      |
| Submit file      | Student | File < 50MB           | Multipart upload    | ⬜      |
| View grades      | Student | Has submissions       | See stats & history | ⬜      |
| Create lesson    | Teacher | Subject exists        | Lesson appears      | ⬜      |
| Reorder lessons  | Teacher | 2+ lessons exist      | Order changes       | ⬜      |
| Grade submission | Teacher | Submission exists     | Score saved         | ⬜      |
| Check due dates  | Student | Assignment due soon   | Color warnings      | ⬜      |
| Disable resubmit | Student | Already submitted     | Buttons disabled    | ⬜      |
| Upload limits    | Student | Large file/many files | Error messages      | ⬜      |

Mark with ✅ as you complete each test.

---

## Troubleshooting

### Issue: "Failed to load lessons"
- Check backend is running (`npm start` in Backend folder)
- Check MongoDB is connected
- Check student has valid auth token
- Check student is enrolled in subject

### Issue: File upload fails
- Check backend has `/uploads` directory created: `mkdir Backend/uploads`
- Check multer middleware is properly configured in `lessonRoute.js`
- Check file < 50MB and allowed type
- Check `Content-Type: multipart/form-data` in request

### Issue: Grade doesn't appear in student view
- Refresh page to clear cache
- Check teacher saved grade (not just entered)
- Check submission status is "graded" in database

### Issue: Progress percentage wrong
- Check all submissions have correct status
- Check assignment count matches lesson
- Try refreshing page
- Check browser console for errors

