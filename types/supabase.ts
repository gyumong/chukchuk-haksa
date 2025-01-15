export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      course_offerings: {
        Row: {
          area_code: number | null
          class_section: string | null
          course_id: number
          created_at: string | null
          deleted_at: string | null
          department_id: number | null
          evaluation_type_code:
            | Database["public"]["Enums"]["evaluation_type"]
            | null
          faculty_division_name:
            | Database["public"]["Enums"]["course_area_type"]
            | null
          host_department: string | null
          id: number
          is_video_lecture: boolean | null
          original_area_code: number | null
          points: number | null
          professor_id: number | null
          schedule_summary: string | null
          semester: number
          subject_establishment_semester: number | null
          updated_at: string | null
          year: number
        }
        Insert: {
          area_code?: number | null
          class_section?: string | null
          course_id: number
          created_at?: string | null
          deleted_at?: string | null
          department_id?: number | null
          evaluation_type_code?:
            | Database["public"]["Enums"]["evaluation_type"]
            | null
          faculty_division_name?:
            | Database["public"]["Enums"]["course_area_type"]
            | null
          host_department?: string | null
          id?: number
          is_video_lecture?: boolean | null
          original_area_code?: number | null
          points?: number | null
          professor_id?: number | null
          schedule_summary?: string | null
          semester: number
          subject_establishment_semester?: number | null
          updated_at?: string | null
          year: number
        }
        Update: {
          area_code?: number | null
          class_section?: string | null
          course_id?: number
          created_at?: string | null
          deleted_at?: string | null
          department_id?: number | null
          evaluation_type_code?:
            | Database["public"]["Enums"]["evaluation_type"]
            | null
          faculty_division_name?:
            | Database["public"]["Enums"]["course_area_type"]
            | null
          host_department?: string | null
          id?: number
          is_video_lecture?: boolean | null
          original_area_code?: number | null
          points?: number | null
          professor_id?: number | null
          schedule_summary?: string | null
          semester?: number
          subject_establishment_semester?: number | null
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "course_offerings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_offerings_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_area_code"
            columns: ["area_code"]
            isOneToOne: false
            referencedRelation: "liberal_arts_area_codes"
            referencedColumns: ["code"]
          },
        ]
      }
      courses: {
        Row: {
          course_code: string
          course_name: string | null
          created_at: string | null
          deleted_at: string | null
          id: number
          updated_at: string | null
        }
        Insert: {
          course_code: string
          course_name?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          course_code?: string
          course_name?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      department_area_requirements: {
        Row: {
          admission_year: number
          area_type: Database["public"]["Enums"]["course_area_type"]
          created_at: string | null
          department_id: number
          description: string | null
          id: string
          required_credits: number
          required_elective_courses: number | null
          total_elective_courses: number | null
          updated_at: string | null
        }
        Insert: {
          admission_year: number
          area_type: Database["public"]["Enums"]["course_area_type"]
          created_at?: string | null
          department_id: number
          description?: string | null
          id?: string
          required_credits: number
          required_elective_courses?: number | null
          total_elective_courses?: number | null
          updated_at?: string | null
        }
        Update: {
          admission_year?: number
          area_type?: Database["public"]["Enums"]["course_area_type"]
          created_at?: string | null
          department_id?: number
          description?: string | null
          id?: string
          required_credits?: number
          required_elective_courses?: number | null
          total_elective_courses?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "department_area_requirements_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      department_language_requirements: {
        Row: {
          admission_year: number
          created_at: string | null
          department_id: number
          description: string | null
          id: string
          minimum_score: string
          requirement_group_id: string | null
          test_type_id: string
          updated_at: string | null
        }
        Insert: {
          admission_year: number
          created_at?: string | null
          department_id: number
          description?: string | null
          id?: string
          minimum_score: string
          requirement_group_id?: string | null
          test_type_id: string
          updated_at?: string | null
        }
        Update: {
          admission_year?: number
          created_at?: string | null
          department_id?: number
          description?: string | null
          id?: string
          minimum_score?: string
          requirement_group_id?: string | null
          test_type_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "department_language_requirements_test_type_id_fkey"
            columns: ["test_type_id"]
            isOneToOne: false
            referencedRelation: "language_test_types"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string | null
          department_code: string | null
          established_department_name: string | null
          id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_code?: string | null
          established_department_name?: string | null
          id?: never
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_code?: string | null
          established_department_name?: string | null
          id?: never
          updated_at?: string | null
        }
        Relationships: []
      }
      graduation_requirements: {
        Row: {
          admission_year: number | null
          created_at: string | null
          department_id: number | null
          id: string
          minimum_gpa: number | null
          total_credits: number
          updated_at: string | null
        }
        Insert: {
          admission_year?: number | null
          created_at?: string | null
          department_id?: number | null
          id?: string
          minimum_gpa?: number | null
          total_credits: number
          updated_at?: string | null
        }
        Update: {
          admission_year?: number | null
          created_at?: string | null
          department_id?: number | null
          id?: string
          minimum_gpa?: number | null
          total_credits?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_graduation_req_dept"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "graduation_requirements_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      language_test_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          test_code: string | null
          test_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          test_code?: string | null
          test_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          test_code?: string | null
          test_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      liberal_arts_area_codes: {
        Row: {
          area_name: string
          code: number
          created_at: string | null
          description: string | null
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          area_name: string
          code: number
          created_at?: string | null
          description?: string | null
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          area_name?: string
          code?: number
          created_at?: string | null
          description?: string | null
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      professor: {
        Row: {
          created_at: string | null
          department_id: number | null
          id: number
          professor_code: string | null
          professor_name: string
        }
        Insert: {
          created_at?: string | null
          department_id?: number | null
          id?: never
          professor_code?: string | null
          professor_name: string
        }
        Update: {
          created_at?: string | null
          department_id?: number | null
          id?: never
          professor_code?: string | null
          professor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_department"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      student_courses: {
        Row: {
          created_at: string | null
          grade: Database["public"]["Enums"]["grade_type"] | null
          id: number
          is_retake: boolean | null
          offering_id: number
          points: number | null
          student_id: string
        }
        Insert: {
          created_at?: string | null
          grade?: Database["public"]["Enums"]["grade_type"] | null
          id?: number
          is_retake?: boolean | null
          offering_id: number
          points?: number | null
          student_id: string
        }
        Update: {
          created_at?: string | null
          grade?: Database["public"]["Enums"]["grade_type"] | null
          id?: number
          is_retake?: boolean | null
          offering_id?: number
          points?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_sc_offering"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "course_offerings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sc_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      student_graduation_progress: {
        Row: {
          area_requirements_fulfilled: boolean | null
          checked_at: string | null
          created_at: string | null
          credits_fulfilled: boolean | null
          elective_courses_fulfilled: boolean | null
          gpa_fulfilled: boolean | null
          graduation_status:
            | Database["public"]["Enums"]["graduation_status_type"]
            | null
          id: string
          language_cert_fulfilled: boolean | null
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          area_requirements_fulfilled?: boolean | null
          checked_at?: string | null
          created_at?: string | null
          credits_fulfilled?: boolean | null
          elective_courses_fulfilled?: boolean | null
          gpa_fulfilled?: boolean | null
          graduation_status?:
            | Database["public"]["Enums"]["graduation_status_type"]
            | null
          id?: string
          language_cert_fulfilled?: boolean | null
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          area_requirements_fulfilled?: boolean | null
          checked_at?: string | null
          created_at?: string | null
          credits_fulfilled?: boolean | null
          elective_courses_fulfilled?: boolean | null
          gpa_fulfilled?: boolean | null
          graduation_status?:
            | Database["public"]["Enums"]["graduation_status_type"]
            | null
          id?: string
          language_cert_fulfilled?: boolean | null
          student_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_graduation_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      student_language_test_records: {
        Row: {
          created_at: string | null
          document_url: string | null
          id: string
          is_verified: boolean | null
          score: string
          student_id: string | null
          test_date: string
          test_type_id: string | null
          updated_at: string | null
          verification_date: string | null
        }
        Insert: {
          created_at?: string | null
          document_url?: string | null
          id?: string
          is_verified?: boolean | null
          score: string
          student_id?: string | null
          test_date: string
          test_type_id?: string | null
          updated_at?: string | null
          verification_date?: string | null
        }
        Update: {
          created_at?: string | null
          document_url?: string | null
          id?: string
          is_verified?: boolean | null
          score?: string
          student_id?: string | null
          test_date?: string
          test_type_id?: string | null
          updated_at?: string | null
          verification_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_language_test_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_language_test_records_test_type_id_fkey"
            columns: ["test_type_id"]
            isOneToOne: false
            referencedRelation: "language_test_types"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          admission_type: string | null
          admission_year: number
          created_at: string | null
          department_id: number
          grade_level: number | null
          is_graduated: boolean | null
          is_transfer_student: boolean | null
          major_id: number | null
          name: string | null
          secondary_major_id: number | null
          semester_enrolled: number | null
          status: Database["public"]["Enums"]["student_status"] | null
          student_code: string
          student_id: string
          target_gpa: number | null
          updated_at: string | null
        }
        Insert: {
          admission_type?: string | null
          admission_year: number
          created_at?: string | null
          department_id: number
          grade_level?: number | null
          is_graduated?: boolean | null
          is_transfer_student?: boolean | null
          major_id?: number | null
          name?: string | null
          secondary_major_id?: number | null
          semester_enrolled?: number | null
          status?: Database["public"]["Enums"]["student_status"] | null
          student_code: string
          student_id: string
          target_gpa?: number | null
          updated_at?: string | null
        }
        Update: {
          admission_type?: string | null
          admission_year?: number
          created_at?: string | null
          department_id?: number
          grade_level?: number | null
          is_graduated?: boolean | null
          is_transfer_student?: boolean | null
          major_id?: number | null
          name?: string | null
          secondary_major_id?: number | null
          semester_enrolled?: number | null
          status?: Database["public"]["Enums"]["student_status"] | null
          student_code?: string
          student_id?: string
          target_gpa?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_department_id"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_major_id"
            columns: ["major_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_secondary_major_id"
            columns: ["secondary_major_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_students_major"
            columns: ["major_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_students_secondary_major"
            columns: ["secondary_major_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          connected_at: string | null
          created_at: string | null
          email: string | null
          id: string
          portal_connected: boolean | null
          profile_image: string | null
          profile_nickname: string | null
          updated_at: string | null
        }
        Insert: {
          connected_at?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          portal_connected?: boolean | null
          profile_image?: string | null
          profile_nickname?: string | null
          updated_at?: string | null
        }
        Update: {
          connected_at?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          portal_connected?: boolean | null
          profile_image?: string | null
          profile_nickname?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_area_requirements_fulfillment: {
        Args: {
          p_student_id: string
        }
        Returns: {
          area_requirements_fulfilled: boolean
          elective_courses_fulfilled: boolean
        }[]
      }
      check_liberal_arts_fulfillment: {
        Args: {
          p_student_id: string
        }
        Returns: boolean
      }
      disconnect_portal: {
        Args: {
          p_user_id: string
        }
        Returns: undefined
      }
      get_student_area_progress: {
        Args: {
          p_department_id: number
          p_admission_year: number
        }
        Returns: {
          area_type: Database["public"]["Enums"]["course_area_type"]
          required_credits: number
          earned_credits: number
          required_elective_courses: number
          completed_elective_courses: number
          total_elective_courses: number
          courses: Json
        }[]
      }
      initialize_portal_connection: {
        Args: {
          p_user_id: string
          p_student_data: Json
        }
        Returns: string
      }
      update_graduation_progress: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      course_area_type:
        | "중핵"
        | "기교"
        | "선교"
        | "소교"
        | "전교"
        | "전취"
        | "전핵"
        | "전선"
        | "일선"
      evaluation_type: "absolute" | "relative"
      grade_type:
        | "A+"
        | "A0"
        | "B+"
        | "B0"
        | "C+"
        | "C0"
        | "D+"
        | "D0"
        | "F"
        | "P"
        | "NP"
        | "IP"
      graduation_status_type: "재학" | "수료" | "졸업"
      student_status: "재학" | "휴학" | "졸업" | "수료"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
