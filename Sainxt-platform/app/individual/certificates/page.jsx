"use client";

import React, { useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/custom_auth-provider";
// If using react-to-pdf later: import ReactToPdf from "react-to-pdf";

const CertificatePage = () => {
  const { user } = useAuth();
  const userName = user?.first_name || user?.name || "Learner";
  const certRef = useRef(null);

  // Get formatted current date and time
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const handleDownload = async () => {
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const input = certRef.current;
    if (!input) return;

    // Wait for images to load before taking snapshot
    const images = input.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) return resolve();
            img.onload = img.onerror = resolve;
          })
      )
    );

    // Optional: Wait for font rendering
    await new Promise((res) => setTimeout(res, 300));

    // Take canvas screenshot
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate scaled height preserving aspect ratio
    const imgProps = {
      width: canvas.width,
      height: canvas.height,
    };
    const ratio = imgProps.height / imgProps.width;
    const finalHeight = pdfWidth * ratio;

    // Center vertically if content is shorter than page
    const verticalOffset = (pdfHeight - finalHeight) / 2;

    pdf.addImage(imgData, "PNG", 0, verticalOffset, pdfWidth, finalHeight);
    pdf.save("certificate.pdf");

    const blob = pdf.output("blob");
    const formData = new FormData();
    formData.append("file", blob, "ai101_certificate.pdf");

    await fetch(
      "https://www.jobraze.in/api/user/training-progress/upload-certificate",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-inter">
        {/* Certificate */}
        <div
          ref={certRef}
          className="relative w-full max-w-4xl bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          {/* Decorative Background Waves */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -bottom-20 -left-40 w-[600px] h-[300px] bg-[#FF5E3A] rotate-45 rounded-full opacity-10" />
            <div className="absolute -bottom-40 -left-20 w-[700px] h-[350px] bg-[#FF7A5A] rotate-45 rounded-full opacity-20" />
            <div className="absolute -top-20 -right-40 w-[600px] h-[300px] bg-[#FFB4A4] -rotate-45 rounded-full opacity-10" />
            <div className="absolute -top-40 -right-20 w-[700px] h-[350px] bg-[#FFD2C8] -rotate-45 rounded-full opacity-20" />
          </div>

          {/* Certificate Content */}
          <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col items-center text-center">
            {/* Logo & Brand */}
            <div className="w-full flex justify-start mb-4">
              <div className="absolute top-8 left-8 md:top-12 md:left-12 lg:top-16 lg:left-16 flex items-center space-x-3">
                <div className="w-10 h-10 relative">
                  <Image
                    src="/Screenshot 2025-07-02 at 2.51.47 PM.png"
                    alt="Company Logo"
                    fill
                    className="object-contain rounded-md"
                  />
                </div>
                <div className="flex flex-col items-start">
                  <p className="text-lg md:text-xl font-bold text-gray-800">
                    Jobraze
                  </p>
                </div>
              </div>
            </div>

            {/* Ribbon */}
            <div className="absolute top-8 right-8 md:top-12 md:right-12 lg:top-16 lg:right-16 bg-[#FF5E3A] rounded-full p-4 shadow-md">
              <svg
                className="w-12 h-12 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-8 bg-[#FF5E3A] rounded-b-full" />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-4 bg-[#E14A26] rounded-b-full opacity-50" />
            </div>

            {/* Certificate Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 tracking-wide  border-[#FF5E3A] pb-2 mb-2">
              CERTIFICATE
            </h1>
            <p className="text-xl md:text-2xl text-[#FF5E3A] mb-8">
              OF PARTICIPATION
            </p>

            {/* Recipient Name */}
            <p className="text-lg md:text-xl text-gray-700 mb-2">
              This certificate is presented to
            </p>
            <h2
              className="text-5xl md:text-6xl lg:text-7xl mb-6"
              style={{
                fontFamily: "'Dancing Script', cursive",
                color: "#FF5E3A",
              }}
            >
              {userName}
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              for participating in
            </p>

            {/* Course Description */}
            <p className="text-md md:text-lg text-gray-600 leading-relaxed max-w-2xl mb-12">
              For successfully completing and actively participating in the
              Artificial Intelligence Fundamentals course. Demonstrated
              dedication to learning key concepts in machine learning, neural
              networks, and AI applications.
            </p>

            {/* Footer */}
            <div className="flex flex-col md:flex-row justify-between w-full max-w-2xl mt-12 px-4">
              <div className="text-left">
                <p className="text-lg font-semibold text-gray-800 mb-1">
                  Date & Place
                </p>
                <p className="text-md text-gray-600">
                  {formattedDate}, {formattedTime}, Bengaluru
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-800 mb-1">
                  Signature
                </p>
                <p className="text-md text-gray-600"> ____________________</p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <Button
          onClick={handleDownload}
          className="mt-6 bg-[#FF5E3A] text-white hover:bg-[#e44b1f]"
        >
          Download PDF
        </Button>
      </div>
    </>
  );
};

export default CertificatePage;
