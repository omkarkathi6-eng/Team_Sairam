import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { STEPS } from "../constants";

export default function WelcomeStep({ agreedToTerms, onAgreeChange, onNext }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Welcome to Your AI Interview</h2>
      <p className="text-center text-gray-600">
        This interview will help us evaluate your skills and experience. Please ensure you have a quiet environment and a stable internet connection.
      </p>
      
      <div className="space-y-4">
        <h3 className="font-semibold">Before we begin:</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Find a quiet, well-lit space</li>
          <li>Ensure your camera and microphone are working</li>
          <li>Close any unnecessary applications</li>
          <li>Have your ID ready if required</li>
        </ul>
      </div>

      <Alert variant="destructive" className="flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <AlertDescription>
          <p className="font-medium">Important Notice:</p>
          <p>This interview will be recorded for evaluation purposes. By proceeding, you consent to this recording.</p>
        </AlertDescription>
      </Alert>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          checked={agreedToTerms}
          onCheckedChange={onAgreeChange}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the terms and conditions and consent to being recorded
        </label>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={onNext} 
          disabled={!agreedToTerms}
          className="mt-4"
        >
          Continue to Device Test
        </Button>
      </div>
    </div>
  );
}
