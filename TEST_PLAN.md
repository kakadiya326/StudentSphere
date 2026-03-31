# StudentSphere Lesson Feature - End-to-End Test Plan

## Overview
Complete testing of the lesson management system for both teacher and student roles.

---

## Test Environment Setup

### Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5173`
- MongoDB connected
- Two test user accounts:
  - **Teacher Account**: email: `teacher@test.com` | password: `teacher123`
  - **Student Account**: email: `student@test.com` | password: `student123`

### Setup Steps
1. Create teacher account via Register page
2. Mark user as teacher during profile completion
3. Create student account via Register page  
4. Create test subject (teacher)
5. Enroll student in test subject

---

## Test Scenarios

### 1. TEACHER LESSON CREATION & MANAGEMENT

#### Test 1.1: Create New Lesson
**Objective**: Verify teacher can create a new lesson with all fields

**Steps**:
1. Login as teacher
2. Navigate to Dashboard → Subjects
3. Click on a subject
4. Click "Create Lesson" button
5. Fill in form:
   - Title: "Lesson 1: Introduction to Algorithms"
   - Description: "Basic concepts and complexity analysis"
   - Content: "Big O notation, time and space complexity..."
   - Duration: 60 minutes
6. Click "Save Lesson"

**Expected Results**:
- ✅ Lesson appears in subject's lesson list
- ✅ Lesson displays correct title, description, and duration
- ✅ Toast shows "Lesson created successfully"
- ✅ Lesson count updates

---

#### Test 1.2: Edit Existing Lesson
**Objective**: Verify teacher can edit lesson details

**Steps**:
1. From lesson list, click Edit button on an existing lesson
2. Modify title: "Lesson 1: Algorithms & Complexity (Revised)"
3. Modify duration: "75 minutes"
4. Click "Save Changes"

**Expected Results**:
- ✅ Lesson list updates with new title
- ✅ Duration changes to 75 minutes
- ✅ No duplicate lessons created

---

#### Test 1.3: Add Assignments to Lesson
**Objective**: Verify teacher can add multiple assignment types

**Steps**:
1. Click on a lesson to open lesson editor
2. Add Assignment 1 - Text:
   - Type: Text/Essay
   - Name: "Explain Big O Notation"
   - Instructions: "Provide detailed explanation with examples"
   - Due Date: 3 days from today
   - Points: 10
3. Add Assignment 2 - File Upload:
   - Type: File Upload
   - Name: "Submit Code Solution"
   - Instructions: "Upload your code in ZIP or PDF format"
   - Due Date: 7 days from today
   - Points: 20
4. Add Assignment 3 - Quiz:
   - Type: Quiz
   - Name: "Complexity Quiz"
   - Questions: [Create 3-5 questions with options]
   - Points: 15
5. Save lesson

**Expected Results**:
- ✅ All 3 assignments appear in lesson
- ✅ Correct assignment types display with icons
- ✅ Points and due dates are correct
- ✅ Order is preserved

---

#### Test 1.4: Reorder Lessons Using Drag-and-Drop
**Objective**: Verify drag-and-drop reordering works

**Steps**:
1. On Teacher Lessons page, see lessons list
2. Drag lesson 3 and drop it between lesson 1 and 2
3. Refresh page

**Expected Results**:
- ✅ Lesson order changes immediately during drag
- ✅ Order persists after page refresh
- ✅ API call shows new order was saved (check Network tab)

---

### 2. STUDENT LESSON VIEWING & PROGRESS TRACKING

#### Test 2.1: View Lesson List with Progress
**Objective**: Verify student sees correct progress tracking

**Steps**:
1. Login as student
2. Navigate to Subjects
3. Click on enrolled subject
4. View Lessons page

**Expected Results**:
- ✅ "Subject Progress" card shows overall completion %
- ✅ Progress bar fills proportionally
- ✅ Statistics show: X/Y total assignments, Z graded, W pending
- ✅ Each lesson card displays:
  - Lesson icon (📖, 📚, or 🎉 based on status)
  - Title and description
  - X/Y assignments completed
  - Duration in minutes
  - Status badge (⏳ START, 🔄 IN PROGRESS, or ✅ COMPLETED)
  - Completion percentage
- ✅ Color coding: gray (not started), yellow (in progress), green (completed)

---

#### Test 2.2: View Lesson Details
**Objective**: Verify student can view lesson content

**Steps**:
1. Click on a lesson card
2. View lesson content

**Expected Results**:
- ✅ Lesson title displays
- ✅ Full lesson content visible
- ✅ Toggle button to hide/show content works
- ✅ Assignments section shows all assignments
- ✅ Each assignment displays: type, name, instructions, due date, points

---

#### Test 2.3: Submit Text Assignment
**Objective**: Verify text/essay submission works

**Steps**:
1. Open a text assignment
2. Enter answer: "Lorem ipsum dolor sit amet..."
3. Click "Submit Assignment"

**Expected Results**:
- ✅ Toast shows "Assignment submitted successfully"
- ✅ Submit button becomes disabled
- ✅ Status changes to "Submitted" with checkmark
- ✅ Assignment count updates in lesson card

---

#### Test 2.4: Submit File Assignment
**Objective**: Verify file upload and multipart handling

**Steps**:
1. Open a file upload assignment
2. Click "Choose Files"
3. Select 2-3 PDF or text files
4. Verify file list shows before submission
5. Click "Submit Assignment"

**Expected Results**:
- ✅ Files appear in upload preview with names and icons
- ✅ Total file size displays (should be < 50MB)
- ✅ Toast shows "Files uploaded successfully"
- ✅ Status changes to "Submitted"
- ✅ Network tab shows FormData multipart upload (not JSON)
- ✅ No errors about file type restrictions

---

#### Test 2.5: Submit Quiz Assignment
**Objective**: Verify quiz submission

**Steps**:
1. Open a quiz assignment
2. See quiz questions with multiple choice options
3. Select answer for each question
4. Click "Submit Quiz"

**Expected Results**:
- ✅ All questions display with radio buttons
- ✅ Cannot submit without answering all questions
- ✅ Toast shows "Quiz submitted"
- ✅ Quiz marked as submitted
- ✅ (Optional) If auto-grading: score displays immediately

---

#### Test 2.6: View Due Date Warnings
**Objective**: Verify due date urgency indicators

**Steps**:
1. View lesson with multiple assignments:
   - Assignment A due in 1 day
   - Assignment B due in 3 days
   - Assignment C due in 10 days
2. Look at due date indicators

**Expected Results**:
- ✅ Overdue assignments: RED text, "Overdue"
- ✅ Due within 2 days: YELLOW text, "Due in X days"
- ✅ Due in > 2 days: GRAY text, "Due in X days"
- ✅ X calculation is accurate

---

#### Test 2.7: Navigate Between Assignments
**Objective**: Verify Previous/Next navigation

**Steps**:
1. Open lesson with 3+ assignments
2. View first assignment
3. Click "Next Assignment"
4. Verify second assignment loads
5. Click "Previous Assignment"
6. Verify back to first assignment

**Expected Results**:
- ✅ Assignments load correctly with correct data
- ✅ Navigation buttons enable/disable appropriately
- ✅ Current assignment index updates
- ✅ No data loss when navigating

---

### 3. TEACHER GRADING & FEEDBACK

#### Test 3.1: View Student Submissions
**Objective**: Verify teacher can see all student submissions

**Steps**:
1. Login as teacher
2. Navigate to Dashboard → Subjects
3. Click "View Submissions" on a lesson
4. Go to "Assignment Grading" view

**Expected Results**:
- ✅ List shows all students who submitted
- ✅ Each submission shows:
  - Student name
  - Submission date/time
  - Status (submitted, graded)
  - Previous grade (if exists)
- ✅ Submissions for each assignment separate

---

#### Test 3.2: Grade Text Submission
**Objective**: Verify grading text/essay assignments

**Steps**:
1. Click on a text submission
2. See student's answer
3. Assign score: 8/10
4. Add feedback: "Good explanation, but missing examples"
5. Click "Save Grade"

**Expected Results**:
- ✅ Submission content displays correctly
- ✅ Grade input accepts only numbers ≤ max points
- ✅ Feedback textarea works
- ✅ Toast shows "Grade saved"
- ✅ Submission status changes to "Graded"

---

#### Test 3.3: Review File Submission
**Objective**: Verify file submissions can be reviewed

**Steps**:
1. Click on a file upload submission
2. See uploaded files list

**Expected Results**:
- ✅ Files display with names, sizes, and upload times
- ✅ File icons show file type (PDF, Word, ZIP, etc.)
- ✅ File links work (either download or preview)
- ✅ Files served from `/uploads` endpoint

---

#### Test 3.4: Grade Multiple Submissions
**Objective**: Verify workflow for grading multiple submissions

**Steps**:
1. On Assignment Grading page, grade 3 student submissions
2. For each: add score, feedback, save
3. Go back to lesson list

**Expected Results**:
- ✅ All grades save without interference
- ✅ Grading count updates ("3/5 graded")
- ✅ Already graded submissions show previous scores

---

### 4. STUDENT GRADES & TRANSCRIPT

#### Test 4.1: View Grades Page
**Objective**: Verify student can access grade history

**Steps**:
1. Login as student
2. Click "Grades" in navbar

**Expected Results**:
- ✅ Page loads with statistics cards:
  - Total Submissions
  - Graded Submissions
  - Pending Submissions
  - Overall %
- ✅ Progress bar shows earned/total points and percentage
- ✅ Filter tabs: All, Pending, Graded

---

#### Test 4.2: Filter Grades
**Objective**: Verify grade filtering works

**Steps**:
1. On Grades page, click "Pending" tab
2. Verify only ungraded submissions show
3. Click "Graded" tab
4. Verify only graded submissions show
5. Click "All" tab
6. Verify all submissions show

**Expected Results**:
- ✅ Each tab filters correctly
- ✅ Submission count updates in statistics
- ✅ No submissions incorrectly hidden

---

#### Test 4.3: View Submission Details with Feedback
**Objective**: Verify student can see detailed feedback

**Steps**:
1. On Grades page, click on a graded submission
2. Modal opens showing:
   - Student's answer/submission
   - Teacher's score
   - Teacher's feedback
   - Submission date

**Expected Results**:
- ✅ All information displays correctly
- ✅ Feedback text shows with proper formatting
- ✅ Score displayed with max points (e.g., "8/10")
- ✅ Modal can be closed by clicking X or outside modal

---

### 5. ERROR HANDLING & EDGE CASES

#### Test 5.1: File Upload Size Validation
**Objective**: Verify file size limits enforced

**Steps**:
1. Try to upload a file > 50MB
2. Try to upload > 10 files

**Expected Results**:
- ✅ Error message: "File size exceeds 50MB limit"
- ✅ Error message: "Maximum 10 files allowed"
- ✅ Upload prevented

---

#### Test 5.2: File Type Validation  
**Objective**: Verify only allowed file types accepted

**Steps**:
1. Try to upload: .exe, .bat, .sh, or other executable
2. Try to upload: .pdf, .docx, .txt, .jpg (allowed types)

**Expected Results**:
- ✅ Executable rejected: "File type not allowed"
- ✅ Allowed types accepted
- ✅ Clear error messages

---

#### Test 5.3: Network Error Handling
**Objective**: Verify graceful error handling

**Steps**:
1. Stop backend server
2. On student page, try to submit assignment
3. Restart backend

**Expected Results**:
- ✅ Error toast shows: "Failed to submit assignment. Please try again."
- ✅ Form not disabled permanently
- ✅ Can retry after backend restarts

---

#### Test 5.4: Concurrent Submissions
**Objective**: Verify no double-submission bugs

**Steps**:
1. Open assignment in two browser tabs
2. In tab 1, submit assignment and click submit button rapidly
3. In tab 2, also submit

**Expected Results**:
- ✅ Only one submission recorded
- ✅ No duplicate submissions in grading view
- ✅ Second attempt shows error or is ignored

---

#### Test 5.5: Re-submission Prevention
**Objective**: Verify students cannot resubmit after submission

**Steps**:
1. Submit an assignment
2. Wait for teacher to grade it
3. Refresh page
4. Check if form fields are disabled

**Expected Results**:
- ✅ Assignment shows as "Submitted"
- ✅ Form fields are disabled (greyed out)
- ✅ Cannot modify answer after submission

---

### 6. DATA PERSISTENCE & SYNC

#### Test 6.1: Page Refresh After Submission
**Objective**: Verify data persists after refresh

**Steps**:
1. Submit an assignment
2. Refresh page (Ctrl+R)
3. Check status

**Expected Results**:
- ✅ Submission still shows as "Submitted"
- ✅ Score/feedback still displays if graded
- ✅ No data loss

---

#### Test 6.2: Navigation and Back Button
**Objective**: Verify smooth navigation and state preservation

**Steps**:
1. View lesson
2. Navigate to Grades page
3. Use browser back button
4. Return to lesson

**Expected Results**:
- ✅ All data reloads correctly
- ✅ No console errors
- ✅ Progress percentages match

---

#### Test 6.3: Cross-tab Synchronization
**Objective**: Verify consistency across tabs

**Steps**:
1. Open Lessons in tab 1
2. Open Grades page in tab 2
3. In tab 1, submit an assignment
4. Switch to tab 2 and refresh

**Expected Results**:
- ✅ Tab 2 shows updated statistics
- ✅ New submission appears in grades list

---

### 7. PERFORMANCE & LOAD

#### Test 7.1: Large Lesson Load
**Objective**: Verify performance with many lessons

**Steps**:
1. Create 20+ lessons in one subject
2. Navigate to student lesson list

**Expected Results**:
- ✅ Page loads in < 3 seconds
- ✅ All lessons display correctly
- ✅ No layout shifts or jank
- ✅ Scrolling smooth

---

#### Test 7.2: Many Assignments
**Objective**: Verify performance with many assignments

**Steps**:
1. Create lesson with 50+ assignments
2. Open lesson view
3. Navigate through assignments with Previous/Next

**Expected Results**:
- ✅ Navigation between assignments is fast
- ✅ UI responsive
- ✅ No memory leaks (check DevTools)

---

#### Test 7.3: Large File Upload
**Objective**: Verify upload handling with large files

**Steps**:
1. Upload file(s) totaling 40-45MB (but under 50MB limit)
2. Monitor Network tab for upload progress

**Expected Results**:
- ✅ Upload completes successfully
- ✅ Multipart FormData request visible in Network tab
- ✅ File saved on backend
- ✅ Progress indication if available

---

## Test Checklist

- [ ] Test 1.1: Create New Lesson
- [ ] Test 1.2: Edit Existing Lesson  
- [ ] Test 1.3: Add Assignments
- [ ] Test 1.4: Reorder Lessons
- [ ] Test 2.1: View Lesson List with Progress
- [ ] Test 2.2: View Lesson Details
- [ ] Test 2.3: Submit Text Assignment
- [ ] Test 2.4: Submit File Assignment
- [ ] Test 2.5: Submit Quiz Assignment
- [ ] Test 2.6: View Due Date Warnings
- [ ] Test 2.7: Navigate Between Assignments
- [ ] Test 3.1: View Student Submissions
- [ ] Test 3.2: Grade Text Submission
- [ ] Test 3.3: Review File Submission
- [ ] Test 3.4: Grade Multiple Submissions
- [ ] Test 4.1: View Grades Page
- [ ] Test 4.2: Filter Grades
- [ ] Test 4.3: View Submission Details
- [ ] Test 5.1: File Size Validation
- [ ] Test 5.2: File Type Validation
- [ ] Test 5.3: Network Error Handling
- [ ] Test 5.4: Concurrent Submissions
- [ ] Test 5.5: Re-submission Prevention
- [ ] Test 6.1: Page Refresh After Submission
- [ ] Test 6.2: Navigation and Back Button
- [ ] Test 6.3: Cross-tab Synchronization
- [ ] Test 7.1: Large Lesson Load
- [ ] Test 7.2: Many Assignments
- [ ] Test 7.3: Large File Upload

---

## Known Issues & Notes

- Quiz auto-grading not yet implemented (Test 2.5 may require manual grading)
- File download functionality not yet implemented (Test 3.3 shows links but may not download)
- Real-time notifications not implemented (multi-tab sync may require manual refresh)

---

## Success Criteria

**✅ All tests pass**: Feature is production-ready
**⚠️ Some failures**: Document issues and create tickets for fixes
**❌ Critical failures**: Do not release; requires debugging

---

## Quick Start Testing Guide

### 5-Minute Quick Test (Sanity Check)
1. ✅ Teacher creates lesson with 2 assignments
2. ✅ Student views lesson and sees progress
3. ✅ Student submits text assignment
4. ✅ Teacher grades submission
5. ✅ Student views grade in Grades page

### 30-Minute Comprehensive Test
- Run through scenarios 1-4 (all main features)
- Check error handling (scenario 5)
- Verify data persistence (scenario 6)

### Full Test Suite
- Run all tests 1-7 for complete validation
- Estimated time: 2-3 hours

