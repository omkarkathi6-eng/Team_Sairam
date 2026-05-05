import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">Effective Date: August 7, 2025</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
        <h3>
           Welcome to Jobraze. By using our platform, you agree to the following terms:
        </h3>
           
         
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using the Jobraze website or services, you agree to be bound by these Terms of Service. If you do not agree, you may not access the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>You are responsible for maintaining the confidentiality of your account.</li>
            <li>You agree to provide accurate, current, and complete information.</li>
            <li>You may not create an account using false information or impersonate another individual or entity.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Use of Services</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Job seekers may create profiles, upload resumes, and apply for jobs.</li>
            <li>Employers may post job listings and view candidate profiles.</li>
            <li>You agree not to use the platform for any unlawful, misleading, or fraudulent purpose.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
          <p className="mb-4">
            All content, trademarks, and data on the Jobraze platform are owned by or licensed to Jobraze and are protected by intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Termination</h2>
          <p className="mb-4">
            We reserve the right to suspend or terminate your account if you violate these Terms or engage in harmful behavior.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Disclaimer</h2>
          <p className="mb-4">
            Jobraze is not liable for the accuracy or legitimacy of user-submitted content, including job postings and resumes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Governing Law</h2>
          <p className="mb-4">
            These terms are governed by the laws of India. Disputes arising out of this agreement will be settled in courts.
          </p>
        </section>
      </div>

      <div className="mt-12 text-center">
        <Button asChild variant="outline">
          <Link href="/auth/register">
            Back to Registration
          </Link>
        </Button>
      </div>
    </div>
  )
}
