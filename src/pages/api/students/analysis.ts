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
                        content: `You are an experienced educational psychologist and learning specialist. Your role is to analyze student cognitive data and provide detailed, contextual recommendations that explain both the 'what' and the 'why' of your suggestions.

You MUST follow these instructions precisely:
1. Analyze the student data provided in JSON format.
2. Calculate the metrics based on the rules below.
3. Generate a single, well-formed JSON object as your output.
4. Do not include any text before or after the JSON object.
5. Ensure all numeric values are numbers, not strings.
6. Use 0 for any metrics that cannot be calculated due to insufficient data.

Calculation Rules:
- avg_response_time: Average of (timestamp_response - timestamp_prompt) in seconds.
- avg_deliberation_time_creative: Average response time ONLY for turns where prompt_type_tag is creative_prompt or open_ended.
- verbal_expressiveness: Average word count of user_response_text.
- topic_cohesion_score: Average of response_relevance_score, expressed as a percentage.
- distraction_index: Count of turns where response_relevance_score is below 0.5.
- metacognition_score: Total count of all items within all metacognitive_flags arrays.
- reasoning_dominant_style: Identify if deductive_reasoning or creative_prompt turns are more common.
- creative_problem_solving_index: Average of novelty_score.
- short_term_recall_success_rate: Percentage of turns with prompt_type_tag = direct_recall that have a response_relevance_score > 0.8.
- knowledge_synthesis_links: Count of turns where cross_session_link_id is NOT null.

Personality Analysis Rules:
Based on the cognitive metrics, determine the student's dominant personality traits and associated adjectives:
- "Analytical Mind": "logical, methodical, detail-oriented"
- "Creative Explorer": "innovative, curious, experimental"
- "Reflective Learner": "thoughtful, introspective, systematic"
- "Quick Thinker": "agile, intuitive, responsive"
- "Deep Processor": "contemplative, thorough, focused"
- "Social Connector": "collaborative, engaging, communicative"
- "Focused Achiever": "determined, organized, consistent"

Strengths and Weaknesses Analysis:
Based on all cognitive metrics, identify:
- strengths: List of 3-5 specific cognitive strengths (e.g., "Problem Solving", "Critical Thinking", "Creative Ideation", "Analytical Reasoning", "Focus", "Memory Recall")
- weaknesses: List of 3-5 specific cognitive areas for improvement (e.g., "Concentration", "Time Management", "Abstract Reasoning", "Verbal Expression", "Pattern Recognition")

Your analysis should be formatted as a JSON object with this structure:
{
  "pace_and_processing": {
    "cognitive_fluency_seconds": number,
    "deliberation_time_creative_seconds": number,
    "verbal_expressiveness_avg_words": number,
    "summary": string
  },
  "attention_and_focus": {
    "topic_cohesion_percent": number,
    "distraction_events": number,
    "summary": string
  },
  "reasoning_and_problem_solving": {
    "dominant_reasoning_style": string,
    "creative_problem_solving_score": number,
    "metacognition_events": number,
    "summary": string
  },
  "memory_and_synthesis": {
    "short_term_recall_percent": number,
    "cross_session_links_made": number,
    "summary": string
  },
  "personality_profile": {
    "dominant_trait": string,
    "trait_score": number,
    "trait_description": string,
    "learning_style_match": string
  },
  "cognitive_assessment": {
    "strengths": string[],
    "weaknesses": string[]
  }
}`
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.1, // Lower temperature for more consistent JSON output
                max_completion_tokens: 1000
            }),
        });

        console.log("Groq API response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Groq API error response:", errorText);
            throw new Error(`Groq API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("Groq API response data structure:", {
            hasChoices: Boolean(data.choices),
            choicesLength: data.choices?.length,
            hasFirstChoice: Boolean(data.choices?.[0]),
            hasMessage: Boolean(data.choices?.[0]?.message),
            messageContent: data.choices?.[0]?.message?.content?.substring(0, 100) + "..."
        });

        if (!data.choices?.[0]?.message?.content) {
            throw new Error("Invalid response format from Groq API");
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error in query function:", error);
        throw new Error(`Failed to get analysis from Groq: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

interface CognitiveAnalysis {
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
    cross_session_link_id: string | null;
}

interface StudentData {
    cognitiveAnalysis: CognitiveAnalysis[];
}

export const POST: APIRoute = async ({ request }) => {
    if (request.headers.get("Content-Type") !== "application/json") {
        return new Response(
            JSON.stringify({ error: "Content-Type must be application/json" }),
            { status: 400 }
        );
    }

    try {
        const studentData: StudentData = await request.json();

        // Validate student data
        if (!studentData?.cognitiveAnalysis || !Array.isArray(studentData.cognitiveAnalysis)) {
            return new Response(
                JSON.stringify({ error: "Invalid student data format - missing cognitive analysis data" }),
                { status: 400 }
            );
        }

        // Create a prompt for cognitive analysis
        const analysisPrompt = `Analyze this student's cognitive data and generate a detailed analysis report:

${JSON.stringify(studentData.cognitiveAnalysis, null, 2)}

Generate a cognitive analysis report following the calculation rules and format specified in the system prompt.

The response should be a JSON object with this exact structure:
{
    "pace_and_processing": {
        "cognitive_fluency_seconds": number,
        "deliberation_time_creative_seconds": number,
        "verbal_expressiveness_avg_words": number,
        "summary": string
    },
    "attention_and_focus": {
        "topic_cohesion_percent": number,
        "distraction_events": number,
        "summary": string
    },
    "reasoning_and_problem_solving": {
        "dominant_reasoning_style": string,
        "creative_problem_solving_score": number,
        "metacognition_events": number,
        "summary": string
    },
    "memory_and_synthesis": {
        "short_term_recall_percent": number,
        "cross_session_links_made": number,
        "summary": string
    },
    "personality_profile": {
        "dominant_trait": string,
        "trait_score": number,
        "trait_description": string,
        "learning_style_match": string
    },
    "cognitive_assessment": {
        "strengths": string[],
        "weaknesses": string[]
    }
}`;

        try {
            console.log("Sending analysis prompt:", analysisPrompt);

            // Get the analysis from Groq
            const analysisResponse = await query(analysisPrompt);
            console.log("Raw analysis response:", analysisResponse);

            // Parse the JSON response
            let analysis;
            try {
                analysis = JSON.parse(analysisResponse);
                console.log("Parsed analysis:", analysis);

                // Validate the analysis structure
                if (!analysis ||
                    !analysis.pace_and_processing ||
                    !analysis.attention_and_focus ||
                    !analysis.reasoning_and_problem_solving ||
                    !analysis.memory_and_synthesis ||
                    !analysis.personality_profile) {

                    console.log("Invalid analysis structure received:", analysis);

                    // If the structure is invalid, create a default structure
                    analysis = {
                        pace_and_processing: {
                            cognitive_fluency_seconds: 0,
                            deliberation_time_creative_seconds: 0,
                            verbal_expressiveness_avg_words: 0,
                            summary: "Insufficient data to analyze processing patterns."
                        },
                        attention_and_focus: {
                            topic_cohesion_percent: 0,
                            distraction_events: 0,
                            summary: "Not enough interaction data to assess focus levels."
                        },
                        reasoning_and_problem_solving: {
                            dominant_reasoning_style: "Not enough data",
                            creative_problem_solving_score: 0,
                            metacognition_events: 0,
                            summary: "More problem-solving interactions needed for analysis."
                        },
                        memory_and_synthesis: {
                            short_term_recall_percent: 0,
                            cross_session_links_made: 0,
                            summary: "Insufficient data to evaluate memory patterns."
                        },
                        personality_profile: {
                            dominant_trait: "Not enough data",
                            trait_score: 0,
                            trait_description: "No dominant trait identified",
                            learning_style_match: "No learning style match identified"
                        },
                        cognitive_assessment: {
                            strengths: ["Problem Solving", "Critical Thinking", "Analytical Reasoning"],
                            weaknesses: ["Concentration", "Time Management", "Abstract Reasoning"]
                        }
                    };
                }
            } catch (e) {
                console.error("Error parsing analysis response:", e);
                console.error("Raw response that failed to parse:", analysisResponse);
                // Return a structured error response
                return new Response(JSON.stringify({
                    error: "Failed to parse analysis response",
                    details: "The analysis service returned an invalid response format",
                    raw_response: analysisResponse
                }), {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }

            return new Response(JSON.stringify({
                analysis
            }), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            console.error("Error in AI analysis:", error);
            console.error("Full error details:", {
                message: error instanceof Error ? error.message : "Unknown error",
                stack: error instanceof Error ? error.stack : undefined,
                error
            });
            return new Response(JSON.stringify({
                error: "Failed to generate AI analysis",
                details: error instanceof Error ? error.message : "Unknown error",
                errorType: error instanceof Error ? error.constructor.name : typeof error
            }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
    } catch (error) {
        console.error("Error in student data processing:", error);
        return new Response(JSON.stringify({
            error: "Failed to process student data",
            details: error instanceof Error ? error.message : "Unknown error"
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
};

// Make sure this is exported for Astro to recognize it
export const prerender = false; 