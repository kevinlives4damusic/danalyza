import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Upload, File, X, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { processCVFile } from "@/lib/pdfAnalyzer";

type UploadSectionProps = {
  onFileUploaded?: (file: File) => void;
  className?: string;
};

const UploadSection = ({
  onFileUploaded = () => {},
  className,
}: UploadSectionProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];

      // Validate file type (PDF only)
      if (selectedFile && selectedFile.type !== "application/pdf") {
        setErrorMessage("Only PDF files are accepted.");
        setUploadStatus("error");
        return;
      }

      if (selectedFile) {
        setFile(selectedFile);
        setUploadStatus("uploading");
        setErrorMessage("");

        try {
          // Start progress animation
          let progress = 0;
          const interval = setInterval(() => {
            progress = Math.min(progress + 5, 95); // Cap at 95% until complete
            setUploadProgress(progress);
          }, 100);

          // Process the CV file with the PDF analyzer
          await processCVFile(selectedFile);

          // Complete the progress
          clearInterval(interval);
          setUploadProgress(100);
          setUploadStatus("success");
          onFileUploaded(selectedFile);
        } catch (error) {
          console.error("Error processing CV:", error);
          setErrorMessage(
            "There was an error processing your CV. Please try again.",
          );
          setUploadStatus("error");
        }
      }
    },
    [onFileUploaded],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const resetUpload = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadStatus("idle");
    setErrorMessage("");
  };

  return (
    <div
      className={cn(
        "w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md",
        className,
      )}
    >
      <h2 className="text-2xl font-semibold text-center mb-4">
        Upload Your CV
      </h2>

      {uploadStatus === "error" && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {uploadStatus === "success" ? (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-green-200 rounded-lg bg-green-50">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
            <span className="text-lg font-medium text-green-700">
              Upload Complete!
            </span>
          </div>

          <div className="flex items-center mb-4 p-3 bg-white rounded-lg shadow-sm w-full">
            <File className="h-6 w-6 text-gray-500 mr-3" />
            <span className="text-sm text-gray-700 truncate flex-1">
              {file?.name}
            </span>
            <span className="text-xs text-gray-500">
              {file?.size ? (file.size / 1024 / 1024).toFixed(2) : 0} MB
            </span>
          </div>

          <Button variant="outline" onClick={resetUpload} className="mt-2">
            Upload Another CV
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors",
            isDragActive
              ? "border-blue-400 bg-blue-50"
              : "border-gray-200 bg-gray-50 hover:bg-gray-100",
            uploadStatus === "uploading" && "pointer-events-none opacity-80",
          )}
        >
          <input {...getInputProps()} />

          {uploadStatus === "uploading" ? (
            <div className="w-full">
              <div className="flex items-center justify-center mb-4">
                <File className="h-8 w-8 text-blue-500 animate-pulse" />
              </div>
              <p className="text-center text-gray-700 mb-2">
                Uploading {file?.name}...
              </p>
              <Progress value={uploadProgress} className="h-2 mb-2" />
              <p className="text-xs text-center text-gray-500">
                {uploadProgress}% complete
              </p>
            </div>
          ) : (
            <>
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-lg font-medium text-center mb-2">
                {isDragActive
                  ? "Drop your CV here"
                  : "Drag & drop your CV here"}
              </p>
              <p className="text-sm text-gray-500 text-center mb-4">
                or click to browse files (PDF only)
              </p>
              <Button type="button" className="mb-2">
                Browse Files
              </Button>
              <p className="text-xs text-gray-400 text-center">
                Maximum file size: 5MB
              </p>
            </>
          )}
        </div>
      )}

      {file && uploadStatus !== "success" && (
        <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <File className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700 truncate max-w-xs">
              {file.name}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={resetUpload}
            disabled={uploadStatus === "uploading"}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Your CV will be analyzed for content, formatting, and professional
          appeal.
          <br />
          We'll provide detailed feedback to help improve your job prospects.
        </p>
      </div>
    </div>
  );
};

export default UploadSection;
