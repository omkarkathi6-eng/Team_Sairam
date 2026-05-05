import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">Effective Date: August 7, 2025</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <p className="mb-4">
            Your privacy is important to us. This policy explains how we collect, use, and protect your data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Personal Information:</strong> Name, email, phone number, resume, work history, etc.</li>
            <li><strong>Usage Data:</strong> IP address, browser type, pages visited, and clicks.</li>
            <li><strong>Cookies:</strong> We use cookies to personalize your experience.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To help you find relevant job opportunities.</li>
            <li>To allow recruiters to view and contact qualified candidates.</li>
            <li>To improve our platform and user experience.</li>
            <li>To send notifications, updates, and promotional content (you may opt out).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Data Sharing</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>With employers/recruiters when you apply or make your profile public.</li>
            <li>With third-party service providers assisting in platform operations.</li>
            <li>We do not sell your data to advertisers.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p className="mb-4">
            We implement industry-standard encryption and security practices to protect your data from unauthorized access.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. User Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Access your data.</li>
            <li>Correct or delete your profile.</li>
            <li>Request restriction or objection to data processing.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Retention</h2>
          <p className="mb-4">
            We retain your data only as long as necessary to fulfill our services or comply with legal requirements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <p>
            For any privacy-related queries, contact us at: <strong>📧 support@jobraze.in</strong>
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
