export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      course_offerings: {
        Row: {
          category_code: number | null;
          class_section: string | null;
          course_id: number;
          created_at: string | null;
          deleted_at: string | null;
          department_id: number | null;
          evaluation_type_code: Database['public']['Enums']['evaluation_type'] | null;
          faculty_division_name: string | null;
          host_department: string | null;
          id: number;
          is_video_lecture: boolean | null;
          points: number | null;
          professor_id: number | null;
          schedule_summary: string | null;
          semester: number;
          subject_establishment_semester: number | null;
          updated_at: string | null;
          year: number;
        };
        Insert: {
          category_code?: number | null;
          class_section?: string | null;
          course_id: number;
          created_at?: string | null;
          deleted_at?: string | null;
          department_id?: number | null;
          evaluation_type_code?: Database['public']['Enums']['evaluation_type'] | null;
          faculty_division_name?: string | null;
          host_department?: string | null;
          id?: number;
          is_video_lecture?: boolean | null;
          points?: number | null;
          professor_id?: number | null;
          schedule_summary?: string | null;
          semester: number;
          subject_establishment_semester?: number | null;
          updated_at?: string | null;
          year: number;
        };
        Update: {
          category_code?: number | null;
          class_section?: string | null;
          course_id?: number;
          created_at?: string | null;
          deleted_at?: string | null;
          department_id?: number | null;
          evaluation_type_code?: Database['public']['Enums']['evaluation_type'] | null;
          faculty_division_name?: string | null;
          host_department?: string | null;
          id?: number;
          is_video_lecture?: boolean | null;
          points?: number | null;
          professor_id?: number | null;
          schedule_summary?: string | null;
          semester?: number;
          subject_establishment_semester?: number | null;
          updated_at?: string | null;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'course_offerings_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'course_offerings_department_id_fkey';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
        ];
      };
      courses: {
        Row: {
          course_code: string;
          course_name: string | null;
          created_at: string | null;
          deleted_at: string | null;
          id: number;
          updated_at: string | null;
        };
        Insert: {
          course_code: string;
          course_name?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          id?: number;
          updated_at?: string | null;
        };
        Update: {
          course_code?: string;
          course_name?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          id?: number;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      departments: {
        Row: {
          created_at: string | null;
          department_code: string | null;
          established_department_name: string | null;
          id: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          department_code?: string | null;
          established_department_name?: string | null;
          id?: never;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          department_code?: string | null;
          established_department_name?: string | null;
          id?: never;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      graduation_credit_distribution: {
        Row: {
          admission_year: number;
          basic_liberal_arts_required: number;
          character_education_required: number;
          department: string;
          department_id: number | null;
          general_electives_required: number;
          id: number;
          important_core_required: number;
          major_core_required: number;
          major_selection_required: number;
          required_credits: number;
          selective_liberal_arts_required: number;
        };
        Insert: {
          admission_year: number;
          basic_liberal_arts_required?: number;
          character_education_required?: number;
          department: string;
          department_id?: number | null;
          general_electives_required?: number;
          id?: never;
          important_core_required: number;
          major_core_required: number;
          major_selection_required: number;
          required_credits: number;
          selective_liberal_arts_required?: number;
        };
        Update: {
          admission_year?: number;
          basic_liberal_arts_required?: number;
          character_education_required?: number;
          department?: string;
          department_id?: number | null;
          general_electives_required?: number;
          id?: never;
          important_core_required?: number;
          major_core_required?: number;
          major_selection_required?: number;
          required_credits?: number;
          selective_liberal_arts_required?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_gcd_department';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
        ];
      };
      missionary_category: {
        Row: {
          area: number | null;
          code: number;
          id: number;
          name: string;
        };
        Insert: {
          area?: number | null;
          code: number;
          id?: number;
          name: string;
        };
        Update: {
          area?: number | null;
          code?: number;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      professor: {
        Row: {
          created_at: string | null;
          department_id: number | null;
          id: number;
          professor_code: string | null;
          professor_name: string;
        };
        Insert: {
          created_at?: string | null;
          department_id?: number | null;
          id?: never;
          professor_code?: string | null;
          professor_name: string;
        };
        Update: {
          created_at?: string | null;
          department_id?: number | null;
          id?: never;
          professor_code?: string | null;
          professor_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_department';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string | null;
          email: string | null;
          id: string;
          profile_image: string | null;
          profile_nickname: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          id: string;
          profile_image?: string | null;
          profile_nickname?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          id?: string;
          profile_image?: string | null;
          profile_nickname?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      student_courses: {
        Row: {
          created_at: string | null;
          grade: Database['public']['Enums']['grade_type'] | null;
          id: number;
          is_retake: boolean | null;
          offering_id: number;
          points: number | null;
          student_id: string;
        };
        Insert: {
          created_at?: string | null;
          grade?: Database['public']['Enums']['grade_type'] | null;
          id?: number;
          is_retake?: boolean | null;
          offering_id: number;
          points?: number | null;
          student_id: string;
        };
        Update: {
          created_at?: string | null;
          grade?: Database['public']['Enums']['grade_type'] | null;
          id?: number;
          is_retake?: boolean | null;
          offering_id?: number;
          points?: number | null;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_sc_offering';
            columns: ['offering_id'];
            isOneToOne: false;
            referencedRelation: 'course_offerings';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'fk_sc_student';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['student_id'];
          },
        ];
      };
      student_graduation_status: {
        Row: {
          checked_at: string | null;
          created_at: string | null;
          credits_fulfilled: boolean | null;
          gpa_fulfilled: boolean | null;
          graduation_criteria_id: string | null;
          graduation_status: Database['public']['Enums']['graduation_status_type'] | null;
          id: number;
          language_cert_fulfilled: boolean | null;
          semesters_fulfilled: boolean | null;
          student_id: string;
          thesis_fulfilled: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          checked_at?: string | null;
          created_at?: string | null;
          credits_fulfilled?: boolean | null;
          gpa_fulfilled?: boolean | null;
          graduation_criteria_id?: string | null;
          graduation_status?: Database['public']['Enums']['graduation_status_type'] | null;
          id?: never;
          language_cert_fulfilled?: boolean | null;
          semesters_fulfilled?: boolean | null;
          student_id: string;
          thesis_fulfilled?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          checked_at?: string | null;
          created_at?: string | null;
          credits_fulfilled?: boolean | null;
          gpa_fulfilled?: boolean | null;
          graduation_criteria_id?: string | null;
          graduation_status?: Database['public']['Enums']['graduation_status_type'] | null;
          id?: never;
          language_cert_fulfilled?: boolean | null;
          semesters_fulfilled?: boolean | null;
          student_id?: string;
          thesis_fulfilled?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_sgs_student';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['student_id'];
          },
        ];
      };
      students: {
        Row: {
          admission_type: string | null;
          admission_year: number;
          created_at: string | null;
          department_id: number;
          grade_level: number | null;
          is_graduated: boolean | null;
          is_transfer_student: boolean | null;
          major_id: number | null;
          name: string | null;
          secondary_major_id: number | null;
          semester_enrolled: number | null;
          status: Database['public']['Enums']['student_status'] | null;
          student_code: string;
          student_id: string;
          updated_at: string | null;
        };
        Insert: {
          admission_type?: string | null;
          admission_year: number;
          created_at?: string | null;
          department_id: number;
          grade_level?: number | null;
          is_graduated?: boolean | null;
          is_transfer_student?: boolean | null;
          major_id?: number | null;
          name?: string | null;
          secondary_major_id?: number | null;
          semester_enrolled?: number | null;
          status?: Database['public']['Enums']['student_status'] | null;
          student_code: string;
          student_id: string;
          updated_at?: string | null;
        };
        Update: {
          admission_type?: string | null;
          admission_year?: number;
          created_at?: string | null;
          department_id?: number;
          grade_level?: number | null;
          is_graduated?: boolean | null;
          is_transfer_student?: boolean | null;
          major_id?: number | null;
          name?: string | null;
          secondary_major_id?: number | null;
          semester_enrolled?: number | null;
          status?: Database['public']['Enums']['student_status'] | null;
          student_code?: string;
          student_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_department_id';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'fk_major_id';
            columns: ['major_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'fk_secondary_major_id';
            columns: ['secondary_major_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'fk_students_department';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'fk_students_major';
            columns: ['major_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'fk_students_secondary_major';
            columns: ['secondary_major_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      evaluation_type: 'absolute' | 'relative';
      grade_type: 'A+' | 'A0' | 'B+' | 'B0' | 'C+' | 'C0' | 'D+' | 'D0' | 'F' | 'P' | 'NP' | 'IP';
      graduation_status_type: '재학' | '수료' | '졸업';
      student_status: '재학' | '휴학' | '졸업' | '수료';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views']) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes'] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
