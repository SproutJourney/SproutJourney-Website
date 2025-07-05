# SproutJourney 🌱  
**Reimagining Early Education in India with Generative AI**

---

## 🎥 Pitch Video

We’ve created a **2-minute pitch video** that showcases our product through animated storytelling, real interface demonstration, and a deep dive into the technical and emotional design of SproutJourney.

🔗 [Watch on YouTube](https://youtu.be/cAcVhKH7nig)

> 🎙️ *Note: The voiceover uses AI-generated audio (via ElevenLabs)* as part of our product testing. We believe voice is key to immersion, accessibility, and retention for early learners, especially those with reading difficulties.

---

## 📄 Framework & Technical Document

You can explore our complete technical breakdown here:  
📄 [SproutJourney_Framework.pdf](./Sproutjourney_KushalAgrawal_Jazzee2025_Document.pdf)

> ✍️ *This document was assisted by AI formatting tools, but all architectural, educational, and narrative elements were developed entirely by our team.*

---

## 🛠️ Tech Stack & Architecture

### Gen-AI & Agent Intelligence
- **Gemma 2.5B** (fine-tuned locally with LoRA)
- Also experimenting with **LLaMA 3.1 8B** and **Flan-T5**
- **Multi-agent LLM system** with subject-specialist agents (e.g., Eli the Elephant for Social Science)
- **Custom RAG pipeline** with concept-specific retrieval nodes per agent
- **Language Graphs** to structure grade-wise content with Bloom’s taxonomy, cognitive depth, and cultural context
- Built-in **guardrails** for hallucination prevention and child-safe response control

### Orchestration & Voice Interaction
- **LangChain + LangGraph** for multi-agent logic and decision flow
- **ChromaDB** (testing) with plans to shift to **scalable vector DB**
- **TTS & Voice AI** using **ElevenLabs** and **Azure AI Voice** (in progress)
- **Speech-based narration + gamified character interaction** with custom voice embedding for each domain agent

### Front-End & Deployment
- Built in **Unity Engine** for immersive storytelling and interaction
- Gamified quizzes, moral dilemmas, and learning simulations
- Hosted via **Hyperstack GPU platform** + Python Flask backend

### Experimental Extensions
- Integration of **Stable Diffusion** and **video generation models** for dynamic visual feedback
- Ongoing adaptation for multilingual support and edge-deployment in low-connectivity schools

---

## 🎯 Core Features

- **Multi-agent Gen-AI system** with distinct subject-personas and personalities
- **Curriculum-trained (NCERT)** + **cultural grounding** (Bhagavad Gita, Indian epics)
- **Dynamic Learning Modes:**
  - StoryTime → LearningTime → ThinkingTime → FunTime
- **Cognitive Fingerprinting Engine** to identify strengths, weaknesses & learning styles
- **Practical curriculum modules:** Financial literacy, civic values, empathy, and ethics
- **Inclusive Design:** For neurodiverse children, early readers, and low-literacy students
- **Teacher Dashboard:** Real-time insights, adaptive suggestions, and early alerts

---

## 🗂️ Repository Status

This repository includes:
- Pitch video
- Framework document
- Voice testing declarations

⚠️ **Codebase is under active development**  
Due to its modular nature and sensitive components (e.g., moderation filters, agent weights), full code access is currently private.

📬 *For access or evaluation, feel free to reach out directly.*

---

## ✅ Declaration

- This submission is an **original product** by Team SproutJourney.
- All AI voice, visuals, and architecture are part of active system integration—not placeholders.
- Document structuring was AI-assisted, but all IP, logic, and creativity are entirely our own.
- Product demos are fully working prototypes and being tested with users.

---

## 🌱 Summary

SproutJourney is a multi-agent, culturally grounded, AI-powered education platform that adapts to how *each* child thinks, feels, and learns. With safe, inclusive, and emotionally intelligent systems, we’re building not just learners—but lifelong thinkers, ethical decision-makers, and future-ready citizens.

Let’s reshape education—one child, one story, one conversation at a time.
