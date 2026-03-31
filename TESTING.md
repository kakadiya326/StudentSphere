# 🧪 StudentSphere Lesson Feature - Testing Guide

Complete testing documentation for the StudentSphere lesson feature.

---

## Quick Start (Choose One)

### 🚀 Option 1: Run Automated Health Check (2 minutes)
```bash
cd d:\vector\StudentSphere
node quick-test.js
```

**What it checks:**
- ✅ Backend server is running
- ✅ Database is connected
- ✅ API routes are available
- ✅ All lesson feature files exist
- ✅ Configuration is valid

**Expected Output:**
```
📊 SANITY CHECK SUMMARY
✅ Passed: 8
❌ Failed: 0
📈 Pass Rate: 100%

🎉 All sanity checks passed! Feature is ready for testing.
```

---

### 🧪 Option 2: Run Unit Tests (5 minutes)

#### Frontend Component Logic Tests
```bash
cd d:\vector\StudentSphere\Backend
node tests/component.test.js
```

**Tests:**
- Calculate submission status & progress
- Due date logic (overdue detection, days until due)
- File type and size validation
- Assignment answer validation
- Status badge color logic

**Expected Output:**
```
✅ Passed: 7
❌ Failed: 0
📈 Pass Rate: 100.00%
```

#### Backend Integration Tests
```bash
cd d:\vector\StudentSphere\Backend
$env:TEST_TOKEN = "your-jwt-token"  # See setup guide
node tests/integration.test.js
```

**Tests:**
- Get lessons by subject
- Get single lesson
- Create lesson
- Get student submissions
- Grade submission
- Reorder lessons
- Mark lesson complete

---

### 📋 Option 3: Manual End-to-End Testing (30-60 minutes)

Complete end-to-end testing of all features, scenarios, and edge cases.

**Full Guide:** [TEST_PLAN.md](./TEST_PLAN.md)

**Setup Guide:** [TEST_DATA_SETUP.md](./TEST_DATA_SETUP.md)

---

## Testing Levels

### Level 1: Smoke Test (5 minutes)
✅ Feature doesn't crash | ✅ Basic UI loads | ✅ No console errors

**Command:**
```bash
node quick-test.js
```

### Level 2: Unit Tests (10 minutes)
✅ Individual functions work correctly | ✅ Business logic is sound | ✅ Edge cases handled

**Command:**
```bash
node tests/component.test.js
```

### Level 3: Integration Tests (15 minutes)
✅ API endpoints respond correctly | ✅ Database operations work | ✅ Error handling works

**Command:**
```bash
node tests/integration.test.js
```

### Level 4: E2E Tests (30-60 minutes)
✅ Complete user workflows | ✅ Cross-feature interactions | ✅ Performance and edge cases

**Guide:** [TEST_PLAN.md](./TEST_PLAN.md)

---

## Test Scenarios Overview

### Core Workflows

#### Teacher Side
- Create lesson with multiple assignments
- Edit lesson details and assignments
- Reorder lessons via drag-and-drop
- Grade student submissions
- View submission files and feedback

#### Student Side
- View lessons with progress tracking
- Submit text assignments
- Upload files for assignments
- Complete quiz assignments
- View grades and feedback
- Track due dates and deadlines

#### Full Workflow
Teacher creates lesson → Student enrolls → Student submits → Teacher grades → Student views grade

---

## Setup Instructions

### Prerequisites
1. **Backend running:** `cd Backend && npm start`
2. **Frontend running:** `cd Frontend && npm run dev`
3. **MongoDB connected:** Check backend logs for connection
4. **Two test accounts:** Follow [TEST_DATA_SETUP.md](./TEST_DATA_SETUP.md)

### Quick Setup (5 minutes)
See [TEST_DATA_SETUP.md](./TEST_DATA_SETUP.md) - "Quick Setup" section

---

## Test Files Location

```
StudentSphere/
├── quick-test.js                    # Automated sanity check
├── TEST_PLAN.md                     # Detailed manual test scenarios
├── TEST_DATA_SETUP.md               # Setup and test data guide
├── TESTING.md                       # This file
├── Backend/
│   ├── tests/
│   │   ├── component.test.js       # Frontend logic unit tests
│   │   └── integration.test.js     # Backend API integration tests
│   ├── uploads/                    # Generated on first file upload
│   └── middleware/
│       └── uploadFile.js           # File upload configuration
├── Frontend/
│   └── src/pages/Student/
│       ├── Lessons.jsx             # Student lesson list view
│       ├── LessonView.jsx          # Student lesson detail view
│       └── Grades.jsx              # Student grades transcript
```

---

## Key Features to Test

### 1. Progress Tracking
- [ ] Overall subject progress % calculates correctly
- [ ] Per-lesson progress bar shows accurate completion
- [ ] Completed/in-progress/not-started colors display correctly
- [ ] Graded count updates after teacher grades

### 2. File Uploads
- [ ] Multiple files can be uploaded (max 10)
- [ ] File size limit enforced (max 50MB total)
- [ ] File type validation works (reject executables)
- [ ] Files served from `/uploads` endpoint
- [ ] MultipartFormData used for upload (not JSON)

### 3. Due Dates & Warnings
- [ ] Overdue assignments show RED
- [ ] Due within 2 days show YELLOW
- [ ] Days remaining calculated correctly
- [ ] Overdue date format clear to students

### 4. Submission Workflow
- [ ] Can submit text assignments
- [ ] Can submit files for assignments
- [ ] Can submit quiz answers
- [ ] Cannot resubmit after submission
- [ ] Form disables after submission

### 5. Grading
- [ ] Teacher can grade submissions
- [ ] Score/feedback saves correctly
- [ ] Student sees grade and feedback
- [ ] Grades update student progress %

### 6. Navigation
- [ ] Previous/Next buttons navigate between assignments
- [ ] Back button preserves state
- [ ] URL changes match current lesson/assignment
- [ ] No data loss when navigating

---

## Common Test Scenarios

### Scenario A: Complete Lesson (15 minutes)
1. Login as student
2. View lesson list → see overall progress
3. Open lesson → see all assignments
4. Submit text assignment
5. Wait for teacher to grade (or do it yourself)
6. View grade in Grades page

### Scenario B: File Upload (10 minutes)
1. Login as student
2. Find file upload assignment
3. Select multiple files
4. Submit
5. Check Network tab for FormData request
6. Login as teacher → view files

### Scenario C: Due Date Warnings (5 minutes)
1. Create assignments with various due dates
2. Look at different assignment due indicators
3. Verify color coding (red/yellow)
4. Check days remaining calculation

### Scenario D: Progress Tracking (5 minutes)
1. View lesson list as student
2. Check overall % and progress bar
3. Check per-lesson % and status
4. Mark an assignment complete
5. Verify % updates

---

## Troubleshooting

### Backend Issues

**"Cannot find module 'multer'"**
```bash
cd Backend
npm install multer
```

**"Connection to database failed"**
- Check MongoDB is running: `mongod` or use MongoDB Atlas connection string in `.env`
- Check `MONGO_URI` in `.env` is correct

**"Port 5000 already in use"**
```bash
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Frontend Issues

**"Cannot load lessonService"**
- Check `Frontend/src/services/lessonService.js` exists
- Check API base URL is `http://localhost:5000` in `Frontend/src/services/api.js`

**"File upload fails silently"**
- Check backend `/uploads` directory exists (create if missing)
- Check multer middleware is imported in `lessonRoute.js`
- Check file size < 50MB
- Check file type is allowed

**"Progress % wrong"**
- Check all assignments have submissions
- Check student is viewing correct lesson
- Try refreshing page (may be caching issue)

### Database Issues

**"Submissions not showing up"**
- Login with correct student account
- Check database has collection `submissions`
- Check submission record has correct `lessonId`

**"Files not found after upload"**
- Check `/uploads` directory for files
- Check file permissions allow reading
- Verify `/uploads` is served via Express static middleware

---

## Test Results Template

Print this and fill in as you test:

```
FEATURE TEST RESULTS - Lesson Feature
Date: ___________
Tester: ___________

Level 1: Smoke Test
[ ] Backend responds
[ ] Frontend loads
[ ] No console errors
Status: __________

Level 2: Unit Tests  
[ ] Component logic correct
[ ] Validation works
[ ] Error cases handled
Status: __________

Level 3: Integration Tests
[ ] API endpoints work
[ ] Database save/load
[ ] File uploads work
Status: __________

Level 4: E2E Tests
[ ] Teacher creates lesson
[ ] Student views lesson
[ ] Student submits assignment  
[ ] Teacher grades
[ ] Student views grade
Status: __________

Additional Notes:
_________________________________________________________________
_________________________________________________________________

Sign-off: ___________ Date: ___________
```

---

## Performance Benchmarks

Target performance metrics:

| Metric             | Target | Acceptable |
| ------------------ | ------ | ---------- |
| Load lesson list   | < 2s   | < 3s       |
| Load lesson detail | < 2s   | < 3s       |
| Submit assignment  | < 3s   | < 5s       |
| Upload 10MB file   | < 5s   | < 10s      |
| View grades page   | < 2s   | < 3s       |

---

## Success Criteria

✅ **All Unit Tests Pass**
```bash
node tests/component.test.js  # Should show 100% pass rate
```

✅ **All Integration Tests Pass**
```bash
node tests/integration.test.js  # Should show 100% pass rate
```

✅ **E2E Tests Complete**
- Minimum: Scenarios A, B, C, D all pass
- Full: All tests in [TEST_PLAN.md](./TEST_PLAN.md) pass

✅ **No Blocking Issues**
- No 500 errors
- No file upload failures
- No lost data after refresh
- Responsive UI (no freezing)

---

## Next Steps

### After Testing Passes

1. **Code Review**
   - Review component logic
   - Review API endpoints
   - Review error handling

2. **Performance Optimization**
   - Profile with DevTools
   - Optimize slow queries
   - Cache lessons data

3. **Security Audit**
   - Validate user permissions
   - Check file upload security
   - Sanitize user inputs

4. **Documentation**
   - Update API docs
   - Create user guide
   - Document edge cases

---

## Contacts & Support

- **Backend Issues:** Check [Backend/README.md](./Backend/)
- **Frontend Issues:** Check [Frontend/README.md](./Frontend/)
- **Test Issues:** Review this guide and [TEST_PLAN.md](./TEST_PLAN.md)

---

**Last Updated:** March 28, 2026  
**Status:** ✅ Ready for Testing  
**Version:** 1.0.0
