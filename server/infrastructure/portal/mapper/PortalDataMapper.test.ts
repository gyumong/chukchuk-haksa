// server/infrastructure/portal/mapper/__tests__/PortalDataMapper.test.ts
import { describe, expect, it } from 'vitest';
import { RawPortalData } from '../dto/PortalRowDataType';
import { PortalDataMapper } from './PortalDataMapper';

describe('PortalDataMapper', () => {
  const mockRawData: RawPortalData = {
    student: {
      sno: '17019013',
      studNm: '김민규',
      univCd: '2000510',
      univNm: 'ICT융합대학',
      dpmjCd: '2000513',
      dpmjNm: '정보통신학부',
      mjorCd: '2000516',
      mjorNm: '정보통신',
      enscYear: '2017',
      enscSmrCd: '10',
      scrgStatNm: '재학',
      studGrde: 3,
      enscDvcd: '1',
      facSmrCnt: 6,
    },
    semesters: [
      {
        semester: '2024-20',
        courses: [
          {
            subjtEstbYear: '2024',
            sno: '17019013',
            diclNo: '003',
            timtSmryCn: '종합509(월4,5,6)',
            estbDpmjNm: '교양',
            subjtNm: '글로벌교양4',
            refacYearSmr: '-',
            closeYn: 'N',
            facDvcd: '17',
            point: 3,
            ltrPrfsNm: '션',
            subjtEstbYearSmr: '2024-2학기',
            subjtEstbSmrCd: '20',
            facDvnm: '선교',
            subjtCd: '11032',
            cretSmrNm: '2024-2학기',
            cretGrdCd: 'P',
            gainPoint: 3,
            orgClsCd: '20',
            cltTerrCd: '44',
            cltTerrNm: '4영역',
            gainPont: 91,
            cretGainYear: '2024',
            cretSmrCd: '20',
          },
          {
            subjtEstbYear: '2024',
            sno: '17019013',
            diclNo: '002',
            timtSmryCn: 'IT309(목2,3,4)',
            estbDpmjNm: '미디어SW',
            subjtNm: '데이터베이스',
            refacYearSmr: '2022',
            closeYn: 'N',
            facDvcd: '22',
            point: 3,
            ltrPrfsNm: '신호진',
            subjtEstbYearSmr: '2024-2학기',
            subjtEstbSmrCd: '20',
            facDvnm: '전선',
            subjtCd: '01762',
            cretSmrNm: '2024-2학기',
            gainGpa: 3,
            cretGrdCd: 'B0',
            gainPoint: 3,
            orgClsCd: '20',
            gainPont: 83,
            cretGainYear: '2024',
            cretSmrCd: '20',
          },
          {
            subjtEstbYear: '2024',
            sno: '17019013',
            diclNo: '001',
            timtSmryCn: '글경203(월6,7,8)',
            estbDpmjNm: '데이터과학부',
            subjtNm: '웹크롤자료분석',
            refacYearSmr: '-',
            closeYn: 'N',
            facDvcd: '22',
            point: 3,
            ltrPrfsNm: '황용득',
            subjtEstbYearSmr: '2024-2학기',
            subjtEstbSmrCd: '20',
            facDvnm: '전선',
            subjtCd: '10997',
            cretSmrNm: '2024-2학기',
            gainGpa: 4.5,
            cretGrdCd: 'A+',
            gainPoint: 3,
            orgClsCd: '20',
            gainPont: 100,
            cretGainYear: '2024',
            cretSmrCd: '20',
          },
        ],
      },
      {
        semester: '2019-20',
        courses: [
          {
            subjtEstbYear: '2019',
            sno: '17019013',
            diclNo: '001',
            timtSmryCn: '미래B305(화5,6)',
            estbDpmjNm: '교양',
            subjtNm: '도전과창조-기업가정신',
            refacYearSmr: '-',
            closeYn: 'N',
            facDvcd: '17',
            point: 2,
            ltrPrfsNm: '강성민',
            subjtEstbYearSmr: '2019-2학기',
            subjtEstbSmrCd: '20',
            facDvnm: '중핵',
            subjtCd: '10853',
            cretSmrNm: '2019-2학기',
            gainGpa: 3,
            cretGrdCd: 'B0',
            gainPoint: 2,
            orgClsCd: '20',
            gainPont: 80,
            cretGainYear: '2019',
            cretSmrCd: '20',
          },
          {
            subjtEstbYear: '2019',
            sno: '17019013',
            diclNo: '017',
            timtSmryCn: '종합503(수3,4)',
            estbDpmjNm: '컴퓨터학부',
            subjtNm: '과학적글쓰기와고전읽기2',
            refacYearSmr: '-',
            closeYn: 'N',
            facDvcd: '17',
            point: 2,
            ltrPrfsNm: '이수진',
            subjtEstbYearSmr: '2019-2학기',
            subjtEstbSmrCd: '20',
            facDvnm: '기교',
            subjtCd: '10860',
            cretSmrNm: '2019-2학기',
            gainGpa: 2.5,
            cretGrdCd: 'C+',
            gainPoint: 2,
            orgClsCd: '20',
            gainPont: 75,
            cretGainYear: '2019',
            cretSmrCd: '20',
          },
          {
            subjtEstbYear: '2019',
            sno: '17019013',
            diclNo: '002',
            timtSmryCn: '글경B104(수1,2)',
            estbDpmjNm: '교양',
            subjtNm: '오페라여행',
            refacYearSmr: '-',
            closeYn: 'N',
            facDvcd: '17',
            point: 2,
            ltrPrfsNm: '김민희',
            subjtEstbYearSmr: '2019-2학기',
            subjtEstbSmrCd: '20',
            facDvnm: '선교',
            subjtCd: '11092',
            cretSmrNm: '2019-2학기',
            gainGpa: 3,
            cretGrdCd: 'B0',
            gainPoint: 2,
            orgClsCd: '20',
            gainPont: 83,
            cretGainYear: '2019',
            cretSmrCd: '20',
          },
        ],
      },
    ],
    academicRecords: {
      selectSmrCretSumTabSjTotal: {
        gainPoint: '109',
        applPoint: '112',
        gainAvmk: '3.13',
        gainTavgPont: '84.3',
      },
      listSmrCretSumTabYearSmr: [
        {
          sno: '17019013',
          cretGainYear: '2024',
          cretSmrCd: '20',
          gainPoint: 16,
          applPoint: 16,
          gainAvmk: 4.17,
          gainTavgPont: '96.2',
          dpmjOrdp: '6/33',
        },
      ],
    },
  };

  describe('toPortalData', () => {
    it('원시 데이터를 PortalData 형식으로 올바르게 변환해야 한다', () => {
      const result = PortalDataMapper.toPortalData(mockRawData);

      // 학생 정보 검증
      expect(result.student).toEqual({
        studentCode: '17019013',
        name: '김민규',
        college: {
          code: '2000510',
          name: 'ICT융합대학',
        },
        department: {
          code: '2000513',
          name: '정보통신학부',
        },
        major: {
          code: '2000516',
          name: '정보통신',
        },
        status: '재학',
        admission: {
          year: 2017,
          semester: 10,
          type: '1',
        },
        academic: {
          gradeLevel: 3,
          completedSemesters: 6,
          totalCredits: 0,
          gpa: 0,
        },
      });

      // curriculum 정보 검증
      const { curriculum } = result;

      // 개설강좌 정보 검증
      expect(curriculum.offerings[0]).toEqual({
        courseCode: '11032',
        year: 2024,
        semester: 20,
        classSection: '003',
        professorName: '션',
        scheduleSummary: '종합509(월4,5,6)',
        points: 3,
        hostDepartment: '교양',
        facultyDivisionName: '선교',
        subjectEstablishmentSemester: 20,
        areaCode: 44,
        originalAreaCode: 4,
      });
    });
  });

  describe('toPortalCurriculumInfo', () => {
    it('학기 데이터로부터 교과과정 정보를 올바르게 추출해야 한다', () => {
      const result = PortalDataMapper.toPortalCurriculumInfo(mockRawData.semesters);

      // 개설강좌의 세부 정보 검증
      const offering = result.offerings[0];
      expect(offering.courseCode).toBe('11032');
      expect(offering.year).toBe(2024);
      expect(offering.semester).toBe(20);
      expect(offering.professorName).toBe('션');
      expect(offering.scheduleSummary).toBe('종합509(월4,5,6)');
    });

    it('선택적 필드들을 올바르게 처리해야 한다', () => {
      const result = PortalDataMapper.toPortalCurriculumInfo(mockRawData.semesters);

      console.log('result', result);
      const offering = result.offerings[0];

      console.log('offering', offering);
      expect(offering).toEqual(
        expect.objectContaining({
          classSection: expect.any(String),
          professorName: expect.any(String),
          scheduleSummary: expect.any(String),
          facultyDivisionName: expect.any(String),
          areaCode: expect.any(Number),
          originalAreaCode: expect.any(Number),
          points: expect.any(Number),
          hostDepartment: expect.any(String),
        })
      );
    });
  });
  describe('toPortalAcademicInfo', () => {
    it('학기 및 성적 데이터를 올바르게 변환해야 한다', () => {
      const result = PortalDataMapper.toPortalAcademicInfo(mockRawData.semesters, mockRawData.academicRecords);

      expect(result.semesters).toHaveLength(mockRawData.semesters.length);

      const firstSemester = result.semesters[0];
      expect(firstSemester.year).toBe(2024);
      expect(firstSemester.semester).toBe(20);
      expect(firstSemester.courses).toHaveLength(3);

      const firstCourse = firstSemester.courses[0];
      expect(firstCourse.code).toBe('11032');
      expect(firstCourse.name).toBe('글로벌교양4');
      expect(firstCourse.professor).toBe('션');
      expect(firstCourse.grade).toBe('P');

      // 성적 요약 정보 검증
      expect(result.summary).toEqual({
        totalCredits: expect.any(Number),
        appliedCredits: expect.any(Number),
        gpa: expect.any(Number),
        score: expect.any(Number),
      });

      // 학기별 성적 정보 검증
      expect(result.grades.semesters).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            year: expect.any(Number),
            semester: expect.any(Number),
            earnedCredits: expect.any(Number),
            appliedCredits: expect.any(Number),
            semesterGpa: expect.any(Number),
            score: expect.any(Number),
            ranking: expect.objectContaining({
              rank: expect.any(Number),
              total: expect.any(Number),
            }),
          }),
        ])
      );
    });

    it('재수강 과목을 올바르게 식별해야 한다', () => {
      const result = PortalDataMapper.toPortalAcademicInfo(mockRawData.semesters, mockRawData.academicRecords);

      const courses = result.semesters[0].courses;
      console.log('courses', courses);
      const retakeCourse = courses.find(course => course.isRetake);
      const normalCourse = courses.find(course => !course.isRetake);

      expect(retakeCourse?.isRetake).toBe(true);
      expect(normalCourse?.isRetake).toBe(false);
    });
  });

  describe('toPortalStudentInfo', () => {
    it('학생 기본 정보를 올바르게 변환해야 한다', () => {
      const result = PortalDataMapper.toPortalStudentInfo(mockRawData.student);

      expect(result).toEqual({
        studentCode: '17019013',
        name: '김민규',
        college: {
          code: '2000510',
          name: 'ICT융합대학',
        },
        department: {
          code: '2000513',
          name: '정보통신학부',
        },
        major: {
          code: '2000516',
          name: '정보통신',
        },
        status: '재학',
        admission: {
          year: 2017,
          semester: 10,
          type: '1',
        },
        academic: {
          gradeLevel: 3,
          completedSemesters: 6,
          totalCredits: 0,
          gpa: 0,
        },
      });
    });
  });
});
