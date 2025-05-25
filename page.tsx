"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Loader2,
  FileText,
  HelpCircle,
  UploadCloud,
  AlertCircle,
  Cpu,
  Brain,
} from "lucide-react";

interface ExtractRelevantChunkOutput {
  timestamp: string;
  chunk: string;
  method_used: string;
}

export default function TranscriptNavigatorPage() {
  const [transcript, setTranscript] = useState<string>("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("LLM2");
  const [result, setResult] = useState<ExtractRelevantChunkOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setTranscript(e.target?.result as string);
        setError(null);
        setResult(null);
      };
      reader.onerror = () => {
        setError("Failed to read the transcript file.");
        setFileName(null);
        setTranscript("");
      };
      reader.readAsText(file);
    } else {
      setTranscript("");
      setFileName(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!transcript) {
      setError("Please upload a transcript file.");
      return;
    }
    if (!question) {
      setError("Please enter a question.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        "http://localhost:8000/answer",  //https://semantic-navigator-backend.onrender.com/answer
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transcript,
            question,
            method: selectedModel.toLowerCase(),
          }),
        }
      );

      if (!response.ok) throw new Error("Backend error");

      const data = await response.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      setError("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-2xl shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="text-center bg-card p-6 border-b border-border">
          <div className="flex justify-center items-center mb-3">
            <UploadCloud className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Transcript Navigator
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1">
            Upload a transcript, choose your AI model, ask a question, and find
            the most relevant chunk.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <Label
                htmlFor="transcript-upload"
                className="flex items-center text-md font-medium text-foreground"
              >
                <UploadCloud className="mr-2 h-5 w-5 text-primary" /> Upload
                Transcript File
              </Label>
              <Input
                id="transcript-upload"
                type="file"
                accept=".txt,.srt"
                onChange={handleFileChange}
              />
              {fileName && (
                <p className="text-xs text-muted-foreground mt-1">
                  Selected: {fileName}
                </p>
              )}
            </div>

            {/* Question Input */}
            <div className="space-y-2">
              <Label
                htmlFor="question-input"
                className="flex items-center text-md font-medium text-foreground"
              >
                <HelpCircle className="mr-2 h-5 w-5 text-primary" /> Ask Your
                Question
              </Label>
              <Textarea
                id="question-input"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                placeholder="e.g., What was the main point of the discussion?"
              />
            </div>

            {/* Model Selector */}
            <div className="space-y-2">
              <Label className="text-md font-medium text-foreground flex items-center">
                <Cpu className="mr-2 h-5 w-5 text-primary" /> Choose AI Model
              </Label>
              <RadioGroup
                value={selectedModel}
                onValueChange={setSelectedModel}
                className="flex flex-col sm:flex-row sm:space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="LLM2" id="llm2-model" />
                  <Label
                    htmlFor="llm2-model"
                    className="font-normal flex items-center"
                  >
                    <Brain className="mr-1.5 h-4 w-4 text-muted-foreground" />{" "}
                    LLM2 Model
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="TFIDF" id="tfidf-model" />
                  <Label
                    htmlFor="tfidf-model"
                    className="font-normal flex items-center"
                  >
                    <FileText className="mr-1.5 h-4 w-4 text-muted-foreground" />{" "}
                    TFIDF Model
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-base py-3 rounded-lg shadow-md flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                </>
              ) : (
                <>Find Relevant Chunk</>
              )}
            </Button>
          </form>
        </CardContent>

        {error && (
          <div className="p-6 border-t border-border">
            <Alert variant="destructive">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="font-semibold">Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {result && (
          <div className="p-6 border-t border-border space-y-6">
            <h3 className="text-xl font-semibold text-primary flex items-center">
              <FileText className="mr-2 h-6 w-6" /> AI Response (
              {result.method_used.toUpperCase()})
            </h3>
            <div className="w-full p-4 bg-secondary/30 rounded-lg space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-1">
                  Relevant Chunk:
                </Label>
                <div className="bg-background p-3 rounded-md text-sm border">
                  {result.chunk}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-1">
                  Timestamp:
                </Label>
                <div className="bg-background p-3 rounded-md text-sm border font-mono">
                  {result.timestamp}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
