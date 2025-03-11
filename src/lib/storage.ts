// Firestore storage utility for CV analysis results
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  deleteDoc, 
  query, 
  where,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth, authReadyPromise } from "./firebase";

type StoredAnalysis = {
  id: string;
  fileName: string;
  fileSize: number;
  date: string;
  results: any;
  userId?: string;
};

// Helper functions for localStorage
const getStoredAnalyses = (): StoredAnalysis[] => {
  try {
    const data = localStorage.getItem('cv_analyses');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

const saveToLocalStorage = (analysis: StoredAnalysis): void => {
  try {
    const analyses = getStoredAnalyses();
    analyses.push(analysis);
    localStorage.setItem('cv_analyses', JSON.stringify(analyses));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    throw error;
  }
};

const getFromLocalStorage = (id: string): StoredAnalysis | null => {
  try {
    const analyses = getStoredAnalyses();
    return analyses.find(a => a.id === id) || null;
  } catch (error) {
    console.error("Error getting analysis from localStorage:", error);
    return null;
  }
};

const deleteFromLocalStorage = (id: string): boolean => {
  try {
    const analyses = getStoredAnalyses();
    const filteredAnalyses = analyses.filter(a => a.id !== id);
    localStorage.setItem('cv_analyses', JSON.stringify(filteredAnalyses));
    return true;
  } catch (error) {
    console.error("Error deleting from localStorage:", error);
    return false;
  }
};

// Validate analysis data before saving
const validateAnalysisData = (results: any): boolean => {
  if (!results || typeof results !== 'object') {
    console.error('Invalid analysis results: Results must be an object');
    return false;
  }

  // Check for circular references
  try {
    JSON.stringify(results);
  } catch (error) {
    console.error('Invalid analysis results: Contains circular references', error);
    return false;
  }

  return true;
};

// Save analysis to Firestore or localStorage
export const saveAnalysis = async (
  fileName: string,
  fileSize: number,
  results: any,
): Promise<string> => {
  try {
    // Wait for auth to be ready
    await authReadyPromise;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay to ensure auth is stable
    
    const user = auth.currentUser;
    console.log("Attempting to save analysis. Auth state:", {
      isSignedIn: !!user,
      uid: user?.uid,
      isAnonymous: user?.isAnonymous
    });

    // Validate input data
    if (!fileName || !results) {
      throw new Error('Missing required fields: fileName and results are required');
    }

    // Validate analysis data structure
    if (!validateAnalysisData(results)) {
      throw new Error('Invalid analysis data structure');
    }

    if (!user) {
      console.log("User not logged in, saving to localStorage");
      const id = `local_${Date.now()}`;
      const analysis: StoredAnalysis = {
        id,
        fileName,
        fileSize,
        results,
        date: new Date().toISOString()
      };
      saveToLocalStorage(analysis);
      return id;
    }
    
    console.log("Saving analysis to Firestore...");
    
    // Deep clone and sanitize the results to prevent circular references
    const sanitizedResults = JSON.parse(JSON.stringify(results));
    
    // Prepare the data for Firestore
    const analysisData = {
      fileName,
      fileSize,
      results: sanitizedResults,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      version: '1.0'
    };

    console.log("Prepared analysis data:", {
      fileName,
      fileSize,
      resultsSize: JSON.stringify(sanitizedResults).length,
      userId: user.uid
    });

    // Verify the data structure is valid for Firestore
    if (JSON.stringify(analysisData).length > 1048576) { // 1MB Firestore document limit
      throw new Error('Analysis data exceeds Firestore document size limit');
    }

    const docRef = await addDoc(collection(db, "cv_analyses"), analysisData);
    
    console.log("Analysis saved to Firestore with ID:", docRef.id);
    return docRef.id;
  } catch (firestoreError: any) {
    console.error("Firestore save error:", {
      code: firestoreError.code,
      message: firestoreError.message,
      details: firestoreError
    });
    
    // Fallback to localStorage
    console.log("Falling back to localStorage");
    const id = `local_${Date.now()}`;
    const analysis: StoredAnalysis = {
      id,
      fileName,
      fileSize,
      results,
      date: new Date().toISOString(),
      userId: auth.currentUser?.uid
    };
    saveToLocalStorage(analysis);
    return id;
  }
};

// Get all saved analyses
export const getAllAnalyses = async (): Promise<StoredAnalysis[]> => {
  // Wait for auth to be ready
  await authReadyPromise;
  
  const user = auth.currentUser;
  console.log("Fetching analyses. Auth state:", {
    isSignedIn: !!user,
    uid: user?.uid,
    isAnonymous: user?.isAnonymous
  });
  
  if (!user) {
    console.log("User not logged in, returning analyses from localStorage");
    return getStoredAnalyses();
  }
  
  console.log("Fetching analyses from Firestore...");
  try {
    const q = query(
      collection(db, "cv_analyses"), 
      where("userId", "==", user.uid)
    );
    
    const querySnapshot = await getDocs(q);
    const analyses: StoredAnalysis[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      analyses.push({
        id: doc.id,
        fileName: data.fileName,
        fileSize: data.fileSize,
        date: data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate().toISOString() 
          : new Date().toISOString(),
        results: data.results,
        userId: data.userId,
      });
    });
    
    console.log(`Found ${analyses.length} analyses in Firestore`);
    return analyses;
  } catch (firestoreError: any) {
    console.error("Error fetching from Firestore:", {
      code: firestoreError.code,
      message: firestoreError.message,
      details: firestoreError
    });
    return getStoredAnalyses();
  }
};

// Get a specific analysis
export const getAnalysisById = async (id: string): Promise<StoredAnalysis | null> => {
  const user = auth.currentUser;
  console.log("Fetching analysis by ID. Auth state:", {
    isSignedIn: !!user,
    uid: user?.uid,
    isAnonymous: user?.isAnonymous
  });

  // Try localStorage first for faster access
  const localAnalysis = getFromLocalStorage(id);
  if (localAnalysis) {
    return localAnalysis;
  }
  
  // If not in localStorage and user is logged in, try Firestore
  if (user) {
    try {
      const docRef = doc(db, "cv_analyses", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          fileName: data.fileName,
          fileSize: data.fileSize,
          date: data.createdAt instanceof Timestamp 
            ? data.createdAt.toDate().toISOString() 
            : new Date().toISOString(),
          results: data.results,
          userId: data.userId,
        };
      }
    } catch (firestoreError: any) {
      console.error("Error getting analysis from Firestore:", {
        code: firestoreError.code,
        message: firestoreError.message,
        details: firestoreError
      });
    }
  }
  
  return null;
};

// Delete an analysis
export const deleteAnalysis = async (id: string): Promise<boolean> => {
  const user = auth.currentUser;
  console.log("Attempting to delete analysis. Auth state:", {
    isSignedIn: !!user,
    uid: user?.uid,
    isAnonymous: user?.isAnonymous
  });

  // Try to delete from localStorage first
  const localDeleted = deleteFromLocalStorage(id);
  
  // If user is logged in, also try to delete from Firestore
  if (user) {
    try {
      await deleteDoc(doc(db, "cv_analyses", id));
      return true;
    } catch (firestoreError: any) {
      console.error("Error deleting from Firestore:", {
        code: firestoreError.code,
        message: firestoreError.message,
        details: firestoreError
      });
      return localDeleted;
    }
  }
  
  return localDeleted;
};
