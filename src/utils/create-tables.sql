-- Drop existing tables and functions (in correct order due to dependencies)
DROP TABLE IF EXISTS public.cognitive_analysis;
DROP TABLE IF EXISTS public.teacher_students;
DROP TABLE IF EXISTS public.students;
DROP TABLE IF EXISTS public.teachers;
DROP FUNCTION IF EXISTS public.insert_teacher_with_details;

-- Create teachers table
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  emp_id TEXT UNIQUE NOT NULL,
  emp_username TEXT UNIQUE NOT NULL,
  emp_password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table with updated schema
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  grade TEXT NOT NULL,
  progress INTEGER NOT NULL,
  "lastActivity" DATE NOT NULL,
  -- Subject Progress
  maths_progress INTEGER NOT NULL DEFAULT 0,
  science_progress INTEGER NOT NULL DEFAULT 0,
  social_science_ethics_progress INTEGER NOT NULL DEFAULT 0,
  financial_literacy_progress INTEGER NOT NULL DEFAULT 0,
  -- Subject Scores
  maths_score INTEGER NOT NULL DEFAULT 0,
  science_score INTEGER NOT NULL DEFAULT 0,
  social_science_ethics_score INTEGER NOT NULL DEFAULT 0,
  financial_literacy_score INTEGER NOT NULL DEFAULT 0,
  strengths TEXT[] NOT NULL DEFAULT '{}',
  improvements TEXT[] NOT NULL DEFAULT '{}',
  "aiRecommendation" TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teacher_students relationship table
CREATE TABLE IF NOT EXISTS public.teacher_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES public.teachers(id),
  student_id UUID NOT NULL REFERENCES public.students(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(teacher_id, student_id)
);

-- Create cognitive_analysis table
CREATE TABLE IF NOT EXISTS public.cognitive_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id),
  turn_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  timestamp_prompt TIMESTAMP WITH TIME ZONE NOT NULL,
  timestamp_response TIMESTAMP WITH TIME ZONE NOT NULL,
  ai_prompt_text TEXT NOT NULL,
  user_response_text TEXT NOT NULL,
  topic_tag TEXT NOT NULL,
  prompt_type_tag TEXT NOT NULL,
  response_relevance_score DECIMAL(3,2) NOT NULL,
  metacognitive_flags TEXT[] NOT NULL DEFAULT '{}',
  novelty_score DECIMAL(3,2) NOT NULL,
  cross_session_link_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on student_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_cognitive_analysis_student_id ON public.cognitive_analysis(student_id);

-- Create a function to insert a teacher with hashed password
CREATE OR REPLACE FUNCTION public.insert_teacher_with_details(
  p_name TEXT,
  p_emp_id TEXT,
  p_username TEXT,
  p_password TEXT
)
RETURNS UUID AS $$
DECLARE
  v_teacher_id UUID;
BEGIN
  INSERT INTO public.teachers (name, emp_id, emp_username, emp_password)
  VALUES (p_name, p_emp_id, p_username, p_password)
  RETURNING id INTO v_teacher_id;
  
  RETURN v_teacher_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to create cognitive_analysis table
CREATE OR REPLACE FUNCTION public.create_cognitive_analysis_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.cognitive_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id),
    turn_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    timestamp_prompt TIMESTAMP WITH TIME ZONE NOT NULL,
    timestamp_response TIMESTAMP WITH TIME ZONE NOT NULL,
    ai_prompt_text TEXT NOT NULL,
    user_response_text TEXT NOT NULL,
    topic_tag TEXT NOT NULL,
    prompt_type_tag TEXT NOT NULL,
    response_relevance_score DECIMAL(3,2) NOT NULL,
    metacognitive_flags TEXT[] NOT NULL DEFAULT '{}',
    novelty_score DECIMAL(3,2) NOT NULL,
    cross_session_link_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Create index on student_id for faster lookups if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'cognitive_analysis' 
    AND indexname = 'idx_cognitive_analysis_student_id'
  ) THEN
    CREATE INDEX idx_cognitive_analysis_student_id ON public.cognitive_analysis(student_id);
  END IF;
END;
$$ LANGUAGE plpgsql; 