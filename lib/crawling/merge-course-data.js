export function mergeCourseData(creditData, courseData) {
    const semesterMap = {};
  
    // 수강 데이터(courseData)를 먼저 정리
    for (const semInfo of courseData) {
      if (!semesterMap[semInfo.semester]) {
        semesterMap[semInfo.semester] = { semester: semInfo.semester, courses: {} };
      }
      for (const c of semInfo.courses) {
        semesterMap[semInfo.semester].courses[c.courseCode] = {
          subjectCode: c.courseCode,
          courseName: c.courseName,
          facultyDivisionName: c.facultyDivisionName,
          points: c.points,
          subjectEstablishmentYear: c.subjectEstablishmentYear,
          subjectEstablishmentSemester: c.subjectEstablishmentSemester,
          scheduleSummary: c.scheduleSummary,
          professorName: c.professorName,
          departmentName: c.departmentName,
          retakeYearSemester: c.retakeYearSemester,
          // 아직 grade/gpa 없음
        };
      }
    }
  
    // 성적 데이터(creditData)로 grade, gpa 추가
    for (const semInfo of creditData) {
      const sem = semesterMap[semInfo.semester];
      if (!sem) {
        // 수강 데이터에 없는 학기라면 여기서 추가할 수도 있지만, 일단 스킵
        continue;
      }
      for (const c of semInfo.credits) {
        const target = sem.courses[c.courseCode];
        if (target) {
          target.grade = c.grade;
          target.gpa = c.gpa;
          target.totalScore = c.totalScore;
        } else {
          // 수강 데이터에 없는 과목이 성적 데이터에만 있을 경우
          sem.courses[c.courseCode] = {
            subjectCode: c.courseCode,
            courseName: c.courseName,
            facultyDivisionName: c.facultyDivisionName,
            points: c.points,
            grade: c.grade,
            gpa: c.gpa,
            totalScore: c.totalScore
          };
        }
      }
    }
  
    return Object.values(semesterMap).map(sem => ({
      semester: sem.semester,
      courses: Object.values(sem.courses)
    }));
  }