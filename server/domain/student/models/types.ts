export interface StudentPortalData {
  studentCode: string;
  name: string;
  department: {
    code: string;
    name: string;
  };
  major: {
    code: string;
    name: string;
  };
  secondaryMajor?: {
    code: string;
    name: string;
  };
  admission: {
    year: number;
    semester: number;
    isTransfer: boolean;
  };
  academic: {
    totalCredits: number;
    completedSemesters: number;
  };
}
