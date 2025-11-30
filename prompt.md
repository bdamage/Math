Här kommer en färdig prompt du kan klistra in i t.ex. ChatGPT, Copilot eller en design-/kod-AI för att få hjälp att bygga sidan.
Jag skriver den på engelska (brukar funka bäst), men du kan såklart översätta/ändra efter smak.

---

### Prompt: Interactive Math Learning Website (Grades 1–6)

You are an expert **frontend developer and math educator**.
Your task is to design and implement a **modern, kid-friendly math website** that helps students in **grades 1–6** learn:

* Basic arithmetic: addition, subtraction, multiplication, division
* Especially: **multiplication tables** (0–10 or 0–12)

The website must be:

* **Highly interactive**
* **Gamified**
* Visually appealing for children aged 7–12
* Fully functional in the browser, with **all progress stored locally** (no central database or backend user accounts).

---

### Tech and Architecture Requirements

* **Tech stack**:

  * **React** (SPA)
  * **Tailwind CSS** for styling
  * **Node.js** only for tooling/dev server/build (no server-side user data)
  * **i18n** with **react-i18next** (or similar) to support **English and Swedish** out of the box
* **State & storage**:

  * Use browser **localStorage** or similar to save:

    * Current level / unlocked worlds
    * Earned points / stars / coins
    * Customizations (e.g., decorated room)
  * Data must persist across page reloads but **never leave the user’s device**.
* No external backend or cloud DB. Everything is **local-only**.

---

### Localization

* Ship the UI fully bilingual: **English** and **Swedish**.
* All user-facing strings must go through the i18n layer (no hard-coded text in components).
* Provide translation resources for both languages, e.g.:

```ts
const resources = {
  en: {
    translation: {
      nav: { home: "Home", practice: "Practice", room: "My Room", progress: "Progress", settings: "Settings" },
      dashboard: {
        welcome: "Welcome back, Math Explorer!",
        daily: "Daily challenge",
        practiceMultiplication: "Practice Multiplication",
        continue: "Continue last game"
      },
      exercise: { correct: "Great job!", incorrect: "Try again!", summary: "Round summary" },
      room: { shop: "Shop", buy: "Buy", notEnough: "Not enough coins" }
    }
  },
  sv: {
    translation: {
      nav: { home: "Hem", practice: "Träna", room: "Mitt rum", progress: "Framsteg", settings: "Inställningar" },
      dashboard: {
        welcome: "Välkommen tillbaka, Matematiksufrare!",
        daily: "Dagens utmaning",
        practiceMultiplication: "Träna multiplikation",
        continue: "Fortsätt senaste spelet"
      },
      exercise: { correct: "Snyggt jobbat!", incorrect: "Försök igen!", summary: "Runds sammanfattning" },
      room: { shop: "Butik", buy: "Köp", notEnough: "Inte tillräckligt med mynt" }
    }
  }
};
```

* Include a language switcher (toggle/button) in the navigation; persist the chosen language in localStorage.
* Default language can follow browser locale with fallback to English.

---

### Core Concept & Gamification

Think of the site as a mix between a **math adventure game** and a **practice tool**.

1. **User persona**

   * Primary users: students in **grades 1–6** with varying math ability.
   * They should feel:

     * Excited (“I want to unlock the next level!”)
     * Safe to fail (“I can try again without shame.”)
     * Proud of progress (clear feedback and rewards).

2. **Gamification features**

   * **XP / Points / Coins** for each completed exercise or quiz.
   * **Streaks** for practicing multiple days in a row.
   * **Levels / Worlds** (e.g., “Addition Island”, “Multiplication Mountain”, “Division Desert”).
   * A **customizable room/base**:

     * Students can spend earned coins to:

       * Buy furniture, posters, colors, pets, gadgets, etc.
       * Rearrange and decorate the room.
   * **Badges** or **achievements**, e.g.:

     * “Multiplication Master 2×” – answered 20 correct questions in the 2 times table.
     * “Combo Wizard” – 10 correct answers in a row.
   * Gentle **feedback and celebration**:

     * Confetti, animations, happy sounds, stars (but not too overwhelming).

---

### UX & UI Guidelines

* Style: **Modern, clean, colorful**, not cluttered.
* Typography: **Large, readable**, friendly (good for younger kids).
* Layout:

  * Clear **navigation** between:

    * Home / Dashboard
    * Practice / Games
    * My Room (customization)
    * Progress / Achievements
  * Works well on **tablet and laptop** screens.
* Use **Tailwind** utility classes for layout and consistent spacing.
* Include simple animations (e.g. hover effects, small transitions) to make it feel alive.

---

### Main Screens / Components

Please design and implement (at least) the following React components / pages:

1. **Home / Dashboard**

   * Shows:

     * Current level
     * Total points/coins
     * Shortcuts: “Practice Multiplication”, “Continue last game”
     * Daily challenge (e.g., “Solve 10 multiplication problems to earn a bonus chest”)
   * Motivating welcome text and a cute character/mascot.

2. **Skill Selection Page**

   * Cards/buttons for:

     * Addition
     * Subtraction
     * Multiplication
     * Division
   * For each skill, allow choosing:

     * Difficulty (easy/medium/hard)
     * For multiplication: specific times tables (2s, 3s, …, 10s/12s).

3. **Exercise / Game View**

   * Present **one problem at a time** with:

     * Large, clear math question (e.g. `7 × 4 = ?`)
     * Input field or multiple-choice options.
   * Immediate feedback:

     * Correct: short positive animation + points gained.
     * Incorrect: gentle hint, maybe show a small visual aid (e.g., groups of objects).
   * At the end of a round (e.g., 10 questions):

     * Show summary: score, accuracy, streak.
     * Option to retry, go harder, or return home.

4. **Multiplication Trainer Mode**

   * Special mode focused on multiplication tables.
   * Features:

     * Choose table(s): 2×, 3× … 10×/12×.
     * “Practice mode” (no time pressure) and “Challenge mode” (timed).
     * Visual supports:

       * Arrays / groups or number lines for younger students.
     * Progress indicators: show which tables are “learned” vs. “in progress”.

5. **My Room / Customization Page**

   * Display a simple **room layout** (React component) that:

     * Renders items/furniture based on what the student has unlocked.
   * Shop section:

     * Shows items with cost in coins.
     * “Buy” button (disabled if not enough coins).
     * On purchase: update localStorage and refresh room.
   * Drag-and-drop or simple controls to change where items are placed.

6. **Progress & Achievements Page**

   * Show:

     * Mastery per skill (e.g., bars or stars for addition, multiplication, etc.).
     * Multiplication tables mastery grid (e.g., 1–12 vs. 1–12 with color coding).
     * List of badges/achievements with short, kid-friendly descriptions.
   * All data read from **localStorage**, updated as the child plays.

7. **Settings Page**

   * Toggle:

     * Sound on/off
     * Difficulty preferences (e.g. default difficulty)
   * Button to **reset progress** (with confirmation).

---

### Data & Local Storage

Implement a small **progress manager** module that:

* Saves and loads an object like:

```ts
type MathProgress = {
  points: number;
  coins: number;
  streakDays: number;
  lastPracticeDate: string | null;
  skills: {
    addition: SkillProgress;
    subtraction: SkillProgress;
    multiplication: SkillProgress & {
      tables: { [table: number]: TableProgress };
    };
    division: SkillProgress;
  };
  room: {
    ownedItems: string[];
    placedItems: { id: string; x: number; y: number }[];
  };
  achievements: string[];
};

type SkillProgress = {
  level: number;
  correctAnswers: number;
  totalAnswers: number;
};

type TableProgress = {
  correct: number;
  total: number;
  mastered: boolean;
};
```

* Uses **localStorage** key like `"mathQuestProgress"` to persist data.
* Includes helper functions:

  * `loadProgress()`
  * `saveProgress(progress)`
  * `addPoints(amount)`
  * `updateSkillProgress(...)`
  * `unlockItem(itemId)`
  * `logPracticeSession(...)`

---

### Pedagogical Requirements

* Ensure problems and feedback are:

  * Age-appropriate (grades 1–6)
  * Gradually increasing in difficulty
  * Supportive, not punishing.
* Provide:

  * Optional hints for harder problems.
  * Visual examples for multiplication and division (groups, arrays).
* Include a **short onboarding** that explains:

  * How to earn coins.
  * How to unlock and decorate the room.
  * Where to practice different math skills.

---

### What to Output

1. A high-level **component structure and file organization** (e.g., React folder structure).
2. Example **React components** with Tailwind classes for:

   * Dashboard
   * Exercise/Game
   * Multiplication Trainer
   * Room / Shop
3. Implementation of the **localStorage progress manager**.
4. Suggestions for further game modes or mini-games to keep motivation high.
5. i18n setup details (resource shape, how to add new strings) and where to place the language switcher.

Write clean, well-commented code and explain key design choices so it’s easy for another developer (teacher with basic coding skills) to extend.

---
