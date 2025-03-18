import { initializeApp, getApp, getApps } from "firebase/app"
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBnzGuOZXk03BoiuH9ZrCKhYUKAs8jm_kA",
  authDomain: "system-override-df69b.firebaseapp.com",
  projectId: "system-override-df69b",
  storageBucket: "system-override-df69b.firebasestorage.app",
  messagingSenderId: "10998080071",
  appId: "1:10998080071:web:3d8de396e841635b410762",
  measurementId: "G-BHDP94JPC2",
}

export const initializeFirebase = () => {
  if (getApps().length) {
    return getApp()
  }
  return initializeApp(firebaseConfig)
}

// Save score to leaderboard
export const saveScore = async (userId: string, username: string, wpm: number) => {
  try {
    const app = initializeFirebase()
    const db = getFirestore(app)

    await addDoc(collection(db, "leaderboard"), {
      userId,
      username,
      wpm,
      timestamp: Date.now(),
    })

    return true
  } catch (error) {
    console.error("Error saving score:", error)
    throw error
  }
}

// Get leaderboard data
export const getLeaderboard = async () => {
  try {
    const app = initializeFirebase()
    const db = getFirestore(app)

    const q = query(collection(db, "leaderboard"), orderBy("wpm", "desc"), limit(10))

    const querySnapshot = await getDocs(q)
    const leaderboard = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return leaderboard
  } catch (error) {
    console.error("Error getting leaderboard:", error)
    return []
  }
}

