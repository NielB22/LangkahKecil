# PROJECT_CONTEXT.md — LangkahKecil

> **Reference for Codex:** Read this document and the original `GUIDEBOOK HORIZON.pdf` before implementation. This is a planning specification, not proof that features are already built.

## 1. Project identity

- **Name:** LangkahKecil
- **Tagline:** *One Instruction at a Time, Learning Made Accessible*
- **Positioning:** AI-Powered Inclusive Visual Instruction Builder
- **Competition:** HORIZON 2026 — Crack the Egg, Web Development
- **Developer:** Solo
- **Focus:** SDG 4 / inclusive education
- **Selected subtheme:** “Minimnya Akses Pendidikan Inklusif bagi Anak Berkebutuhan Khusus”
- **Delivery:** Responsive, deployed website and GitHub repository

**One-sentence concept:** A teacher-centered website that converts classroom instructions into editable, accessible step-by-step visual cards, with progressive help and digital/print output.

## 2. Competition requirements — from guidebook

According to pages 4–5, 8–9 and 13 of the uploaded guidebook:

- The competition emphasizes SDG 4 (Quality Education) and a responsive website solving an educational problem.
- The selected subtheme addresses limited inclusive educational access for children with special educational needs.
- Work must be original, not previously commercially published or a winner in a similar competition.
- Instant website templates/platforms such as WordPress and Wix are prohibited.
- AI is allowed, but participants are responsible for ethical use, user-data protection, privacy, security, and copyright.
- Website must be ready to use and **deployed**.
- Preliminary submission: GitHub repository + hosted website URL, with a README describing background, aims, features, technology stack and usage.
- Registration: **7–18 November 2026**, deadline **23:59 WIB**.
- Technical meeting: **18 November 2026, 19:00 WIB**.
- Development: **18–25 November 2026**.
- Submission deadline: **25 November 2026, 23:59 WIB**.
- Judging: **28 November 2026, 08:00–12:00 WIB**.
- Announcement: **28 November 2026, 17:00 WIB**.

**Uncertainties:** The guidebook does not explicitly settle whether technical meeting/judging require physical attendance. Page 5 lists two subthemes but page 8 refers to four; confirm with organizers. It does not specify a maximum percentage of AI-generated code.

## 3. Problem and evidence

**Problem hypothesis:** Inclusive-primary-school teachers need to prepare understandable visual, step-by-step instructions for children who benefit from structured learning support, but preparing and adapting those materials can require time and resources.

**Context/evidence to verify before publication:**
- UNICEF Indonesia has discussed teacher preparation and resource barriers in inclusive education.
- UNICEF/BAPPENAS (2023) has covered barriers to education and social inclusion for children with disabilities.
- Visual-support practices for autistic learners have educational research support (e.g. National Professional Development Center on Autism).
- Earlier discussion referred to a 2025 Bogor-area study of limited adaptive teaching media; **do not repeat its specific figures without verifying the primary paper**.

These support the general problem area; they **do not prove** LangkahKecil saves teachers time or improves student outcomes. Validate the particular workflow by interviewing 2–3 teachers and testing representative activities. Do not invent study outcomes.

**Problem statement:** How might we help inclusive elementary school teachers turn multi-step classroom instructions into accessible, editable visual materials without preparing each card from scratch?

**Scope of audience:** Teacher/learning assistant is the primary website user. The child is the beneficiary, not necessarily a website user. Do not suggest that one layout is suitable for all children with disabilities. The product is **not** a disability diagnostic tool or an LMS.

## 4. Value proposition and USP

**Primary USP:** **Adaptive Visual Instructions — Online or Offline.**

Three pillars:
1. **AI Task Decomposition:** One compound classroom instruction becomes small, ordered actions in plain language.
2. **Progressive Assistance:** Each action includes an optional, more granular help cue, shown only when needed.
3. **Digital-to-Printable Delivery:** A teacher-reviewed activity works as an interactive single-step viewer and as printable cards/PDF.

The USP is their **combined teacher-centered workflow in Indonesian classrooms**, not a claim that any single feature or AI technique is novel.

**Competitive references:**
- Goblin Tools / Magic ToDo — AI task breakdown (`https://goblin.tools/Todo`)
- Tiimo — visual activity planning (`https://www.tiimoapp.com/`)
- LessonPix — printable visual teaching materials (`https://lessonpix.com/`)
- Boardmaker — symbol-based visual communication materials

Their precise feature coverage, language availability, and pricing require current verification. Do not claim “first” or “only”.

## 5. User journey

1. **Landing:** Teacher sees short explanation, demo cards, and “Create Activity”.
2. **Activity Builder:** Teacher enters title, instruction text, preferred language (`id-ID` or `en-US`), and simplification level (simple/detailed).
3. **AI Generation:** Frontend calls a secure server endpoint; LLM decomposes instruction, simplifies wording, writes optional help and selects an icon category.
4. **Review & Edit:** Teacher checks order and meaning, edits text/help/icons, adds/removes/reorders steps, and approves content.
5. **Delivery:** Teacher chooses:
   - **Digital:** A single step per screen with pictogram, big text, Play/Stop/Replay speech, “Need help?” toggle, navigation/progress.
   - **Print:** Consistent cards with main instruction and optionally help, styled for browser print / Save as PDF.
6. **Use:** Teacher presents on shared screen/tablet or distributes printed cards. Child account, phone, and internet are **not mandatory** for printed use.

**Example input:** “Keluarkan buku matematika, buka halaman 15, kerjakan nomor 1 sampai 3, lalu kumpulkan di meja guru.”

**Example output:**
1. Ambil buku matematika — help: Cari buku matematika di dalam tas.
2. Buka halaman 15 — help: Cari angka 15 pada halaman buku.
3. Kerjakan soal nomor 1, 2, dan 3 — help: Kerjakan satu nomor terlebih dahulu.
4. Kumpulkan buku di meja guru — help: Bawa buku ke meja guru dan letakkan di sana.

Always let the teacher correct assumptions (e.g. book location).

## 6. AI system

**Approach:** Pretrained Gemini LLM via API. **No model training, fine-tuning, RAG, autonomous agent framework, or n8n required.**

**AI tasks:** instruction decomposition, text simplification, help generation and classification into a **predefined** icon catalog. The UI, print output, progress and audio are not model-generated.

**Recommended JSON contract:**

```json
{
  "title": "Belajar Matematika",
  "language": "id-ID",
  "steps": [
    {
      "id": "step-1",
      "title": "Ambil buku matematika",
      "instruction": "Ambil buku matematika milikmu.",
      "help": "Cari buku matematika di dalam tas.",
      "icon": "book"
    }
  ]
}
```

**Prompt/model rules:**
- Preserve task order, exact page numbers, quantities and critical details.
- Do not invent actions or omit important constraints.
- One concrete action per step where possible.
- Use the selected language naturally and age-appropriately.
- Help is a smaller actionable hint, not a second unrelated task.
- Choose icons only from the allowlisted library.
- Return structured data, not Markdown.
- Teacher approval required before classroom use.

**Backend protections:** Keep model API key on server, validate request and response schema, limit length and requests, handle timeouts/rate limits/errors, and avoid sending child-identifying information to the LLM.

## 7. Bilingual audio

**Technology:** Browser **Web Speech API** (`speechSynthesis`, `SpeechSynthesisUtterance`). Free to call from the browser, no TTS API key or training.

- Languages: `id-ID`, `en-US`
- Default rate: **0.85**
- Pitch: `1`; volume: `1`
- Buttons: Play, Stop, Replay
- Check feature support, available voices (`getVoices()`), and `voiceschanged`.
- Cancel playback when navigating/unmounting to avoid overlap.
- If the exact locale voice is missing, show a graceful fallback/warning.
- **Speech synthesis does not translate:** Generate/approve card text in the selected language first.
- Voice quality/availability depends on device/browser.

Snippet:

```js
function speak(text, language = "id-ID") {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language;
  utterance.rate = 0.85;
  utterance.pitch = 1;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}
```

Build a React `AudioPlayer` that exposes explicit controls and manages `onstart`, `onend` and `onerror`.

## 8. Proposed stack and architecture

| Area | Choice |
|---|---|
| Frontend | React + Vite (JavaScript/JSX) |
| Styling | Tailwind CSS |
| Components | shadcn/ui where useful; custom accessible components |
| Pictograms | Curated, licensed pictogram set / Lucide where appropriate |
| AI | Gemini API |
| Server | Vercel Serverless Functions (`/api/generate`) |
| Audio | Web Speech API |
| PDF | Browser print CSS / Save as PDF |
| Persistence | `localStorage` for local drafts (optional) |
| Deployment | Vercel |
| Database | Not needed for MVP |

**Flow:** React Builder → `/api/generate` → Gemini → validated JSON → Review Editor → Digital Viewer / Print View.

Do not put `GEMINI_API_KEY` in `VITE_` environment variables or client bundles. Include `.env.example` without secrets. Build a deterministic demo fallback for API failures, clearly labeled as sample output.

## 9. Pages and components

**Pages**
1. `Landing` — problem, benefit, CTA, example.
2. `ActivityBuilder` — title/instruction, language, detail level, generate and loading/error.
3. `ReviewEditor` — inspect/edit/reorder all AI-generated step cards and approve.
4. `ActivityViewer` — single-step digital presentation, assistance, TTS, progress, print action.

**Potential components**
- `ActivityCard`
- `StepEditor`
- `AudioPlayer`
- `ProgressIndicator`
- `IconPicker`
- `PrintCards`

**Suggested structure:**

```text
langkahkecil/
├── api/
│   └── generate.js
├── public/
│   └── pictograms/
├── src/
│   ├── components/
│   │   ├── ActivityCard.jsx
│   │   ├── AudioPlayer.jsx
│   │   ├── StepEditor.jsx
│   │   └── ProgressIndicator.jsx
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── ActivityBuilder.jsx
│   │   ├── ReviewEditor.jsx
│   │   └── ActivityViewer.jsx
│   ├── services/
│   │   └── activityService.js
│   ├── utils/
│   │   └── speech.js
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── README.md
└── PROJECT_CONTEXT.md
```

## 10. MVP prioritization

**P0 — Must work**
- Responsive website
- Activity instruction form
- Secure Gemini generation of structured steps
- Validation and AI error states
- Full teacher review/edit before use
- Visual cards with allowlisted icons
- Progressive assistance per step
- Digital one-step viewer
- Print-friendly cards / PDF via browser

**P1 — Important**
- Indonesian/English text + speech
- Play, Stop, Replay and 0.85x speed
- Local draft persistence
- Safe sample/demo mode

**P2 — Stretch**
- QR sharing, templates, multiple visual themes

**Out of scope**
- Student login/accounts
- Full dashboard or LMS
- Student outcome analytics
- User database unless new needs justify it
- Image generation for each card
- Training/fine-tuning an ML model
- n8n or complex autonomous agent systems
- Payments

## 11. Solo development plan (18–25 Nov 2026)

| Date | Focus | Deliverable |
|---|---|---|
| 18 Nov | Scope, schema, wireframes, asset choices | Clear UI plan |
| 19 Nov | React/Vite, Tailwind, landing, builder | Working form |
| 20 Nov | Server endpoint, Gemini, validation | AI output |
| 21 Nov | Review/edit/reorder steps | Approved cards |
| 22 Nov | Digital viewer, help, TTS, print styles | Both output modes |
| 23 Nov | Test responsive/accessibility, prompts, errors | Stable MVP |
| 24–25 Nov | Deployment, README, demos, final QA | Live site & GitHub submission |

**Deadline:** Submit by **25 Nov 2026, 23:59 WIB**. Prioritize a working vertical slice over extras.

## 12. Validation and ethical boundaries

**Before making strong claims:**
- Interview 2–3 teachers or learning assistants about their existing instruction-material process.
- Test 10–15 diverse instructions for order preservation, omission, readability, icon relevance and help usefulness.
- If possible, measure creation time manually vs LangkahKecil with an explicit method.
- Confirm print legibility, mobile navigation, contrast, readable text and keyboard operability.
- Get adult/teacher review; do not treat generated material as universally suitable for every child.
- Do not collect personally identifiable information about children for the MVP.

**Claims not to make without evidence:** “Proven to improve learning outcomes”, “cuts preparation time by X%”, “suitable for all special needs”, or “the first solution of its kind”.

## 13. Definition of done

A teacher can successfully:
1. Open the deployed site.
2. Type one complex classroom instruction.
3. Generate steps with AI.
4. Review/change incorrect text and icons.
5. Enter a single-step digital experience.
6. Play instruction audio and reveal additional help.
7. Print/save the same approved cards as PDF.
8. Use the website on desktop and mobile without critical errors.

README must describe background, objectives, features, stack, setup and usage. Submit deployed URL and GitHub repository.

## 14. Codex working instructions

> Treat this document as the project's source of product decisions and the original competition guidebook as authoritative for competition rules. Before implementation, inspect the repository and propose a concise plan. Then implement the P0 end-to-end vertical slice first.

- Prefer minimal dependencies and clear component boundaries.
- Never expose server secrets.
- Use a strict schema for LLM output and verify before rendering.
- Keep Indonesian UI copy understandable and editable.
- Provide teacher review as a real state transition, not a decorative page.
- Make printable output functional, not merely an export button.
- Make TTS controls functional, without assuming voices are installed.
- Ensure proper errors/loading/empty states.
- Track trade-offs; ask only about decisions that truly block implementation.
- Keep the README and this context file updated as architecture evolves.
- Do **not** start building non-MVP features until the core workflow is demonstrably complete.

---
*Planning note: External research and competitor descriptions from earlier discussions are leads to verify; the guidebook is the primary source for competition rules.*
