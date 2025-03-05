Here is the **README.md** file in markdown format. You can copy and paste it directly into your project.

---

### **README.md**
```md
# GroupThoughts - Journal App

GroupThoughts is a daily journal app where users can log in with **Google or Email/Password**, answer a daily question, and view others' responses in real-time. Answers reset daily, and Firebase Authentication ensures users can securely log in.

---

## 🚀 Features
- **Authentication**: Sign in with **Google** or **Email/Password**.
- **Firestore Database**: Saves daily responses and retrieves them in real-time.
- **Daily Questions**: A new question appears every day, and answers reset automatically.
- **Firebase Hosting**: The app is deployed via Firebase.

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone <your-repo-url>
cd <your-repo-name>
```

### 2️⃣ Install Dependencies
Ensure you have **Node.js (v18+)** and **npm** installed, then run:
```sh
npm install
```

### 3️⃣ Firebase Setup
Ensure you have **Firebase CLI** installed globally:
```sh
npm install -g firebase-tools
```
Then login to Firebase:
```sh
firebase login
```

### 4️⃣ Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Create Project** → Enable Firestore & Authentication
3. Under **Authentication → Sign-in Method**, enable:
   - **Google Sign-in**
   - **Email/Password Sign-in**
4. Under **Firestore → Rules**, ensure authenticated users can read/write:
   ```js
   service cloud.firestore {
     match /databases/{database}/documents {
       match /journalEntries/{entryId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

### 5️⃣ Set Up Firebase Config
1. Go to **Firebase Console → Project Settings → General**
2. Click **"Add Web App"** and copy the Firebase config.
3. Create a `.env` file in your project root and add:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```
4. Restart the dev server after adding `.env`.

---

## 🏃‍♂️ Running Locally
Start the development server:
```sh
npm run dev
```
Then open **http://localhost:5173** (or the port Vite assigns).

---

## 🚀 Deploying to Firebase
1. Build the project:
   ```sh
   npm run build
   ```
2. Deploy to Firebase Hosting:
   ```sh
   firebase deploy --only hosting
   ```

---

## 🛠 Troubleshooting

### 🔹 Login Page Not Appearing After Deployment
- Ensure Firebase **Authentication → Authorized Domains** includes your Firebase Hosting domain.
- Make sure your **firebase.json** has this rewrite rule:
  ```json
  {
    "hosting": {
      "public": "dist",
      "rewrites": [{ "source": "**", "destination": "/index.html" }]
    }
  }
  ```

### 🔹 Firestore Responses Not Saving
- Check the **Firestore Console → journalEntries collection** for new documents.
- Verify **security rules** allow authenticated users to write.
- Add this log to **JournalEntry.tsx** to debug:
  ```tsx
  console.log("Submitting response:", { userId, answer, dateKey });
  ```

### 🔹 Incorrect Questions Showing
- Questions rotate based on **day-of-year**. If different users see different questions, check for **timezone mismatches** in `new Date()` usage.

---

## 📄 Project Structure
```
📦 src/
 ┣ 📂 components/
 ┃ ┣ 📜 Responses.tsx
 ┣ 📂 pages/
 ┃ ┣ 📜 Login.tsx
 ┃ ┣ 📜 JournalEntry.tsx
 ┣ 📂 utils/
 ┃ ┣ 📜 firebaseConfig.ts
 ┣ 📜 App.tsx
 ┣ 📜 main.tsx
📦 public/
📦 dist/ (Build output)
📜 firebase.json
📜 vite.config.ts
📜 README.md
```

---

## 👥 Contributing
1. **Fork the repo** and create a new branch:
   ```sh
   git checkout -b feature-branch
   ```
2. **Commit your changes** and push:
   ```sh
   git commit -m "Add new feature"
   git push origin feature-branch
   ```
3. Open a **Pull Request**!

---

## 📧 Contact
If you have any issues, open a GitHub **issue**, or reach out in the team chat.
```

---

This README is **fully formatted** and **ready to copy-paste** into your repository. 🚀