import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp, doc, setDoc, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7_cOEzMwVGDgqgSjHabRsIW5daQBXjDg",
  authDomain: "the-arcade-847c4.firebaseapp.com",
  projectId: "the-arcade-847c4",
  storageBucket: "the-arcade-847c4.firebasestorage.app",
  messagingSenderId: "259240284653",
  appId: "1:259240284653:web:9dbb24bd799de2643b17e4",
  measurementId: "G-NZZYSSQS9J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Keep track of the current user
export let currentUser = null;

onAuthStateChanged(auth, (user) => {
    currentUser = user;
    // Dispatch a custom event so other scripts know auth state changed
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: user }));
});

// Authentication Functions
export async function signUpUser(email, password, username) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Set the username
        await updateProfile(user, { displayName: username });
        
        // Save user to the database
        await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: email,
            createdAt: serverTimestamp()
        });
        
        return user;
    } catch (error) {
        console.error("Error signing up:", error);
        throw error;
    }
}

export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}

export async function logoutUser() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
}

// Profile Functions
export async function updateUsername(newUsername) {
    if (!auth.currentUser) throw new Error("Not logged in");
    await updateProfile(auth.currentUser, { displayName: newUsername });
}

export async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
}

export async function getUserHighScores() {
    if (!auth.currentUser) return [];
    
    const q = query(
        collection(db, "scores"),
        where("userId", "==", auth.currentUser.uid)
    );
    
    const querySnapshot = await getDocs(q);
    let allScores = [];
    querySnapshot.forEach((doc) => {
        allScores.push({ id: doc.id, ...doc.data() });
    });

    // Sort all scores descending first so the first one we see is the highest
    allScores.sort((a, b) => b.score - a.score);

    // Group by game to get personal bests
    const highestScoresMap = new Map();
    for (const s of allScores) {
        if (!highestScoresMap.has(s.gameId)) {
            highestScoresMap.set(s.gameId, s);
        }
    }
    
    return Array.from(highestScoresMap.values());
}

// Database Functions
export async function _$syncDataState(gameId, score, hash) {
    // Basic Anti-Cheat Hash Validation
    const expectedHash = btoa(score + "_ARCADE_SECURE");
    if (hash !== expectedHash) {
        console.warn("Invalid game state signature. Score rejected.");
        return null;
    }
    if (!auth.currentUser) {
        console.warn("User is not logged in. Score not saved.");
        return null;
    }

    try {
        const docRef = await addDoc(collection(db, "scores"), {
            userId: auth.currentUser.uid,
            username: auth.currentUser.displayName || "Anonymous",
            gameId: gameId,
            score: score,
            timestamp: serverTimestamp()
        });
        console.log("Score saved with ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error saving score: ", error);
        throw error;
    }
}

export async function getLeaderboard(gameId = null) {
    try {
        let q;
        if (gameId) {
            // Get top scores for a specific game
            q = query(collection(db, "scores"), /* where("gameId", "==", gameId), */ orderBy("score", "desc"), limit(50));
            // Note: If you filter by gameId AND order by score, Firestore will require a composite index.
            // For simplicity right now, we will fetch all and filter in memory, or just not filter if we want a global leaderboard.
        } else {
            q = query(collection(db, "scores"), orderBy("score", "desc"), limit(100));
        }
        
        const querySnapshot = await getDocs(q);
        let allScores = [];
        querySnapshot.forEach((doc) => {
            allScores.push({ id: doc.id, ...doc.data() });
        });

        // Since the query orders by score descending, the first time we see a user-game combo, it's their highest score.
        const highestScoresMap = new Map();
        for (const s of allScores) {
            const key = `${s.userId}_${s.gameId}`;
            if (!highestScoresMap.has(key)) {
                highestScoresMap.set(key, s);
            }
        }
        
        let scores = Array.from(highestScoresMap.values());
        
        if (gameId) {
            scores = scores.filter(s => s.gameId === gameId).slice(0, 50);
        }
        
        return scores;
    } catch (error) {
        console.error("Error fetching leaderboard: ", error);
        return [];
    }
}

// Expose globally for non-module scripts
window._$syncDataState = _$syncDataState;
window.getLeaderboard = getLeaderboard;
window.logoutUser = logoutUser;
window.signUpUser = signUpUser;
window.loginUser = loginUser;
window.updateUsername = updateUsername;
window.resetPassword = resetPassword;
window.getUserHighScores = getUserHighScores;
