'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Thank You for Participating!
            </CardTitle>
            <CardDescription className="mt-2 text-lg">
              Your interview has been successfully submitted.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground">
            We appreciate you taking the time to complete the interview. Your responses have been recorded and will be reviewed by our team.
          </p>
          
          <div className="pt-4 text-sm text-muted-foreground">
            <p>Need assistance? Contact our support team at support@sainxt.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
