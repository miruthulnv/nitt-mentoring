export type User =
  & { id: number; username: string }
  & (
    | { level: -1 }
    | {
      level: 0;
      student: Student;
    }
    | {
      level: 1;
      faculty: Faculty;
    }
    | {
      level: 2;
      faculty: Faculty;
    }
    | {
      level: 3;
    }
  );

export type Department = {
  name: string;
  id: string;
};

export type FacultyInfo = {
  name: string;
  department: Department;
  id: number;
  user_id: number;
  mentee_count: number;
};

export type Faculty = FacultyInfo & {
  name: string;
  department: Department;
  mentees: PartialStudent[];
  id: number;
  user_id: number;
};

export type PartialStudent = {
  register_number: string;
  name: string;
  year: string;
  section: string;
  batch: number;
  department: Department;
  mentor_id?: number;
  mentor?: FacultyInfo;
  is_pg: boolean
};

export type Student = PartialStudent & {
  mentor: FacultyInfo;
  meetings: Meeting[];
  meeting_number?: number;
  enable_edit_profile: boolean,
  personal_info: Partial<{
    blood_group: string;
    mobile_number: string;
    whatsapp_number: string;
    date_of_birth: Date;
    gender: string;
    email_id: string;
    father: Partial<ParentInfo>;
    mother: Partial<ParentInfo>;
  }>;
  past: {
    sslc: {
      institution: string;
      board_of_study: string;
      year_of_study: string;
      percentage: string;
    };
    hsc: {
      institution: string;
      board_of_study: string;
      year_of_study: string;
      percentage: string;
    };
    jee?: {
      rank: number;
      score: number;
    };
    pg_feilds?: {
      ug_cgpa : number;
      gate_score: number;
      work_experience: string;
    }
  };
  achievements: Partial<{
    positions_of_responsibility: string;
    scholarships: string;
    competitions: string;
    special_talents: string;
    role_model: string;
    objectives: string;
    extra_curricular: string;
  }>;
  reassessment_info?: string;
  placement_studies?: string;
  student_comments?: string;
  academics: {
    special?: string;
    clubs?: string;
    academic?: string;
    disciplinary_actions?: string;
    odd_sem: SemResult;
    even_sem: SemResult;
  }[];
};

type SemResult = {
  semester: number;
  academic_year?: string;
  hostel?: string;
  subjects: SubjectResult[];
};

type SubjectResult = {
  name: string;
  grade: string;
};

type ParentInfo = {
  name: string;
  occupation: string;
  mobile_number: string;
  whatsapp_number: string;
  email_id: string;
  address: string;
};

export type Meeting = {
  id: number;
  meeting_number: number;
  date: Date;
  discussion: string;
  mentee: PartialStudent;
  mentor: FacultyInfo;
};
