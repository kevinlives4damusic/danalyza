import { saveAnalysis } from "./storage";
import { auth } from "./firebase";
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
console.log("Configuring PDF.js worker...");
console.log("PDF.js version:", pdfjsLib.version);

try {
  // Import the worker directly from node_modules
  const worker = new Worker(
    new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url),
    { type: 'module' }
  );
  
  pdfjsLib.GlobalWorkerOptions.workerPort = worker;
  console.log("PDF.js worker configuration complete using worker port");
} catch (error) {
  console.error("Error configuring PDF.js worker:", error);
}

// API key for the AI analysis service
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

// Function to extract text from PDF
async function extractTextFromPDF(file: File): Promise<string> {
  try {
    console.log("Starting PDF text extraction...");
    console.log("Current worker configuration:", {
      workerPort: pdfjsLib.GlobalWorkerOptions.workerPort ? "Set" : "Not set",
      isWorkerReady: typeof pdfjsLib.getDocument === 'function'
    });
    
    // Read the PDF file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    console.log("File loaded as ArrayBuffer, size:", arrayBuffer.byteLength);
    
    // Load the PDF document
    console.log("Creating PDF loading task...");
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 1, // Enable verbose logging
      disableFontFace: true, // Disable font loading for simplicity
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`
    });
    
    console.log("Waiting for PDF to load...");
    const pdf = await loadingTask.promise;
    console.log(`PDF loaded successfully. Number of pages: ${pdf.numPages}`);
    
    // Extract text from all pages
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`Processing page ${i}/${pdf.numPages}`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }
    
    console.log("PDF text extraction complete. Text length:", fullText.length);
    return fullText.trim();
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    if (error instanceof Error) {
      const errorDetails = {
        message: error.message,
        stack: error.stack,
        workerPort: pdfjsLib.GlobalWorkerOptions.workerPort ? "Set" : "Not set",
        pdfjsVersion: pdfjsLib.version
      };
      console.error("Error details:", errorDetails);
    }
    throw new Error("Failed to extract text from PDF: " + (error as Error).message);
  }
}

// Function to extract references from text
function extractReferences(text: string): any[] {
  const lines = text.split('\n');
  const references = [];
  let isReferenceSection = false;
  let currentReference: any = {};

  console.log("Starting reference extraction...");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();

    // Debug log
    if (line) {
      console.log("Processing line:", line);
    }

    // Detect reference section
    if (lowerLine.includes('reference') || lowerLine.includes('referee')) {
      isReferenceSection = true;
      console.log("Reference section detected");
      continue;
    }

    if (isReferenceSection && line) {
      // Phone number pattern (more flexible)
      const phonePattern = /(?:cell|tel|phone|mobile|contact)?[:\s-]?\s*(?:\+?\d[\d\s-()]{8,})/i;
      // Email pattern
      const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;

      // Check for phone numbers
      const phoneMatch = line.match(phonePattern);
      if (phoneMatch) {
        currentReference.phone = phoneMatch[0].replace(/^[^0-9+]+/, '').trim();
        console.log("Found phone:", currentReference.phone);
      }

      // Check for email
      const emailMatch = line.match(emailPattern);
      if (emailMatch) {
        currentReference.email = emailMatch[0].trim();
        console.log("Found email:", currentReference.email);
      }

      // If line doesn't contain phone or email, it might be a name
      if (!phoneMatch && !emailMatch && !currentReference.name && line.length > 2) {
        currentReference.name = line;
        console.log("Found name:", currentReference.name);
      }

      // Add reference if we have enough information
      if (currentReference.name && (currentReference.phone || currentReference.email)) {
        const cleanReference = {
          name: currentReference.name.trim(),
          position: currentReference.position || '',
          phone: currentReference.phone || '',
          email: currentReference.email || '',
          contact: currentReference.phone || currentReference.email || ''
        };

        // Only add if not already in references array
        const isDuplicate = references.some(ref => 
          ref.name === cleanReference.name || 
          (ref.phone && ref.phone === cleanReference.phone) ||
          (ref.email && ref.email === cleanReference.email)
        );

        if (!isDuplicate) {
          references.push(cleanReference);
          console.log("Added reference:", cleanReference);
        }

        // Reset for next reference
        currentReference = {};
      }
    }
  }

  console.log(`Reference extraction complete. Found: ${references.length} references:`, references);
  return references;
}

// Function to analyze CV content using DeepSeek API
async function analyzeCV(text: string) {
  try {
    console.log("Starting CV analysis with DeepSeek API...");
    
    const prompt = `
      Analyze the following CV/resume text and provide a detailed professional assessment. 
      Focus on:
      1. Overall quality and effectiveness
      2. Key strengths and accomplishments
      3. Areas needing improvement
      4. Specific actionable suggestions
      5. Industry relevance and ATS compatibility
      6. Keyword analysis
      7. Section-by-section analysis
      
      CV Text:
      ${text}
      
      Return a JSON object with this exact structure:
      {
        "overall": "detailed overall assessment",
        "strengths": ["specific strength 1", "specific strength 2", ...],
        "weaknesses": ["specific weakness 1", "specific weakness 2", ...],
        "suggestions": ["actionable suggestion 1", "actionable suggestion 2", ...],
        "scores": {
          "overall": number (0-100),
          "content": number (0-100),
          "formatting": number (0-100),
          "relevance": number (0-100),
          "atsCompatibility": number (0-100)
        },
        "keywords": {
          "present": [
            {"word": "string", "count": number, "relevance": "high|medium|low"}
          ],
          "missing": [
            {"word": "string", "count": 0, "relevance": "high|medium|low", "missing": true}
          ]
        },
        "sections": [
          {
            "title": "section name",
            "content": "detailed analysis of section" or ["point 1", "point 2", ...],
            "score": number (0-100)
          }
        ],
        "sectionScores": [
          {"name": "section name", "value": number (0-100)}
        ],
        "industryComparison": [
          {"name": "Your CV", "value": number},
          {"name": "Industry Average", "value": number},
          {"name": "Top 10%", "value": number}
        ]
      }
    `;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`API request failed: ${response.statusText}. Details: ${errorText}`);
    }

    const data = await response.json();
    let analysisResults;
    
    try {
      // Get the raw content
      const content = data.choices[0].message.content;
      console.log("Raw API response:", content);
      
      // Try to extract JSON if it's wrapped in markdown
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      
      // Parse the JSON
      analysisResults = JSON.parse(jsonStr);
      
      // Validate the required fields
      const requiredFields = [
        'overall', 
        'strengths', 
        'weaknesses', 
        'suggestions', 
        'scores',
        'keywords',
        'sections',
        'sectionScores',
        'industryComparison'
      ];
      
      const missingFields = requiredFields.filter(field => !(field in analysisResults));
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      // Ensure scores are numbers between 0-100
      const validateScores = (obj: any) => {
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'number' && (value < 0 || value > 100)) {
            throw new Error(`Invalid score for ${key}: must be between 0-100`);
          }
        }
      };

      validateScores(analysisResults.scores);
      analysisResults.sections.forEach((section: any) => {
        if ('score' in section) {
          validateScores({ [section.title]: section.score });
        }
      });
      
      console.log("Analysis complete:", {
        overallScore: analysisResults.scores.overall,
        strengthsCount: analysisResults.strengths.length,
        weaknessesCount: analysisResults.weaknesses.length,
        suggestionsCount: analysisResults.suggestions.length
      });
      
      return analysisResults;
    } catch (parseError) {
      console.error("Error parsing API response:", parseError);
      console.error("Raw response content:", data.choices[0].message.content);
      throw new Error("Failed to parse analysis results");
    }
  } catch (error) {
    console.error("Error analyzing CV:", error);
    throw new Error("Failed to analyze CV: " + (error as Error).message);
  }
}

// Helper function to analyze text sections
function analyzeTextSections(text: string) {
  const sections = [];
  const lines = text.split('\n');
  let currentSection = '';
  let currentContent = [];

  for (const line of lines) {
    // Detect section headers (usually in caps or followed by colon)
    if (line.toUpperCase() === line && line.length > 3 || line.includes(':')) {
      if (currentSection && currentContent.length > 0) {
        sections.push({
          title: currentSection,
          type: getSectionType(currentSection),
          content: currentContent.join('\n')
        });
      }
      currentSection = line.replace(':', '').trim();
      currentContent = [];
    } else if (line.trim() && currentSection) {
      currentContent.push(line.trim());
    }
  }

  // Add the last section
  if (currentSection && currentContent.length > 0) {
    sections.push({
      title: currentSection,
      type: getSectionType(currentSection),
      content: currentContent.join('\n')
    });
  }

  return sections;
}

// Helper function to determine section type
function getSectionType(sectionTitle: string): "overall" | "strengths" | "weaknesses" | "suggestions" {
  const title = sectionTitle.toLowerCase();
  if (title.includes('experience') || title.includes('summary') || title.includes('profile')) {
    return 'overall';
  } else if (title.includes('education') || title.includes('skills') || title.includes('achievements')) {
    return 'strengths';
  } else if (title.includes('interests') || title.includes('additional')) {
    return 'weaknesses';
  } else {
    return 'suggestions';
  }
}

// Validate and sanitize analysis results
const sanitizeAnalysisResults = (results: any) => {
  // Remove any undefined or function values that Firestore doesn't support
  const sanitized = JSON.parse(JSON.stringify(results, (key, value) => {
    if (value === undefined) {
      return null;
    }
    return value;
  }));
  
  return sanitized;
};

// Main function to process CV file
export async function processCVFile(file: File) {
  console.log("Starting CV analysis for:", {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type
  });

  try {
    // Step 1: Validate file
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      throw new Error('Only PDF files are supported');
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File size exceeds 10MB limit');
    }

    // Step 2: Extract text from PDF
    console.log("Starting text extraction...");
    const extractedText = await extractTextFromPDF(file);
    
    if (!extractedText || extractedText.length === 0) {
      throw new Error('No text could be extracted from the PDF');
    }
    
    console.log("Text extraction complete. Text length:", extractedText.length);
    
    // Step 3: Analyze the extracted text
    console.log("Starting AI analysis...");
    const rawAnalysisResults = await analyzeCV(extractedText);
    
    // Step 4: Validate and sanitize analysis results
    console.log("Sanitizing analysis results...");
    const analysisResults = sanitizeAnalysisResults(rawAnalysisResults);
    
    if (!analysisResults) {
      throw new Error('Analysis results are invalid or empty');
    }

    console.log("CV analysis completed successfully");
    
    // Step 5: Save to Firestore (only if user is logged in)
    try {
      if (auth.currentUser) {
        console.log("Saving analysis to Firestore...");
        const analysisId = await saveAnalysis(file.name, file.size, analysisResults);
        console.log("Analysis saved with ID:", analysisId);
        return { ...analysisResults, id: analysisId };
      } else {
        console.log("User not logged in, skipping Firestore save");
        return analysisResults;
      }
    } catch (storageError: any) {
      console.error("Error saving to Firestore:", {
        code: storageError.code,
        message: storageError.message,
        details: storageError
      });
      
      // Return results even if save failed
      return analysisResults;
    }
  } catch (error: any) {
    console.error("Error processing CV file:", {
      error,
      fileName: file.name,
      fileSize: file.size
    });
    throw error;
  }
}
