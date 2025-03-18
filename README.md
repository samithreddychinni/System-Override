# 🔥 System Override: Cyberpunk Hacker Simulator

Welcome to **System Override**, an immersive cyberpunk typing simulation where you become a rogue hacker attempting a high-stakes breach while being chased by ethical hackers. Type fast, inject malware, and complete missions before getting caught!

---

## 🕶️ Game Storyline

You’re inside a **virtual hack environment**, breaching a highly secure system while **ethical hackers** try to trace and stop you. Speed is your ally — type faster, dodge firewalls, inject malware, and breach to 100% before they catch you.

Choose your path:
- **English Mode** – Type basic English phrases
- **Code Mode** – Type complex code snippets

Select your difficulty:
- **Easy / Medium / Hard** – Each level changes the typing speed required, phrase complexity, and chase difficulty.

Survive, adapt, and complete the breach!

---

## 🚀 Core Features

### 💻 *Ultimate Hacker Experience*
- Multiple draggable, resizable windows (terminal, logs, IP tracker, status graph).
- Fullscreen, minimize, and close controls on each window.
- Random placement of hacker windows — click to bring to front and rearrange.
- Real-time hacker environment with **red**, **green**, and **blue** feedback based on typing accuracy and speed.

---

## 🧠 *Gameplay Mechanics & Challenges*

### 1️⃣ *Dynamic Typing Windows*
- **Typing Window**: Enter the prompted phrases or code.
- **Status Window**: Real-time typing speed (WPM), time left.
- **IP Tracker**: Highlights typing correctness (Red - wrong/stopped, Blue/Green - correct & fast).

### 2️⃣ *Difficulty Progression*
- Levels unlock new windows like:
  - **Real-time Typing Speed Graph**
  - **Malware Injection Challenge**

### 3️⃣ *Malware Injection Mission*
- Mid-level surprise mission allows you to **inject malware into the opponent’s system** for a massive advantage.

### 4️⃣ *Ethical Hacker Chase Mechanism*
- If you slow down, an ethical hacker gets closer.
- If caught, you must **type a critical phrase in 5-10 secs** to regain access.

### 5️⃣ *Final Breach Progression*
- Breach progresses with your correct typing.
- Completion requires **100% breach** based on your selected difficulty and statement count.

---

## 🔥 *Advanced Cyberpunk Features*

✅ **Brute Force Password Attack**  
✅ **Port Scanning with Recall Challenge**  
✅ **Adaptive AI Firewalls**  
✅ **Countdown Timer & Security Breaches**  
✅ **Random Firewall CAPTCHAs**  
✅ **Intrusion Detection Countermeasures (Timed Command Challenges)**  
✅ **Fake System Alerts & Glitches**  
✅ **Virus Deployment at 90% Progress**  
✅ **Fake Webcam Access Alerts**  
✅ **GSAP Animated Cyberpunk End Screen**

---

## 📜 *Installation & Setup*

### 🔧 Prerequisites
- [Node.js](https://nodejs.org/)
- [Firebase](https://firebase.google.com/)
- [Vercel](https://vercel.com/)

---

### 📥 Clone the Repository
```bash
git clone https://github.com/samithreddychinni/System-Override.git
cd system-override
```

---

### 📦 Install Dependencies
```bash
npm install
```

---

### 🔥 Firebase Setup

#### 1️⃣ Create Firebase Project & Enable Authentication
- Enable **Email/Password** (Optional: Anonymous login for guests)

#### 2️⃣ Firestore Collections:
- `leaderboard`
  - `userId`: string
  - `username`: string
  - `wpm`: number
  - `timestamp`: number
- `users`
  - `userId`: string
  - `displayName`: string
  - `bestScore`: number
  - `totalMissions`: number
  - `lastLogin`: timestamp

#### 3️⃣ Firebase Storage Rules (Optional):
```plaintext
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### 4️⃣ Firestore Index for Leaderboard:
- Collection: `leaderboard`
- Fields:
  - `wpm`: Descending
  - `timestamp`: Descending
- **Query Scope**: *Collection* (for single `leaderboard` collection queries)

---

### 🚀 Run the App Locally
```bash
npm run dev
```

---

### 🌐 Deploy to Vercel
```bash
vercel
```

---

## 🎮 *How to Play*
1. Login or enter **Guest Mode**
2. Select:
   - **Typing Mode**: English / Code
   - **Difficulty**: Easy / Medium / Hard
3. Type fast to complete tasks before being traced
4. **Unlock malware injection mission**
5. React quickly when ethical hackers close in — defeat the *Last Stand* challenge
6. Reach **100% breach** to win and enjoy the *System Breached* animation

---

## 🎨 *Tech Stack*
- **Frontend:** Next.js, Tailwind CSS, GSAP Animations
- **Backend:** Firebase Auth, Firestore
- **Deployment:** Vercel

---

## 🛡️ *Security Considerations*
✅ Rate limiting  
✅ Validate WPM to avoid unrealistic submissions  
✅ Secure Firebase rules  
✅ User-specific data access control  

---

## 🤝 *Contributing*
Pull requests and feature suggestions are welcome! Fork the repo, contribute, and level up the cyberpunk experience.

---

## 📜 *License*
MIT License © 2024 [samith reddy]

---

## 🚀 *Final Words*
**System Override** is a high-speed cyberpunk hacker simulator. Think fast, type faster, inject viruses, bypass firewalls, and escape the ethical hackers!

---

**💾 Are you ready to breach the system or get caught?**
