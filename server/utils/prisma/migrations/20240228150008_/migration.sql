-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faculty" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "department_id" TEXT NOT NULL,

    CONSTRAINT "faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "register_no" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "batch" INTEGER NOT NULL,
    "editable_personal" BOOLEAN NOT NULL DEFAULT false,
    "gender" TEXT,
    "period_of_study" TEXT,
    "blood_group" TEXT,
    "mobile_number" TEXT,
    "whatsapp_number" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "email_id" TEXT,
    "f_name" TEXT,
    "f_occupation" TEXT,
    "f_mobile_number" TEXT,
    "f_whatsapp_number" TEXT,
    "f_email_id" TEXT,
    "f_address" TEXT,
    "m_name" TEXT,
    "m_occupation" TEXT,
    "m_mobile_number" TEXT,
    "m_whatsapp_number" TEXT,
    "m_email_id" TEXT,
    "m_address" TEXT,
    "sslc_board" TEXT,
    "sslc_institution" TEXT,
    "sslc_percentage" TEXT,
    "sslc_years" TEXT,
    "hsc_board" TEXT,
    "hsc_institution" TEXT,
    "hsc_percentage" TEXT,
    "hsc_years" TEXT,
    "jee_rank" INTEGER,
    "jee_score" INTEGER,
    "positions_of_responsibility" TEXT,
    "scholarships" TEXT,
    "competitions" TEXT,
    "special_talents" TEXT,
    "role_model" TEXT,
    "objectives" TEXT,
    "extra_curricular" TEXT,
    "reassessment_info" TEXT,
    "placement_studies" TEXT,
    "student_comments" TEXT,
    "department_id" TEXT NOT NULL,
    "mentor_id" INTEGER,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academics" (
    "id" SERIAL NOT NULL,
    "year" TEXT NOT NULL,
    "register_no" TEXT NOT NULL,
    "special" TEXT,
    "academics" TEXT,
    "clubs" TEXT,
    "disciplinary_actions" TEXT DEFAULT 'None',
    "os_sem" INTEGER NOT NULL,
    "os_academic_year" TEXT,
    "os_hostel" TEXT,
    "os_subject_1_name" TEXT,
    "os_subject_1_grade" TEXT,
    "os_subject_2_name" TEXT,
    "os_subject_2_grade" TEXT,
    "os_subject_3_name" TEXT,
    "os_subject_3_grade" TEXT,
    "os_subject_4_name" TEXT,
    "os_subject_4_grade" TEXT,
    "os_subject_5_name" TEXT,
    "os_subject_5_grade" TEXT,
    "os_subject_6_name" TEXT,
    "os_subject_6_grade" TEXT,
    "os_subject_7_name" TEXT,
    "os_subject_7_grade" TEXT,
    "os_subject_8_name" TEXT,
    "os_subject_8_grade" TEXT,
    "os_subject_9_name" TEXT,
    "os_subject_9_grade" TEXT,
    "es_sem" INTEGER NOT NULL,
    "es_academic_year" TEXT,
    "es_hostel" TEXT,
    "es_subject_1_name" TEXT,
    "es_subject_1_grade" TEXT,
    "es_subject_2_name" TEXT,
    "es_subject_2_grade" TEXT,
    "es_subject_3_name" TEXT,
    "es_subject_3_grade" TEXT,
    "es_subject_4_name" TEXT,
    "es_subject_4_grade" TEXT,
    "es_subject_5_name" TEXT,
    "es_subject_5_grade" TEXT,
    "es_subject_6_name" TEXT,
    "es_subject_6_grade" TEXT,
    "es_subject_7_name" TEXT,
    "es_subject_7_grade" TEXT,
    "es_subject_8_name" TEXT,
    "es_subject_8_grade" TEXT,
    "es_subject_9_name" TEXT,
    "es_subject_9_grade" TEXT,

    CONSTRAINT "academics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meetings" (
    "date" TIMESTAMP(3) NOT NULL,
    "discussion" TEXT NOT NULL,
    "mentee_id" TEXT NOT NULL,
    "mentor_id" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "meeting_number" INTEGER NOT NULL,

    CONSTRAINT "meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "name" TEXT NOT NULL,
    "id" TEXT NOT NULL,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_user_id_key" ON "faculty"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_user_id_key" ON "students"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_register_no_key" ON "students"("register_no");

-- AddForeignKey
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academics" ADD CONSTRAINT "academics_register_no_fkey" FOREIGN KEY ("register_no") REFERENCES "students"("register_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_mentee_id_fkey" FOREIGN KEY ("mentee_id") REFERENCES "students"("register_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
