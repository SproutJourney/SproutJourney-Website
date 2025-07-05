import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ params }) => {
    try {
        const { id } = params;

        if (!id) {
            return new Response(
                JSON.stringify({ error: 'Student ID is required' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const { data: student, error } = await supabase
            .from('students')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching student:', error);
            return new Response(
                JSON.stringify({ error: 'Failed to fetch student data' }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        if (!student) {
            return new Response(
                JSON.stringify({ error: 'Student not found' }),
                {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Add mock data for demo if needed
        const enhancedStudent = {
            ...student,
            // Add default values for required fields if they don't exist
            maths_progress: student.maths_progress || 75,
            maths_score: student.maths_score || 70,
            science_progress: student.science_progress || 85,
            science_score: student.science_score || 80,
            social_science_ethics_progress: student.social_science_ethics_progress || 65,
            social_science_ethics_score: student.social_science_ethics_score || 60,
            financial_literacy_progress: student.financial_literacy_progress || 70,
            financial_literacy_score: student.financial_literacy_score || 65,
            strengths: student.strengths || ['Critical Thinking', 'Problem Solving'],
            weaknesses: student.weaknesses || ['Time Management'],
            improvements: student.improvements || ['Focus', 'Organization'],
            progress: student.progress || 75,
        };

        return new Response(
            JSON.stringify(enhancedStudent),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        console.error('Error in student API:', error);
        return new Response(
            JSON.stringify({
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};

// Disable prerendering for this endpoint
export const prerender = false; 