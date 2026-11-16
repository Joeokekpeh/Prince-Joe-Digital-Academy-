# Security Specification — PRINCE JOE DIGITAL ACADEMY

## 1. Data Invariants
1. A student profile (`/users/{userId}`) may only be created with `role == 'student'`, `uid == request.auth.uid`, and server timestamps (`request.time`), preventing self-assigned admin privilege escalation.
2. Student PII (`/users/{userId}/private/{docId}`) is isolated from public/course collections and is readable/writable strictly by the owning user (`request.auth.uid == userId`) or a verified administrator.
3. A course enrollment (`/enrollments/{enrollmentId}`) cannot exist without a valid existing `/courses/{courseId}` document, must belong to `request.auth.uid`, and can only be read, listed, or updated by its owning student or a verified administrator.
4. Once an enrollment reaches terminal `status == 'completed'`, regular students cannot mutate it further; only administrators can override terminal states.
5. Courses (`/courses/{courseId}`), AI News (`/news/{articleId}`), and Website Content (`/siteContent/{docId}`) are publicly readable for academy browsing, while create/update/delete operations are strictly limited to verified administrators (`isAdmin()`).
6. Administrator checks require both `email_verified == true` for the bootstrapped owner email (`joeokekpeh@gmail.com`) OR existence of a verified `/admins/{uid}` document—never trusting client claims.

## 2. Adversarial "Dirty Dozen" Payloads (Must Return PERMISSION_DENIED)
1. **Self-Admin Escalation on Registration**: Student creates `/users/{uid}` with `role: "admin"`.
2. **Role Tampering on Update**: Existing student updates `/users/{uid}` changing `role` from `"student"` to `"admin"`.
3. **Cross-Student Profile Read**: Student A attempts `get` or `list` on Student B's `/users/{studentB_uid}` or `/users/{studentB_uid}/private/info`.
4. **Cross-Student Enrollment Read / List**: Student A queries `/enrollments` without filtering `userId == request.auth.uid` or tries to `get` Student B's enrollment.
5. **Cross-Student Progress Tampering**: Student A attempts to update `completedLessonIds` on Student B's `/enrollments/{id}`.
6. **Orphaned Enrollment**: Student creates an enrollment pointing to a non-existent `courseId: "fake-course-999"`.
7. **Shadow Field Injection**: Student creates or updates `/users/{uid}` or `/enrollments/{id}` with an extra ghost field like `isVerified: true` or `freeTuition: true`.
8. **Client Timestamp Spoofing**: Student submits `createdAt` or `updatedAt` in the past or future instead of `request.time`.
9. **Terminal State Mutation**: Student attempts to modify `completedLessonIds` after an enrollment has `status: "completed"`.
10. **ID Poisoning / Resource Exhaustion**: User attempts to write to `/enrollments/<2000-char-junk-id>` or inject a >2000-char `displayName`.
11. **Course / Content Tampering by Student**: Regular signed-in student attempts to create, edit, or delete `/courses/{id}` or `/siteContent/main`.
12. **Unverified Email Admin Spoof**: Attacker signs in with `email: "joeokekpeh@gmail.com"` where `request.auth.token.email_verified == false` and attempts an admin write.
