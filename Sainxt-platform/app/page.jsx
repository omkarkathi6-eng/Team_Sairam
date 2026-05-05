"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Brain,
  Zap,
  Target,
  Users,
  Rocket,
  Star,
  Play,
  ChevronRight,
  Sparkles,
  Globe,
  BarChart3,
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Profile Builder",
    description:
      "Basis the Data Science & AI/ML aligned skills & qualification system will generate a profile score and a recommendation report on way forward to become a DS / AI professional.",
    gradient: "from-aqua-blue to-neon-coral",
  },
  {
    icon: Rocket,
    title: "Introductory Training Course",
    description: "An introductory Training Course, post the completion of the training there will a “Certificate of Participation” that will be generated.",
    gradient: "from-neon-coral to-electric-orange",
  },
  {
    icon: Target,
    title: "Thought Leadership",
    description: "Thought Leadership - provide insights on DS, AI/ML through White papers, blogs",
    gradient: "from-electric-orange to-aqua-blue",
  },
  {
    icon: BarChart3,
    title: "View Jobs",
    description: "provide DS, AI/ML jobs available today in the market",
    gradient: "from-aqua-blue to-electric-orange",
  },
]

const stats = [
  { value: "50K+", label: "Active Users", icon: Users, color: "text-aqua-blue" },
  { value: "95%", label: "Success Rate", icon: Target, color: "text-neon-coral" },
  { value: "500+", label: "Daily Placements", icon: Globe, color: "text-electric-orange" },
  { value: "4.9/5", label: "User Rating", icon: Star, color: "text-aqua-blue" },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "ML Engineer at TechCorp",
    content:
      "Jobraze transformed my career trajectory. The AI assessments revealed skills I didn't know I had and connected me with opportunities that perfectly matched my ambitions.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Data Scientist at InnovateLab",
    content:
      "The personalized learning paths and momentum-building features helped me transition from finance to AI in just 6 months. The platform's intelligence is remarkable.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "AI Researcher at FutureTech",
    content:
      "The precision matching and candidate insights have revolutionized how I identify my next career steps. The platform's ability to highlight hidden potentials is a game-changer.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
]

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    setIsClient(true)
  }, [])

  const handleFeatureClick = (e, path) => {
    // Check if user is authenticated
    const isAuthenticated = isClient && localStorage.getItem('access_token')
    
    if (!isAuthenticated) {
      e.preventDefault()
      // Store the intended path to redirect after login
      if (isClient) {
        localStorage.setItem('redirectAfterLogin', path)
      }
      window.location.href = '/auth/login'
    }
  }

  return (
    <div className="min-h-screen bg-surface-secondary relative overflow-hidden">
      {/* AI Circuit Background Pattern */}
      <div className="absolute inset-0 bg-ai-circuit opacity-30" />

      {/* Floating AI Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-aqua-blue/20 to-neon-coral/20 rounded-full animate-ai-pulse" />
      <div
        className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-neon-coral/20 to-electric-orange/20 rounded-full animate-ai-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-electric-orange/20 to-aqua-blue/20 rounded-full animate-ai-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* Navigation */}
    <nav className="relative z-50 border-b border-soft-gray/50 backdrop-blur-md bg-surface-primary/80">
  <div className="container mx-auto px-6 py-4">
    <div className="flex items-center justify-between relative">

      {/* Fixed Logo Section */}
      <div className="fixed top-4 left-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-deep-navy rounded-xl flex items-center justify-center relative overflow-hidden">
          <Sparkles className="h-6 w-6 text-aqua-blue" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-aqua-blue/20 to-transparent animate-data-flow" />
        </div>
        <span className="text-2xl font-bold text-deep-navy">Jobraze</span>
      </div>

      {/* Center Navigation Items */}
      <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-8">
        <Link href="#features" className="text-text-gray hover:text-neon-coral transition-colors font-medium">
          Features
        </Link>
        <Link href="#pricing" className="text-text-gray hover:text-neon-coral transition-colors font-medium">
          Pricing
        </Link>
        <Link href="#about" className="text-text-gray hover:text-neon-coral transition-colors font-medium">
          About
        </Link>
      </div>

      {/* Right Side Buttons */}
      <div className="flex items-center gap-4 ml-auto">
        <Button variant="ghost" asChild className="text-text-gray hover:text-neon-coral">
          <Link href="/auth/login">Sign In</Link>
        </Button>
        <Button
          asChild
          className="bg-neon-coral text-white hover:bg-electric-orange transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Link href="/auth/register">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  </div>
</nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="container mx-auto px-6 text-center">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Badge className="mb-6 bg-aqua-blue/10 text-aqua-blue border-aqua-blue/20 hover:bg-aqua-blue/20 transition-colors">
              <Zap className="mr-2 h-4 w-4" />
              AI-Powered Career Intelligence
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-deep-navy">Accelerate Your</span>
              <br />
              <span className="text-ai-gradient">AI Career Journey</span>
            </h1>

            <p className="text-xl text-text-gray mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your potential into opportunity with AI-powered assessments, personalized learning paths, and
              precision career matching. Join thousands building momentum in their careers with Jobraze.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                asChild
                className="bg-neon-coral text-white hover:bg-electric-orange transition-all duration-200 text-lg px-8 py-4 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Link href="/auth/register">
                  Start Your Assessment
                  <Rocket className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-deep-navy text-deep-navy hover:bg-deep-navy hover:text-white transition-all duration-200 text-lg px-8 py-4"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div
                    key={index}
                    className="text-center animate-momentum"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-aqua-blue to-neon-coral rounded-full flex items-center justify-center mx-auto mb-3 shadow-ai-glow">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-deep-navy mb-1">{stat.value}</div>
                    <div className="text-sm text-text-gray">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative bg-surface-primary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-neon-coral/10 text-neon-coral border-neon-coral/20">
              <Brain className="mr-2 h-4 w-4" />
              Intelligent Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-deep-navy mb-6">
              Built for <span className="text-ai-gradient">Ambitious Minds</span>
            </h2>
            <p className="text-xl text-text-gray max-w-2xl mx-auto">
              Experience the future of career development with cutting-edge AI technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-enterprise-lg transition-all duration-300 border-soft-gray bg-surface-primary card-ai-enhanced cursor-pointer"
                  onClick={(e) => {
                    const path = `/${feature.title.toLowerCase().replace(/\s+/g, '-')}`
                    handleFeatureClick(e, path)
                  }}
                >
                  <CardHeader className="pb-4">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-deep-navy group-hover:text-neon-coral transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-text-gray text-lg leading-relaxed">
                      {feature.description}
                    </CardDescription>
                    <div className="mt-4">
                      <Button 
                        variant="ghost" 
                        className="text-neon-coral hover:text-electric-orange p-0 group"
                        onClick={(e) => {
                          e.stopPropagation()
                          const path = `/${feature.title.toLowerCase().replace(/\s+/g, '-')}`
                          handleFeatureClick(e, path)
                        }}
                      >
                        Learn more
                        <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-surface-secondary relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-electric-orange/10 text-electric-orange border-electric-orange/20">
              <Users className="mr-2 h-4 w-4" />
              Success Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-deep-navy mb-6">
              Careers <span className="text-ai-gradient">Transformed</span>
            </h2>
            <p className="text-xl text-text-gray max-w-2xl mx-auto">
              Join thousands who've accelerated their careers with AI-powered intelligence and precision matching
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-soft-gray bg-surface-primary hover:shadow-enterprise-lg transition-all duration-300 card-enterprise"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-electric-orange fill-current" />
                    ))}
                  </div>
                  <p className="text-text-gray mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-neon-coral to-aqua-blue rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-deep-navy">{testimonial.name}</div>
                      <div className="text-sm text-text-gray">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative bg-surface-primary">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-deep-navy mb-6">
              Ready to <span className="text-ai-gradient">Launch Your Future?</span>
            </h2>
            <p className="text-xl text-text-gray mb-8 leading-relaxed">
              Join the AI revolution. Start your personalized assessment today and discover opportunities that align
              with your ambitions and accelerate your career momentum.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-neon-coral text-white hover:bg-electric-orange transition-all duration-200 text-lg px-8 py-4 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Link href="/auth/register">
                  Begin Assessment
                  <Rocket className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-deep-navy text-deep-navy hover:bg-deep-navy hover:text-white transition-all duration-200 text-lg px-8 py-4"
              >
                <Link href="/auth/login">
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-soft-gray bg-deep-navy py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-aqua-blue rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Jobraze</span>
              </div>
              <p className="text-text-gray leading-relaxed">
                Accelerating careers through AI-powered intelligence, precision matching, and momentum-building
                strategies.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-text-gray">
                <li>
                  <Link href="#" className="hover:text-aqua-blue transition-colors">
                    AI Assessments
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-aqua-blue transition-colors">
                    Learning Paths
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-aqua-blue transition-colors">
                    Career Matching
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-aqua-blue transition-colors">
                    Intelligence Analytics
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Solutions</h4>
              <ul className="space-y-2 text-text-gray">
                <li>
                  <Link href="#" className="hover:text-aqua-blue transition-colors">
                    For Individuals
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-text-gray">
                <li>
                  <Link href="#" className="hover:text-aqua-blue transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-aqua-blue transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-aqua-blue transition-colors">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-aqua-blue transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-graphite-gray mt-8 pt-8 text-center text-text-gray">
            <p>
              &copy; 2024 Jobraze. All rights reserved. Accelerating the future of work with AI-powered intelligence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
