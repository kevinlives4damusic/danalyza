import React from 'react';
import { AnalysisResults } from '@/lib/types/analysis';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { PremiumFeature } from './PremiumFeature';

interface DetailedAnalysisProps {
  analysisData: AnalysisResults;
  onBack: () => void;
}

export function DetailedAnalysis({ analysisData, onBack }: DetailedAnalysisProps) {
  const handleExportPDF = () => {
    // Implement PDF export logic
    console.log('Exporting to PDF...');
  };

  const handleShare = () => {
    // Implement sharing logic
    console.log('Sharing analysis...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Summary
        </Button>
        <div className="flex gap-2">
          <PremiumFeature feature="pdfExport">
            <Button variant="outline" onClick={handleExportPDF} className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </PremiumFeature>
          <Button variant="outline" onClick={handleShare} className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <PremiumFeature feature="detailedAnalysis">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Industry Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Your CV aligns with {analysisData.skills?.length || 0} key industry skills.
                Here's how your experience compares to industry standards:
              </p>
              {/* Add industry comparison visualization */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Keyword Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Based on your target industry, we recommend including these keywords:
              </p>
              {/* Add keyword suggestions */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Experience Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisData.experience?.map((exp, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <h4 className="font-medium">{exp.title}</h4>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.duration}</p>
                    <p className="text-sm mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Education Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisData.education?.map((edu, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <h4 className="font-medium">{edu.degree}</h4>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500">{edu.year}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {analysisData.recommendations?.map((rec, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {rec}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </PremiumFeature>
    </div>
  );
}
