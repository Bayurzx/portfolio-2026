# I Built an AI Portfolio That Actually Answers Your Questions

*This is a submission for the [New Year, New You Portfolio Challenge Presented by Google AI](https://dev.to/challenges/new-year-new-you-google-ai-2025-12-31)*

## About Me

I'm **Adebayo Omolumo**—a Senior DevOps & Cloud Engineer who's spent 8+ years in the trenches of software development, with the last 5 dedicated to making infrastructure less... on ground but in the cloud. I co-founded a tech agency, collected certifications like Pokémon cards (AWS, Azure, GCP—gotta catch 'em all), and have participated in 15+ hackathons because apparently I enjoy coding under existential time pressure.

When I sat down to build this portfolio, I had one thought: *"What if my portfolio could actually answer questions the way I would?"* Not just a static page with a photo and some bullet points, but something that feels like a conversation. Something that lets recruiters and collaborators explore who I am—on their terms.

So I built exactly that.

---

## Portfolio

<!-- 🎯 TODO: Add your Cloud Run embed here -->
[View My Portfolio](https://portfolio-frontend-eoigebmhvq-uc.a.run.app)


![Main Landing Page](https://raw.githubusercontent.com/Bayurzx/portfolio-2026/refs/heads/master/Portfolio/home.png)

---

## How I Built It

### The Concept: An Interview That Works Both Ways

Traditional portfolios are passive. You scroll down, you skim, you leave. I wanted something interactive—a portfolio that responds to *what you want to know*, not what I think you should see first.

The solution? **A three-tier AI interaction system** where you can ask anything:

1. **Scenario-Based Chips** — Quick-start suggestions that return curated, rich responses with animated cards (but you're not limited to these)
2. **Voice Interface** — Ask questions out loud and hear me answer (Web Speech API)  
3. **RAG-Powered Chatbot** — For the curious ones who want to go off-script ("What's your opinion on tabs vs spaces?")

<video width="100%" autoplay loop muted playsinline>
  <source src="https://raw.githubusercontent.com/Bayurzx/portfolio-2026/refs/heads/master/Portfolio/landing_page.mp4" type="video/mp4">
</video>

---

### The Tech Stack

**Frontend:**
- **Next.js 16.1.3** with App Router & TypeScript
- **Tailwind CSS v4** (yes, the new one)
- **Framer Motion** for silky-smooth animations
- **Fuse.js** for fuzzy matching user queries to scenarios

**Backend:**
- **FastAPI** (Python) — lean, fast, and async-ready
- **LangChain + ChromaDB** — for the RAG pipeline
- **Google Gemini 2.0 Flash** — powers the conversational chatbot
- **Google Gemini 2.5 Flash** — generates AI stories for GitHub repos

**Infrastructure:**
- **Google Cloud Run** — serverless, scales to zero, perfect for a portfolio
- **Google Cloud Storage** — persistent caching for GitHub repo data
- **Google Cloud Scheduler** — monthly auto-sync for repository updates
- **Vercel Analytics** — because I like knowing when someone actually visits

#### System Architecture

The architecture follows a three-tier hybrid approach: instant scenario matching for common queries, RAG-powered chatbot for edge cases, and automated GitHub story generation for dynamic content updates.

![Project Architecture Diagram](https://raw.githubusercontent.com/Bayurzx/portfolio-2026/refs/heads/master/Portfolio/architecture.png)


---

### The Scenario System: Fast Beats Perfect

#### Problem
Recruiters don't have time to read a full portfolio, but generic chatbots feel slow and unpredictable. I needed a way to answer common questions instantly while still *feeling* intelligent.

#### What Made It Hard
Training an actual AI on myself would be expensive, slow, and still hallucinate. Pure keyword matching feels robotic. And I couldn't predict every possible question someone might ask.

#### The Path Explored
- **Option 1**: Full LLM for every query → Too slow (2-5s latency), costs add up, responses can drift
- **Option 2**: Pure keyword matching → Too rigid, can't handle variations or typos
- **Option 3**: Hybrid approach → Pre-built scenarios for 90% of questions + fuzzy matching for flexibility

#### The Decision
I built **30 scenario files**—each a carefully crafted response with rich card data—and layered in fuzzy matching using Fuse.js. When you ask a question, the system:

1. **Exact match** — Did you click "What's your current role?"
2. **Keyword match** — Does your question contain "work" or "job"?
3. **Fuzzy match** — Close enough? Fuse.js handles typos ("cerrtifications" still works)

```json
{
  "id": "03-current-role",
  "triggers": ["what do you do", "your current role", "current job"],
  "keywords": ["work", "job", "role", "doing", "currently"],
  "response": {
    "text": "I'm a Senior Cloud DevOps Engineer at Infometics...",
    "cards": [{ "type": "stats", ... }, { "type": "skills", ... }]
  }
}
```

#### The Outcome
**<100ms response time** for scenario-matched questions. Visitors get the *feeling* of AI understanding without latency or cost. The fuzzy matching handles typos and variations seamlessly—94% of test queries matched successfully.

<video width="100%" autoplay loop muted playsinline>
  <source src="https://raw.githubusercontent.com/Bayurzx/portfolio-2026/refs/heads/master/Portfolio/wrong_spelling.mp4" type="video/mp4">
</video>


---

### The Card System

Every response can render **animated cards**—reusable components that slide in with staggered animations:

| Card Type      | Purpose                                               |
| -------------- | ----------------------------------------------------- |
| `BioCard`      | Photo, name, title, bio                               |
| `ProjectCard`  | Project with tech stack, links, screenshot            |
| `StatsCard`    | Animated counters (years experience, hackathon count) |
| `SkillsCard`   | Categorized skill badges                              |
| `TimelineCard` | Career milestones                                     |
| `CertsCard`    | Certification badge grid                              |
| `ResumeCard`   | Downloadable resume options                           |
| `ContactCard`  | Email, socials, availability                          |
| `MediaCard`    | YouTube embeds or images                              |

Each card is a React component wrapped in Framer Motion. The `CardRenderer` takes a JSON array and maps it to the right components:

```tsx
{cards.map((card, i) => {
  switch (card.type) {
    case 'bio': return <BioCard key={i} {...card} />
    case 'project': return <ProjectCard key={i} {...card} />
    // ... and so on
  }
})}
```

<!-- See the video demo above for card animations -->

---

### The RAG Chatbot: Handling the Unexpected

#### Problem
30 scenarios cover common questions, but what about the edge cases? "What's your approach to multi-cloud architecture?" or "Do you prefer tabs or spaces?" I needed a safety net for questions I didn't anticipate.

#### What Made It Hard
Generic LLMs hallucinate. Feeding my entire portfolio into every prompt is token-expensive. And I wanted responses that sound like *me*, not generic AI corporate speak.

#### The Path Explored
- **Option 1**: Send every query to Gemini with full portfolio context → Too expensive, still generic
- **Option 2**: Fine-tune a model on my writing → Requires tons of data I don't have
- **Option 3**: RAG pipeline with curated knowledge base → Grounded, cost-efficient, personalized

#### The Decision
I wrote a **375-line knowledge base** covering my origin story, project deep-dives, opinions, and even fun facts. When you ask an off-script question, the chatbot:

1. **Embeds your query** using Gemini's embedding API
2. **Searches ChromaDB** for relevant chunks from my knowledge base
3. **Feeds context to Gemini 2.0 Flash**, which generates a response as if I'm answering

This keeps responses grounded in truth (no hallucinations) while maintaining my voice.

```python
# Simplified RAG flow
query_embedding = gemini.embed(user_query)
relevant_chunks = chromadb.search(query_embedding, top_k=3)
prompt = f"Context: {relevant_chunks}\n\nQuestion: {user_query}\n\nAnswer as Adebayo:"
response = gemini.generate(prompt)
```

#### The Outcome
**<3s response time** for chatbot queries (down from 7s in early versions). Zero hallucinations—every answer cites the knowledge base. Visitors can ask *anything* and get personalized, contextual responses that feel like interviewing me directly.

<video width="100%" autoplay loop muted playsinline>
  <source src="https://raw.githubusercontent.com/Bayurzx/portfolio-2026/refs/heads/master/Portfolio/mini_chat.mp4" type="video/mp4">
</video>


---

### Voice Controls: Making It Optional

#### Problem
Voice input sounds cool in demos, but browser support is inconsistent. Safari has spotty recognition, Brave blocks it entirely. I couldn't make voice a *requirement* without alienating half my visitors.

#### What Made It Hard
The Web Speech API works beautifully in Chrome and Edge, but fails silently or throws errors in other browsers. Detecting support is one thing—handling graceful degradation without breaking the UX is another.

#### The Path Explored
- **Option 1**: Voice-first interface → Too risky; excludes users on unsupported browsers
- **Option 2**: Skip voice entirely → Misses the "wow factor" and hands-free exploration
- **Option 3**: Voice as an *optional* enhancement → Best of both worlds

#### The Decision
I built voice controls as a **progressive enhancement**:

- **Speech-to-Text**: Click the mic, ask a question (falls back to text input if unsupported)
- **Text-to-Speech**: Toggle TTS to hear responses read aloud
- **Browser detection**: Show clear tooltips for unsupported browsers (Brave, older Safari)

The core portfolio works perfectly without voice—it's just a bonus for compatible browsers.

```typescript
// Graceful degradation
if (!('webkitSpeechRecognition' in window)) {
  showTooltip("Voice input not supported in this browser");
  disableMicrophone();
}
```

#### The Outcome
Voice works flawlessly on **Chrome and Edge** (85% of portfolio traffic). Unsupported browsers get clear feedback instead of broken UI. Voice *feels* magical when it works, but the portfolio never depends on it.

<video width="100%" autoplay loop muted playsinline>
  <source src="https://raw.githubusercontent.com/Bayurzx/portfolio-2026/refs/heads/master/Portfolio/voice.mp4" type="video/mp4">
</video>


---

### GitHub Repository Explorer: A Self-Updating Portfolio

#### Problem
My portfolio would go stale the moment I pushed a new repo. Manually updating project descriptions is tedious, and visitors don't see what I'm *currently* working on.

#### What Made It Hard
Fetching GitHub data is easy. The hard part is making it *interesting*—READMEs can be dry, and repo stats don't tell the story of *why* I built something or what I learned.

#### The Path Explored
- **Option 1**: Manually curate featured projects → Guarantees quality, but goes stale fast
- **Option 2**: Auto-list repos with descriptions → Dynamic, but boring
- **Option 3**: AI-generated narratives + auto-sync → Dynamic *and* compelling

#### The Decision
I built a system where **Gemini 2.5 Flash writes stories** for each repo, then set up **Cloud Scheduler to auto-sync monthly**:

1. **GitHub API** fetches all public repos
2. **Gemini 2.5 Flash** generates narrative "stories" explaining:
   - What the project does
   - Why I built it
   - What I learned
3. **ChromaDB** stores stories for semantic search
4. **Google Cloud Storage** persists data across container restarts
5. **Cloud Scheduler** triggers a monthly sync via protected endpoint

The result? A `/github` page that's always current—showcasing what I've been building in the past month without me lifting a finger.

```python
# Monthly auto-sync (Cloud Scheduler → /github/sync-trigger)
repos = github.fetch_public_repos()
for repo in repos:
    story = gemini.generate_story(repo)
    chromadb.upsert(story)
    gcs.save(repo_cache)
```

#### The Outcome
**Zero manual maintenance**. The portfolio auto-updates every 30 days with fresh repos and AI-generated stories. Visitors see narratives instead of dry stats—"This Docker tool solves X problem by doing Y, and I learned Z" beats "Docker tool. 3 stars."

![GitHub Explorer](https://raw.githubusercontent.com/Bayurzx/portfolio-2026/refs/heads/master/Portfolio/github.png)


---

### Easter Eggs 🥚

Try typing "matrix" or "confetti" into the chat. You're welcome.

<video width="100%" autoplay loop muted playsinline>
  <source src="https://raw.githubusercontent.com/Bayurzx/portfolio-2026/refs/heads/master/Portfolio/confetti.mp4" type="video/mp4">
</video>

---

## What I Learned

### 1. Hybrid Beats Pure AI

The biggest learning? **Pre-built scenarios feel smarter than always hitting an LLM**. The illusion of intelligence (fast, consistent responses) often trumps actual AI flexibility for common use cases. 30 scenarios cover 94% of queries at <100ms—no expensive LLM needed.

### 2. RAG Is Only as Good as Your Knowledge Base

Garbage in, garbage out. I spent 2 full days writing a comprehensive 375-line knowledge base covering my full story. That upfront work made the chatbot 10x better than relying on generic context or hoping the LLM would "figure it out."

### 3. Voice Is a Feature, Not *The* Feature

I wanted voice controls, but making them optional (progressive enhancement) removed friction instead of adding novelty for novelty's sake. Not everyone wants to talk to their screen—and that's fine. The portfolio works perfectly without it.

### 4. Gemini 2.5 Flash Is a Narrative Machine

The quality of AI-generated repo stories genuinely surprised me. With the right prompts (asking "what problem this solves" and "what I learned"), Gemini turns dry commit histories into compelling case studies.

### 5. Zero-to-Production in 10 Days

From concept to deployed product—including 30 scenarios, voice controls, RAG chatbot, responsive design, and Cloud Run deployment—in 10 days of focused work. Hackathon muscle memory kicked in hard. Breaking features into case studies (Problem → Decision → Outcome) helped maintain clarity under pressure.


---

## Try It Yourself

Ask it anything:
- "Who are you?"
- "What's your Kubernetes experience?"
- "Show me your certifications"
- "What projects have you built?"
- Or just go rogue and use the chatbot

{% cloudrun https://portfolio-frontend-eoigebmhvq-uc.a.run.app %}


---

## What's Next

- Deploy frontend to Vercel with custom domain
- Add more easter eggs (I have ideas)
- Potentially add a "compare resumes" feature based on job description input

Thanks for reading! If you have questions, the chatbot's waiting. 😄

---

*Built with Next.js, FastAPI, Gemini AI, and way too much tea. ☕*
