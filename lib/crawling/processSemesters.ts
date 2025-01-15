function processSemesters(data: { semester: string }[]) {
  // 1) 학기 정렬
  data.sort((a, b) => {
    const A = parseInt(a.semester.replace('-', ''), 10);
    const B = parseInt(b.semester.replace('-', ''), 10);
    return A - B;
  });

  // 2) 정규학기 카운터
  let regularCount = 0;

  // 3) 학년/학기 계산
  const mappedData = data.map(item => {
    const [year, semesterCode] = item.semester.split('-');
    const semesterPart = parseInt(semesterCode, 10);

    let gradeYear = 0;
    let semesterName = '';

    if (semesterPart === 10 || semesterPart === 20) {
      // 정규학기
      regularCount += 1;
      gradeYear = Math.ceil(regularCount / 2);
      semesterName = regularCount % 2 === 1 ? '1학기' : '2학기';
    } else {
      // 계절학기
      gradeYear = Math.ceil(regularCount / 2);
      semesterName = semesterPart === 15 ? '여름학기' : '겨울학기';
    }

    return {
      ...item,
      gradeYear,
      semesterName,
    };
  });

  // 4) 최신 학기 추출
  const latestSemester = mappedData[mappedData.length - 1];

  return {
    mappedData,
    latestSemester: {
      gradeYear: latestSemester.gradeYear,
      semesterName: latestSemester.semesterName,
    },
  };
}
