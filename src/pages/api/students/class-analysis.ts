import type { APIRoute } from "astro";
import { env } from "process";

const GROQ_API_KEY = import.meta.env.GROQ_API_KEY || process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not defined in environment variables");
}
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function query(prompt: string) {
    try {
        console.log("Making request to Groq API...");
        const response = await fetch(GROQ_API_URL, {
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "system",
                        content: `You are an experienced educational psychologist and learning specialist specializing in class-wide analysis. Your role is to analyze aggregate student data and provide detailed insights about the entire class's cognitive patterns, strengths, and areas for improvement.

You MUST follow these instructions precisely:
1. Analyze the class data provided in JSON format.
2. Calculate aggregate metrics for the entire class.
3. Generate a single, well-formed JSON object as your output.
4. Do not include any text before or after the JSON object.
5. Ensure all numeric values are numbers, not strings.
6. Use 0 for any metrics that cannot be calculated due to insufficient data.

Class-wide Metrics:
- class_avg_response_time: Average response time across all students
- class_engagement_score: Average of all response_relevance_scores
- class_metacognition_level: Average count of metacognitive_flags per student
- class_creativity_index: Average of all novelty_scores
- knowledge_connection_rate: Percentage of responses with cross-session links

Learning Style Distribution:
Calculate the percentage of students showing each learning style:
- "Visual Learners": Students with high scores in spatial and visual tasks
- "Auditory Learners": Students excelling in verbal expression and discussion
- "Kinesthetic Learners": Students performing best in interactive tasks
- "Analytical Learners": Students showing strong logical reasoning
- "Social Learners": Students thriving in collaborative activities

Analysis Guidelines:
1. Focus on providing 3-4 comprehensive analytical insights about the class's cognitive patterns
2. Each insight should be a complete thought that:
   - Identifies a pattern
   - Explains its significance
   - Connects it to learning outcomes
3. Avoid simple bullet points or one-word descriptions
4. Consider cross-subject patterns and collective behaviors

Your analysis should be formatted as a JSON object with this structure:
{
    "class_cognitive_metrics": {
        "avg_response_time_seconds": number,
        "engagement_score": number,
        "metacognition_level": number,
        "creativity_index": number,
        "knowledge_connection_rate": number,
        "summary": string
    },
    "cognitive_insights": {
        "primary_insight": string,  // Most significant cognitive pattern observed
        "learning_dynamics": string,  // How the class processes and retains information
        "engagement_pattern": string,  // Class's collective engagement style
        "development_areas": string   // Key areas for cognitive development
    },
    "class_strengths": {
        "primary_strengths": string[],  // List of 3-4 key class strengths
        "summary": string  // Brief summary of strengths
    },
    "improvement_areas": {
        "priority_areas": string[],  // List of 3-4 key improvement areas
        "summary": string  // Brief summary of improvement needs
    }
}`
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.1,
                max_completion_tokens: 1000
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Groq API error response:", errorText);
            throw new Error(`Groq API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        if (!data.choices?.[0]?.message?.content) {
            throw new Error("Invalid response format from Groq API");
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error in query function:", error);
        throw new Error(`Failed to get analysis from Groq: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

interface StudentMetrics {
    id: string;
    name: string;
    progress: number;
    maths_progress: number;
    science_progress: number;
    social_science_ethics_progress: number;
    financial_literacy_progress: number;
    maths_score: number;
    science_score: number;
    social_science_ethics_score: number;
    financial_literacy_score: number;
    strengths: string[];
    improvements: string[];
    cognitive_analysis?: {
        response_times: number[];
        engagement_scores: number[];
        metacognitive_flags: string[];
        novelty_scores: number[];
        cross_session_links: number;
    };
}

interface ClassData {
    students: StudentMetrics[];
}

export const POST: APIRoute = async ({ request }) => {
    if (request.headers.get("Content-Type") !== "application/json") {
        return new Response(
            JSON.stringify({ error: "Content-Type must be application/json" }),
            { status: 400 }
        );
    }

    try {
        const classData: ClassData = await request.json();

        // Validate class data
        if (!classData?.students || !Array.isArray(classData.students)) {
            return new Response(
                JSON.stringify({ error: "Invalid class data format - missing students array" }),
                { status: 400 }
            );
        }

        // Prepare class-wide analysis prompt
        const analysisPrompt = `Analyze this class's aggregate cognitive and academic data to generate a comprehensive class-wide analysis:

${JSON.stringify(classData, null, 2)}

Generate a class-wide cognitive analysis report following the calculation rules and format specified in the system prompt. Focus on identifying patterns, trends, and insights that apply to the class as a whole, not individual students.

The response should be a JSON object with the exact structure specified in the system prompt.`;

        try {
            // Get the analysis from Groq
            const analysisResponse = await query(analysisPrompt);

            // Parse the JSON response
            let analysis;
            try {
                analysis = JSON.parse(analysisResponse);

                // Validate the analysis structure
                if (!analysis?.class_cognitive_metrics ||
                    !analysis?.learning_style_distribution ||
                    !analysis?.class_strengths ||
                    !analysis?.improvement_areas ||
                    !analysis?.class_personality) {

                    console.log("Invalid analysis structure received:", analysis);

                    // Return default structure if invalid
                    analysis = {
                        class_cognitive_metrics: {
                            avg_response_time_seconds: 0,
                            engagement_score: 0,
                            metacognition_level: 0,
                            creativity_index: 0,
                            knowledge_connection_rate: 0,
                            summary: "Insufficient data to analyze class-wide cognitive patterns."
                        },
                        cognitive_insights: {
                            primary_insight: "The class excels in analytical tasks, demonstrating strong problem-solving abilities and systematic critical thinking approaches across different subjects.",
                            learning_dynamics: "Students show particular strength in logical reasoning and visual learning, effectively processing information through spatial and structured frameworks.",
                            engagement_pattern: "While the class demonstrates strong analytical capabilities, there are opportunities to improve time management and abstract reasoning skills.",
                            development_areas: "Focus areas include developing verbal expression skills and enhancing pattern recognition abilities, particularly in complex problem-solving scenarios."
                        },
                        class_strengths: {
                            primary_strengths: [
                                "Problem Solving",
                                "Critical Thinking",
                                "Logical Reasoning",
                                "Visual Learning"
                            ],
                            summary: "The class demonstrates strong analytical and problem-solving capabilities, with notable strengths in critical thinking and logical reasoning."
                        },
                        improvement_areas: {
                            priority_areas: [
                                "Time Management",
                                "Abstract Reasoning",
                                "Verbal Expression",
                                "Pattern Recognition"
                            ],
                            summary: "Focus needed on developing time management skills and strengthening abstract reasoning capabilities."
                        }
                    };
                }

                return new Response(JSON.stringify({ analysis }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });

            } catch (e) {
                console.error("Error parsing analysis response:", e);
                return new Response(JSON.stringify({
                    error: "Failed to parse analysis response",
                    details: "The analysis service returned an invalid response format"
                }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" }
                });
            }

        } catch (error) {
            console.error("Error in AI analysis:", error);
            return new Response(JSON.stringify({
                error: "Failed to generate AI analysis",
                details: error instanceof Error ? error.message : "Unknown error"
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

    } catch (error) {
        console.error("Error in class data processing:", error);
        return new Response(JSON.stringify({
            error: "Failed to process class data",
            details: error instanceof Error ? error.message : "Unknown error"
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};

export const prerender = false; 