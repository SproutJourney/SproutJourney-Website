import { createClient } from "@supabase/supabase-js";
import type { Student, Teacher, StudentFormData, LoginFormData, TeacherStudent } from './models';
import bcrypt from 'bcryptjs';

// Initialize Supabase client with the provided credentials
export const supabaseUrl = 'https://gwaljfvwhjedmtwqpbzk.supabase.co';
export const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3YWxqZnZ3aGplZG10d3FwYnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MzQwMDUsImV4cCI6MjA2NzExMDAwNX0.ijOHlhNI6cae07OgL07WAStAqoghfOdIWofODaHzy0A';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Authentication functions
export async function loginTeacher(formData: LoginFormData) {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('emp_username', formData.emp_username)
      .single();

    if (error) throw error;
    if (!data) return { success: false, message: 'User not found' };

    // Since we're storing hashed passwords, we need to compare them
    // In a real implementation, we would use Supabase Auth
    const passwordMatch = await bcrypt.compare(formData.emp_password, data.emp_password);
    if (!passwordMatch) return { success: false, message: 'Invalid password' };

    // Save teacher info in local storage for session management
    localStorage.setItem('teacher', JSON.stringify({
      id: data.id,
      name: data.name,
      emp_id: data.emp_id,
      emp_username: data.emp_username
    }));

    return { success: true, teacher: data };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Login failed' };
  }
}

export function logoutTeacher() {
  localStorage.removeItem('teacher');
  return { success: true };
}

export function getCurrentTeacher(): Teacher | null {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return null;
  }

  const teacherStr = localStorage.getItem('teacher');
  if (!teacherStr) return null;

  try {
    return JSON.parse(teacherStr) as Teacher;
  } catch (e) {
    return null;
  }
}

// Student functions
export async function getTeacherStudents(teacherId: string): Promise<Student[]> {
  try {
    console.log("Getting students for teacher:", teacherId);

    // First get the student IDs linked to this teacher
    const { data: relationships, error: relError } = await supabase
      .from('teacher_students')
      .select('student_id')
      .eq('teacher_id', teacherId);

    if (relError) {
      console.error("Error fetching teacher-student relationships:", relError);
      throw relError;
    }

    console.log("Found relationships:", relationships);

    if (!relationships || relationships.length === 0) {
      console.log("No relationships found, returning sample data");
      // Return sample data if no relationships found
      return getSampleStudents();
    }

    // Get the actual student data
    const studentIds = relationships.map(rel => rel.student_id);
    console.log("Student IDs:", studentIds);

    const { data: students, error: stuError } = await supabase
      .from('students')
      .select('*')
      .in('id', studentIds);

    if (stuError) {
      console.error("Error fetching students:", stuError);
      throw stuError;
    }

    console.log("Found students:", students);

    if (!students || students.length === 0) {
      console.log("No students found, returning sample data");
      return getSampleStudents();
    }

    return students;
  } catch (error) {
    console.error('Error fetching teacher students:', error);
    return getSampleStudents();
  }
}

// Helper function to get sample students
function getSampleStudents(): Student[] {
  return [
    {
      id: "1",
      name: "John Doe",
      age: 7,
      grade: "2nd",
      progress: 75,
      lastActivity: "2024-03-01",
      maths_progress: 80,
      science_progress: 70,
      social_science_ethics_progress: 0,
      financial_literacy_progress: 60,
      maths_score: 85,
      science_score: 75,
      social_science_ethics_score: 0,
      financial_literacy_score: 65,
      strengths: ["Problem Solving", "Critical Thinking"],
      improvements: ["Time Management"],
      aiRecommendation: "Focus on improving time management skills"
    },
    {
      id: "2",
      name: "Jane Smith",
      age: 8,
      grade: "3rd",
      progress: 85,
      lastActivity: "2024-03-01",
      maths_progress: 90,
      science_progress: 0,
      social_science_ethics_progress: 85,
      financial_literacy_progress: 70,
      maths_score: 95,
      science_score: 0,
      social_science_ethics_score: 80,
      financial_literacy_score: 75,
      strengths: ["Mathematics", "Communication"],
      improvements: ["Group Work"],
      aiRecommendation: "Encourage more participation in group activities"
    },
    {
      id: "3",
      name: "Mike Johnson",
      age: 6,
      grade: "1st",
      progress: 60,
      lastActivity: "2024-03-01",
      maths_progress: 65,
      science_progress: 70,
      social_science_ethics_progress: 0,
      financial_literacy_progress: 50,
      maths_score: 60,
      science_score: 75,
      social_science_ethics_score: 0,
      financial_literacy_score: 55,
      strengths: ["Creativity", "Curiosity"],
      improvements: ["Focus"],
      aiRecommendation: "Implement strategies to improve focus during lessons"
    }
  ];
}

export async function getAllStudents(): Promise<Student[]> {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching all students:', error);
    return [];
  }
}

export async function getAvailableStudents(teacherId: string): Promise<Student[]> {
  try {
    // Get all students assigned to this teacher
    const { data: relationships, error: relError } = await supabase
      .from('teacher_students')
      .select('student_id')
      .eq('teacher_id', teacherId);

    if (relError) throw relError;

    // Get all students not in the relationship
    const assignedIds = relationships ? relationships.map(rel => rel.student_id) : [];

    let query = supabase.from('students').select('*');

    // If there are assigned students, exclude them
    if (assignedIds.length > 0) {
      query = query.not('id', 'in', assignedIds);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching available students:', error);
    return [];
  }
}

export async function addStudentToTeacher(teacherId: string, studentId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('teacher_students')
      .insert({ teacher_id: teacherId, student_id: studentId });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding student to teacher:', error);
    return false;
  }
}

export async function createStudent(studentData: StudentFormData): Promise<Student | null> {
  try {
    // Generate default values for optional fields
    const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const defaultGrade = studentData.age <= 6 ? '1st' :
      studentData.age <= 7 ? '2nd' :
        studentData.age <= 8 ? '3rd' : '4th';

    const newStudent = {
      name: studentData.name,
      age: studentData.age,
      grade: studentData.grade || defaultGrade,
      progress: 0, // Default progress
      lastActivity: now,
      // Subject Progress
      maths_progress: studentData.maths_progress || 0,
      science_progress: studentData.science_progress || 0,
      social_science_ethics_progress: studentData.social_science_ethics_progress || 0,
      financial_literacy_progress: studentData.financial_literacy_progress || 0,
      // Subject Scores
      maths_score: studentData.maths_score || 0,
      science_score: studentData.science_score || 0,
      social_science_ethics_score: studentData.social_science_ethics_score || 0,
      financial_literacy_score: studentData.financial_literacy_score || 0,
      strengths: studentData.strengths || [],
      improvements: studentData.improvements || [],
      aiRecommendation: 'New student: recommendations pending'
    };

    const { data, error } = await supabase
      .from('students')
      .insert(newStudent)
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error creating student:', error);
    return null;
  }
}

// Initialize the database with tables if they don't exist
export async function initializeDatabase() {
  // This is just a simplified example - in a real app, you would use migrations
  // or a proper database setup script

  // In a real production app, this would be handled differently
  console.log("Database initialization would happen here in a real app");
}