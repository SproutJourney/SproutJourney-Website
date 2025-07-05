// Student model
export type Student = {
    id: string;
    name: string;
    age: number;
    grade: string;
    progress: number;
    lastActivity: string;
    // Subject Progress
    maths_progress: number;
    science_progress: number;
    social_science_ethics_progress: number;
    financial_literacy_progress: number;
    // Subject Scores
    maths_score: number;
    science_score: number;
    social_science_ethics_score: number;
    financial_literacy_score: number;
    strengths: string[];
    improvements: string[];
    totalLessons?: number;
    activeStreak?: number;
    topSubject?: string;
    aiRecommendation?: string;
    cognitive_analysis?: CognitiveAnalysis[];
};

// Cognitive Analysis model
export type CognitiveAnalysis = {
    turn_id: string;
    session_id: string;
    user_id: string;
    timestamp_prompt: string;
    timestamp_response: string;
    ai_prompt_text: string;
    user_response_text: string;
    topic_tag: string;
    prompt_type_tag: string;
    response_relevance_score: number;
    metacognitive_flags: string[];
    novelty_score: number;
    cross_session_link_id?: string;
};

// Teacher model
export type Teacher = {
    id: string;
    name: string;
    emp_id: string;
    emp_username: string;
    emp_password?: string; // Password is optional in client side
    students?: string[]; // Array of student IDs assigned to this teacher
};

// Teacher-Student relationship model
export interface TeacherStudent {
    id: string;
    teacher_id: string;
    student_id: string;
}

// Authentication form data
export interface LoginFormData {
    emp_username: string;
    emp_password: string;
}

export interface StudentFormData {
    name: string;
    age: number;
    grade?: string;
    // Subject Progress
    maths_progress?: number;
    science_progress?: number;
    social_science_ethics_progress?: number;
    financial_literacy_progress?: number;
    // Subject Scores
    maths_score?: number;
    science_score?: number;
    social_science_ethics_score?: number;
    financial_literacy_score?: number;
    strengths?: string[];
    improvements?: string[];
} 