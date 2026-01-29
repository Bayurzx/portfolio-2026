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
- **Google Gemini 2.5 Flash** — powers both the chatbot and generates AI stories for repos

**Infrastructure:**
- **Google Cloud Run** — serverless, scales to zero, perfect for a portfolio
- **Google Cloud Storage** — persistent caching for GitHub repo data
- **Vercel Analytics** — because I like knowing when someone actually visits

![Project Architecture Diagram](https://raw.githubusercontent.com/Bayurzx/portfolio-2026/refs/heads/master/Portfolio/architecture.png)

---

### The Scenario System

Instead of training a model on myself (creepy, and expensive), I wrote **30 scenario files**—each one a carefully crafted response to a common question.

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

When you click a suggestion (or speak a question), the system:
1. **Exact match** — Did you click "What's your current role?"
2. **Keyword match** — Does your question contain "work" or "job"?
3. **Fuzzy match** — Close enough? Fuse.js handles typos and variations

This gives the *feeling* of AI understanding without the latency or cost.

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

### The RAG Chatbot

For questions that don't match a scenario, there's the ✨ floating chat widget.

It's powered by **LangChain** with a **Gemini 2.5 Flash** model, grounded in a knowledge base I wrote about myself. The RAG pipeline:

1. User sends a message
2. Backend embeds it with Gemini
3. ChromaDB finds relevant context from my knowledge base
4. Gemini generates a response *as if I'm answering*

The knowledge base includes everything—my origin story, project deep-dives, cloud platform opinions, even fun facts. It's like having a digital twin (minus the existential crisis).

<video width="100%" autoplay loop muted playsinline>
  <source src="https://raw.githubusercontent.com/Bayurzx/portfolio-2026/refs/heads/master/Portfolio/mini_chat.mp4" type="video/mp4">
</video>

---

### Voice Controls

Because typing is so 2025, I added Web Speech API integration:

- **Speech-to-Text** — Click the mic, ask a question
- **Text-to-Speech** — Toggle TTS and hear responses read aloud

It works great on Chrome and Edge. Safari... tries its best. I added graceful fallbacks and a polite tooltip for unsupported browsers like Brave 😞.

<video width="100%" autoplay loop muted playsinline>
  <source src="https://raw.githubusercontent.com/Bayurzx/portfolio-2026/refs/heads/master/Portfolio/voice.mp4" type="video/mp4">
</video>

---

### Bonus: GitHub Repository Explorer

I went a bit overboard and added a `/github` page that:

1. Fetches my public repos from the GitHub API
2. Uses **Gemini 2.5 Flash** to generate narrative "stories" for each repo
3. Stores everything in **ChromaDB** for semantic search
4. Persists to **Google Cloud Storage** so it survives container restarts
5. **Auto-maintainer System** — I set up a **Cloud Scheduler** cron job that hits a protected backend endpoint (`/github/sync-trigger`) every 30 days. It wakes up the container, fetches new repos, generates fresh AI stories, and rebuilds the vector index. The portfolio stays current even if I disappear into the woods.

The result? A page where my repos aren't just listed—they're *explained*.

![GitHub Explorer](https://raw.githubusercontent.com/Bayurzx/portfolio-2026/refs/heads/master/Portfolio/github.png)

---

### Easter Eggs 🥚

Try typing "matrix" or "confetti" into the chat. You're welcome.

<video width="100%" autoplay loop muted playsinline>
  <source src="https://raw.githubusercontent.com/Bayurzx/portfolio-2026/refs/heads/master/Portfolio/confetti.mp4" type="video/mp4">
</video>

---

## What I'm Most Proud Of

### 1. The Scenario System Actually Works

I was worried the fuzzy matching would feel janky, but Fuse.js + keyword fallback makes it feel surprisingly smart. Visitors don't know (or care) that it's not "real" AI—they just get fast, relevant answers.

### 2. The Card Animations

Every card slides in with staggered timing, hovers with subtle transforms, and the stats counters animate from zero. It sounds small, but the micro-interactions make the whole experience feel polished and premium.

### 3. Zero-to-Production in 10 Days

From concept to deployed product—including 30 scenarios, voice controls, a RAG chatbot, responsive design, and Cloud Run deployment—in 10 days of focused work. Hackathon muscle memory kicked in hard.

### 4. The GitHub Explorer Bonus

This wasn't in the original plan, but I wanted my repos to tell stories instead of just listing name/description/stars. Gemini writing narratives for each project? *Chef's kiss.* 👨🍳

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

*Built with Next.js, FastAPI, Gemini AI, and way too much coffee. ☕*
