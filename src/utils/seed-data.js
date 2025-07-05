// Script to initialize the database and seed initial data
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Supabase connection details
const supabaseUrl = 'https://gwaljfvwhjedmtwqpbzk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3YWxqZnZ3aGplZG10d3FwYnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MzQwMDUsImV4cCI6MjA2NzExMDAwNX0.ijOHlhNI6cae07OgL07WAStAqoghfOdIWofODaHzy0A';
const supabase = createClient(supabaseUrl, supabaseKey);

// Teacher details
const teacher = {
    name: 'Kartikey Patel',
    emp_id: 'FAC123',
    emp_username: 'FAC123',
    emp_password: 'FAC123' // Will be hashed before storing
};

// Sample students to create
const students = [
    {
        name: "Kartikey Patel",
        age: 7,
        grade: "2nd",
        progress: 75,
        lastActivity: "2024-03-01",
        maths_progress: 80,
        science_progress: 70,
        social_science_ethics_progress: 10,
        financial_literacy_progress: 40,
        maths_score: 85,
        science_score: 75,
        social_science_ethics_score: 70,
        financial_literacy_score: 80,
        strengths: ["Problem Solving", "Critical Thinking"],
        improvements: ["Time Management"],
        aiRecommendation: "Focus on improving time management skills"
    },
    {
        name: "Manav Patel",
        age: 8,
        grade: "3rd",
        progress: 85,
        lastActivity: "2024-03-01",
        maths_progress: 90,
        science_progress: 90,
        social_science_ethics_progress: 40,
        financial_literacy_progress: 40,
        maths_score: 95,
        science_score: 90,
        social_science_ethics_score: 20,
        financial_literacy_score: 30,
        strengths: ["Mathematics", "Communication"],
        improvements: ["Group Work"],
        aiRecommendation: "Encourage more participation in group activities"
    },
    {
        name: "Harsh Agarwal",
        age: 6,
        grade: "1st",
        progress: 60,
        lastActivity: "2024-03-01",
        maths_progress: 65,
        science_progress: 70,
        social_science_ethics_progress: 40,
        financial_literacy_progress: 20,
        maths_score: 40,
        science_score: 33,
        social_science_ethics_score: 40,
        financial_literacy_score: 32,
        strengths: ["Creativity", "Curiosity"],
        improvements: ["Focus"],
        aiRecommendation: "Implement strategies to improve focus during lessons"
    }
];

// Sample cognitive analysis data
const cognitiveAnalysisSamples = [
    // John Doe - Time Management Focus
    {
        turn_id: "kp001",
        session_id: "s001",
        user_id: "karitkey_patel_001",
        timestamp_prompt: "2024-03-01T10:00:00Z",
        timestamp_response: "2024-03-01T10:00:15Z",
        ai_prompt_text: "Can you explain how you would organize your homework time for math and science?",
        user_response_text: "First I'll do math because it's harder, then science after a break",
        topic_tag: "time_management",
        prompt_type_tag: "creative_prompt",
        response_relevance_score: 0.9,
        metacognitive_flags: ["planning", "self_awareness"],
        novelty_score: 0.7,
        cross_session_link_id: null
    },
    {
        turn_id: "kp002",
        session_id: "s001",
        user_id: "kartikey_patel_001",
        timestamp_prompt: "2024-03-01T10:01:00Z",
        timestamp_response: "2024-03-01T10:01:30Z",
        ai_prompt_text: "Remember the steps we discussed for solving word problems. What were they?",
        user_response_text: "Read carefully, circle important numbers, write equation, solve, check answer makes sense",
        topic_tag: "problem_solving",
        prompt_type_tag: "direct_recall",
        response_relevance_score: 0.95,
        metacognitive_flags: ["memory_retrieval", "process_awareness"],
        novelty_score: 0.3,
        cross_session_link_id: "prev_session_123"
    },
    // Jane Smith - Mathematics and Group Work
    {
        turn_id: "mp001",
        session_id: "s002",
        user_id: "manav_patel_001",
        timestamp_prompt: "2024-03-01T11:00:00Z",
        timestamp_response: "2024-03-01T11:00:10Z",
        ai_prompt_text: "How would you explain multiplication to a classmate who's struggling?",
        user_response_text: "I would use groups of objects to show how multiplication is like repeated addition. For example, 3 groups of 4 apples is the same as 4+4+4.",
        topic_tag: "mathematics",
        prompt_type_tag: "creative_prompt",
        response_relevance_score: 1.0,
        metacognitive_flags: ["teaching_others", "concept_connection"],
        novelty_score: 0.8,
        cross_session_link_id: "prev_session_456"
    },
    {
        turn_id: "mp002",
        session_id: "s002",
        user_id: "manav_patel_001",
        timestamp_prompt: "2024-03-01T11:02:00Z",
        timestamp_response: "2024-03-01T11:02:05Z",
        ai_prompt_text: "What's 7 times 8?",
        user_response_text: "56",
        topic_tag: "mathematics",
        prompt_type_tag: "direct_recall",
        response_relevance_score: 1.0,
        metacognitive_flags: ["quick_recall"],
        novelty_score: 0.1,
        cross_session_link_id: null
    },
    // Mike Johnson - Focus and Creativity
    {
        turn_id: "ha001",
        session_id: "s003",
        user_id: "harsh_agarwal_001",
        timestamp_prompt: "2024-03-01T13:00:00Z",
        timestamp_response: "2024-03-01T13:00:45Z",
        ai_prompt_text: "Draw a picture that shows what happens when water freezes. Describe what you drew.",
        user_response_text: "I drew water drops getting closer together and becoming ice crystals. They make pretty shapes like snowflakes.",
        topic_tag: "science",
        prompt_type_tag: "creative_prompt",
        response_relevance_score: 0.85,
        metacognitive_flags: ["visualization", "creative_expression"],
        novelty_score: 0.9,
        cross_session_link_id: null
    },
    {
        turn_id: "ha002",
        session_id: "s003",
        user_id: "harsh_agarwal_001",
        timestamp_prompt: "2024-03-01T13:02:00Z",
        timestamp_response: "2024-03-01T13:02:40Z",
        ai_prompt_text: "What did we learn about solids and liquids yesterday?",
        user_response_text: "Umm... liquids can flow and solids stay in place",
        topic_tag: "science",
        prompt_type_tag: "direct_recall",
        response_relevance_score: 0.6,
        metacognitive_flags: ["partial_recall"],
        novelty_score: 0.2,
        cross_session_link_id: "prev_session_789"
    }
];

async function createTables() {
    console.log('Creating tables if they don\'t exist...');

    try {
        // Check if teachers table exists
        const { data: teachersExists, error: teachersCheckError } = await supabase
            .from('teachers')
            .select('count(*)', { count: 'exact', head: true });

        if (teachersCheckError && teachersCheckError.code === '42P01') { // Table does not exist
            console.log('Creating teachers table...');

            // Create the table manually using SQL
            const { error: createTeachersError } = await supabase.rpc('create_teachers_table');
            if (createTeachersError) {
                console.error('Error creating teachers table:', createTeachersError);
            } else {
                console.log('Teachers table created successfully');
            }
        } else {
            console.log('Teachers table already exists');
        }

        // Check if students table exists
        const { data: studentsExists, error: studentsCheckError } = await supabase
            .from('students')
            .select('count(*)', { count: 'exact', head: true });

        if (studentsCheckError && studentsCheckError.code === '42P01') { // Table does not exist
            console.log('Creating students table...');

            // Create the table manually using SQL
            const { error: createStudentsError } = await supabase.rpc('create_students_table');
            if (createStudentsError) {
                console.error('Error creating students table:', createStudentsError);
            } else {
                console.log('Students table created successfully');
            }
        } else {
            console.log('Students table already exists');
        }

        // Check if teacher_students table exists
        const { data: teacherStudentsExists, error: teacherStudentsCheckError } = await supabase
            .from('teacher_students')
            .select('count(*)', { count: 'exact', head: true });

        if (teacherStudentsCheckError && teacherStudentsCheckError.code === '42P01') { // Table does not exist
            console.log('Creating teacher_students table...');

            // Create the table manually using SQL
            const { error: createTeacherStudentsError } = await supabase.rpc('create_teacher_students_table');
            if (createTeacherStudentsError) {
                console.error('Error creating teacher_students table:', createTeacherStudentsError);
            } else {
                console.log('Teacher_students table created successfully');
            }
        } else {
            console.log('Teacher_students table already exists');
        }

        // Check if cognitive_analysis table exists
        const { data: cognitiveAnalysisExists, error: cognitiveAnalysisCheckError } = await supabase
            .from('cognitive_analysis')
            .select('count(*)', { count: 'exact', head: true });

        if (cognitiveAnalysisCheckError && cognitiveAnalysisCheckError.code === '42P01') { // Table does not exist
            console.log('Creating cognitive_analysis table...');

            // Create the table manually using SQL
            const { error: createCognitiveAnalysisError } = await supabase.rpc('create_cognitive_analysis_table');
            if (createCognitiveAnalysisError) {
                console.error('Error creating cognitive_analysis table:', createCognitiveAnalysisError);
            } else {
                console.log('Cognitive_analysis table created successfully');
            }
        } else {
            console.log('Cognitive_analysis table already exists');
        }
    } catch (err) {
        console.error('Error checking/creating tables:', err);
    }
}

async function seedTeacher() {
    try {
        console.log('Seeding teacher...');

        // Check if teacher already exists
        console.log('Checking if teacher already exists...');
        const { data: existingTeacher, error: checkError } = await supabase
            .from('teachers')
            .select('*')
            .eq('emp_username', teacher.emp_username);

        if (checkError) {
            console.error('Error checking for existing teacher:', checkError);
            return null;
        }

        if (existingTeacher && existingTeacher.length > 0) {
            console.log('Teacher already exists:', existingTeacher[0]);
            return existingTeacher[0].id;
        }

        console.log('No existing teacher found, creating new teacher...');

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(teacher.emp_password, salt);

        console.log('Password hashed, inserting teacher...');

        // Insert teacher with hashed password
        const teacherData = {
            name: teacher.name,
            emp_id: teacher.emp_id,
            emp_username: teacher.emp_username,
            emp_password: hashedPassword
        };

        console.log('Teacher data to insert:', teacherData);

        const { data, error } = await supabase
            .from('teachers')
            .insert([teacherData])
            .select();

        if (error) {
            console.error('Error creating teacher:', error);
            return null;
        }

        console.log('Teacher created successfully:', data[0]);
        return data[0].id;
    } catch (err) {
        console.error('Unexpected error in seedTeacher:', err);
        return null;
    }
}

async function seedStudents(teacherId) {
    if (!teacherId) {
        console.log('No teacher ID provided, skipping student creation');
        return;
    }

    try {
        console.log('Seeding students...');

        // Insert students
        for (const student of students) {
            console.log(`Creating student: ${student.name}...`);

            // Insert student
            const { data: newStudent, error: studentError } = await supabase
                .from('students')
                .insert({
                    name: student.name,
                    age: student.age,
                    grade: student.grade,
                    progress: student.progress,
                    lastActivity: student.lastActivity,
                    maths_progress: student.maths_progress,
                    science_progress: student.science_progress,
                    social_science_ethics_progress: student.social_science_ethics_progress,
                    financial_literacy_progress: student.financial_literacy_progress,
                    maths_score: student.maths_score,
                    science_score: student.science_score,
                    social_science_ethics_score: student.social_science_ethics_score,
                    financial_literacy_score: student.financial_literacy_score,
                    strengths: student.strengths,
                    improvements: student.improvements,
                    aiRecommendation: student.aiRecommendation
                })
                .select();

            if (studentError) {
                console.error(`Error creating student ${student.name}:`, studentError);
                continue;
            }

            console.log(`Student ${student.name} created successfully:`, newStudent[0]);

            // Link student to teacher
            console.log(`Linking student ${student.name} to teacher...`);
            const { error: relationError } = await supabase
                .from('teacher_students')
                .insert({
                    teacher_id: teacherId,
                    student_id: newStudent[0].id
                });

            if (relationError) {
                console.error(`Error linking student ${student.name} to teacher:`, relationError);
            } else {
                console.log(`Student ${student.name} linked to teacher successfully`);
            }

            // Add cognitive analysis data for each student
            await seedCognitiveAnalysis(newStudent[0].id);
        }
    } catch (err) {
        console.error('Unexpected error in seedStudents:', err);
    }
}

async function directInsert() {
    console.log('Attempting direct SQL insert for teacher...');

    try {
        const hashedPassword = await bcrypt.hash(teacher.emp_password, 10);

        // Use raw SQL query via RPC to insert the teacher
        const { data, error } = await supabase.rpc('insert_teacher', {
            p_name: teacher.name,
            p_emp_id: teacher.emp_id,
            p_username: teacher.emp_username,
            p_password: hashedPassword
        });

        if (error) {
            console.error('Error with direct SQL insert:', error);
        } else {
            console.log('Direct SQL insert successful:', data);
        }

        return data;
    } catch (err) {
        console.error('Error with direct insert:', err);
        return null;
    }
}

async function seedCognitiveAnalysis(studentId) {
    if (!studentId) {
        console.log('No student ID provided, skipping cognitive analysis creation');
        return;
    }

    try {
        console.log('Seeding cognitive analysis data...');

        for (const analysis of cognitiveAnalysisSamples) {
            console.log(`Creating cognitive analysis entry for student ${studentId}...`);

            const { data: newAnalysis, error } = await supabase
                .from('cognitive_analysis')
                .insert({
                    ...analysis,
                    student_id: studentId
                })
                .select();

            if (error) {
                console.error('Error creating cognitive analysis:', error);
                continue;
            }

            console.log('Cognitive analysis entry created successfully:', newAnalysis[0]);
        }
    } catch (err) {
        console.error('Unexpected error in seedCognitiveAnalysis:', err);
    }
}

async function seedTestStudent() {
    const { data, error } = await supabase
        .from('students')
        .insert([
            {
                name: "Test Student",
                grade: 10,
                age: 15,
                maths_progress: 85,
                maths_score: 78,
                science_progress: 92,
                science_score: 88,
                social_science_ethics_progress: 75,
                social_science_ethics_score: 70,
                financial_literacy_progress: 65,
                financial_literacy_score: 60,
                strengths: ["Critical Thinking", "Scientific Analysis", "Problem Solving"],
                weaknesses: ["Time Management", "Financial Planning"],
                improvements: ["Focus", "Organization"],
                progress: 80
            }
        ])
        .select();

    if (error) {
        console.error("Error seeding test student:", error);
        return;
    }

    console.log("Test student created with ID:", data[0].id);

    // Seed cognitive analysis data for the test student
    await seedCognitiveAnalysis(data[0].id);

    return data[0].id;
}

async function main() {
    try {
        console.log('Starting database seeding process...');

        // Get the database schema info
        const { data: schemaInfo, error: schemaError } = await supabase
            .rpc('get_schema_info');

        if (schemaError) {
            console.error('Error getting schema info:', schemaError);
        } else {
            console.log('Schema info:', schemaInfo);
        }

        // Seed teacher
        const teacherId = await seedTeacher();

        if (!teacherId) {
            console.log('Teacher creation failed, attempting direct insert...');
            const directResult = await directInsert();

            if (!directResult) {
                console.log('Both teacher creation methods failed. Exiting.');
                return;
            }
        }

        // Seed students
        await seedStudents(teacherId);

        // Seed test student
        await seedTestStudent();

        console.log('Database seeded successfully!');
    } catch (err) {
        console.error('Failed to seed database:', err);
    }
}

// Execute the script
main(); 