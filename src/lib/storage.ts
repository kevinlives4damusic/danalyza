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
  serverTimestamp
} from "firebase/firestore";
import { db, auth } from "./firebase";

type StoredAnalysis = {
  id: string;
  fileName: string;
  fileSize: number;
  date: string;
  results: any;
  userId?: string;
};

// Save analysis to Firestore
export const saveAnalysis = async (
  fileName: string,
  fileSize: number,
  results: any,
): Promise<string> => {
  try {
    // Check if user is logged in
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.log("User not logged in, saving to localStorage instead");
      return saveAnalysisToLocalStorage(fileName, fileSize, results);
    }
    
    console.log("Saving analysis to Firestore...");
    const docRef = await addDoc(collection(db, "cv_analyses"), {
      fileName,
      fileSize,
      results,
      userId,
      createdAt: serverTimestamp(),
    });
    
    console.log("Analysis saved to Firestore with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving analysis to Firestore:", error);
    
    // Fallback to localStorage if Firestore fails
    return saveAnalysisToLocalStorage(fileName, fileSize, results);
  }
};

// Helper function to save to localStorage
const saveAnalysisToLocalStorage = (
  fileName: string,
  fileSize: number,
  results: any
): string => {
  console.log("Saving analysis to localStorage...");
  const id = `analysis_${Date.now()}`;
  const analysis: StoredAnalysis = {
    id,
    fileName,
    fileSize,
    date: new Date().toISOString(),
    results,
  };

  // Get existing analyses
  const existingData = localStorage.getItem("cv_analyses");
  const analyses: StoredAnalysis[] = existingData
    ? JSON.parse(existingData)
    : [];

  // Add new analysis and save
  analyses.push(analysis);
  localStorage.setItem("cv_analyses", JSON.stringify(analyses));
  console.log("Analysis saved to localStorage with ID:", id);

  return id;
};

// Get all saved analyses for the current user
export const getAllAnalyses = async (): Promise<StoredAnalysis[]> => {
  try {
    const userId = auth.currentUser?.uid;
    
    if (!userId) {
      console.log("User not logged in, returning analyses from localStorage");
      return getAllAnalysesFromLocalStorage();
    }
    
    console.log("Fetching analyses from Firestore...");
    try {
      const q = query(
        collection(db, "cv_analyses"), 
        where("userId", "==", userId)
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
    } catch (firestoreError) {
      console.error("Error fetching from Firestore:", firestoreError);
      return getAllAnalysesFromLocalStorage();
    }
  } catch (error) {
    console.error("Error getting analyses:", error);
    
    // Fallback to localStorage
    return getAllAnalysesFromLocalStorage();
  }
};

// Get a specific analysis by ID
export const getAnalysisById = async (id: string): Promise<StoredAnalysis | null> => {
  try {
    // Try localStorage first for faster access
    const localAnalysis = getAnalysisFromLocalStorage(id);
    if (localAnalysis) {
      return localAnalysis;
    }
    
    // If not in localStorage and user is logged in, try Firestore
    if (auth.currentUser) {
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
      } catch (firestoreError) {
        console.error("Error getting analysis from Firestore:", firestoreError);
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error getting analysis:", error);
    return null;
  }
};

// Delete an analysis
export const deleteAnalysis = async (id: string): Promise<boolean> => {
  try {
    // Try to delete from localStorage first
    const localDeleted = deleteAnalysisFromLocalStorage(id);
    
    // If user is logged in, also try to delete from Firestore
    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, "cv_analyses", id));
        return true;
      } catch (firestoreError) {
        console.error("Error deleting from Firestore:", firestoreError);
        return localDeleted;
      }
    }
    
    return localDeleted;
  } catch (error) {
    console.error("Error deleting analysis:", error);
    return false;
  }
};

// Helper function to get analyses from localStorage
const getAllAnalysesFromLocalStorage = (): StoredAnalysis[] => {
  console.log("Getting analyses from localStorage");
  const data = localStorage.getItem("cv_analyses");
  return data ? JSON.parse(data) : [];
};

// Helper function to get a specific analysis from localStorage
const getAnalysisFromLocalStorage = (id: string): StoredAnalysis | null => {
  const analyses = getAllAnalysesFromLocalStorage();
  return analyses.find((analysis) => analysis.id === id) || null;
};

// Helper function to delete an analysis from localStorage
const deleteAnalysisFromLocalStorage = (id: string): boolean => {
  const analyses = getAllAnalysesFromLocalStorage();
  const filteredAnalyses = analyses.filter((analysis) => analysis.id !== id);
  
  if (filteredAnalyses.length < analyses.length) {
    localStorage.setItem("cv_analyses", JSON.stringify(filteredAnalyses));
    return true;
  }
  
  return false;
};
