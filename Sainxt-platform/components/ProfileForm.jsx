import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  BookOpen,
  Award,
  Briefcase,
  Target,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Upload,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Plus,
  Trash2,
  X,
  Globe,
  Building,
  Zap,
  Sparkles,
  Laptop,
  Lightbulb,
  DollarSign,
  MapPinned,
  Video,
  BriefcaseIcon,
  Users,
  Brain,
  Shield,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

// import { ChevronLeft, ChevronRight, Upload, Plus, Trash2 } from "lucide-react";

export default function ProfileForm({
  formData,
  setFormData,
  currentStep,
  setCurrentStep,
  steps,
  formErrors,
  setFormErrors,
  profilePhotoPreview,
  setProfilePhotoPreview,
  handlePhotoUpload,
  maxDate,
  customSkill,
  setCustomSkill,
  customSoftSkill,
  setCustomSoftSkill,
  technicalSkillOptions,
  softSkillOptions,
  jobTypes,
  workEnvironments,
  industries,
  companySizes,
  handleNext,
  handlePrevious,
  handleSaveDraft,
  hasEvaluationResult,
  isLoading,
  canReanalyze,
  daysUntilReanalysis,
  handleReanalyzeButtonClick,
  handleViewEvaluation,
  setShowDetailedRecommendations,
  handleViewUpdated,
  toggleTechnicalSkill,
  addCustomSkill,
  toggleSoftSkill,
  addLanguage,
  updateLanguage,
  removeLanguage,
  toggleJobType,
  addLocation,
  removeLocation,
  toggleIndustry,
  toggleCompanySize,
  addAdditionalEducation,
  updateAdditionalEducation,
  removeAdditionalEducation,
  addWorkExperience,
  updateWorkExperience,
  removeWorkExperience,
  addProject,
  updateProject,
  removeProject,
  showReportOptions,
  setShowReportOptions,
  setShowActualEvaluation,
  evaluationAvailable,
  fetchUpdatedEvaluation,
}) {
  const handleSelfEvaluationReport = () => {
    setShowReportOptions(false);
    setShowDetailedRecommendations(true);
  };

  // Handler for Actual Evaluation Report button in modal
  const handleActualEvaluationReport = () => {
    setShowReportOptions(false);
    fetchUpdatedEvaluation();
    setShowActualEvaluation(true);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {profilePhotoPreview ? (
                    <img
                      src={
                        profilePhotoPreview ||
                        userProfile?.profile_photo_url ||
                        "/default-avatar.png"
                      }
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full"
                  onClick={() =>
                    document.getElementById("photo-upload").click()
                  }
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="Enter your first name"
                  className={formErrors.firstName ? "border-red-500" : ""}
                />
                {formErrors.firstName && (
                  <p className="text-sm text-red-500">{formErrors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Enter your last name"
                  className={formErrors.lastName ? "border-red-500" : ""}
                />
                {formErrors.lastName && (
                  <p className="text-sm text-red-500">{formErrors.lastName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    placeholder="your.email@example.com"
                    className={`pl-10 cursor-not-allowed ${
                      formErrors.email ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {formErrors.email && (
                  <p className="text-sm text-red-500">{formErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Ensure the prefix "+91 " is always present
                      if (!value.startsWith("+91 ")) {
                        value =
                          "+91 " +
                          value.replace(/^\+91\s*/, "").replace(/[^0-9]/g, "");
                      }
                      // Limit to 10 digits after "+91 "
                      const digits = value
                        .replace(/^\+91\s*/, "")
                        .replace(/[^0-9]/g, "");
                      if (digits.length <= 10) {
                        setFormData({
                          ...formData,
                          phone: "+91 " + digits,
                        });
                      }
                    }}
                    placeholder="+91 1234567890"
                    className={`pl-10 ${
                      formErrors.phone ? "border-red-500" : ""
                    }`}
                    maxLength={14} // Allows for "+91 " (4 chars) + 10 digits
                  />
                  {formErrors.phone && (
                    <p className="text-sm text-red-500">{formErrors.phone}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="City, State, Country"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dateOfBirth: e.target.value,
                      })
                    }
                    max={maxDate} // Restrict to at least 18 years ago
                    className={`pl-10 ${
                      formErrors.dateOfBirth ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {formErrors.dateOfBirth && (
                  <p className="text-sm text-red-500">
                    {formErrors.dateOfBirth}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Tell us about yourself, your interests, and career goals..."
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                A compelling bio helps employers understand your background and
                aspirations.
              </p>
            </div>
          </div>
        );

      // Updated Education Section (Case 2 in renderStepContent function)

      case 2:
        return (
          <div className="space-y-6">
            {/* Primary Education Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                Primary Education
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="university">University/Institution *</Label>
                  <Input
                    id="university"
                    value={formData.university}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        university: e.target.value,
                      })
                    }
                    placeholder="e.g., Stanford University"
                    className={formErrors.university ? "border-red-500" : ""}
                  />
                  {formErrors.university && (
                    <p className="text-sm text-red-500">
                      {formErrors.university}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="degree">Degree Level *</Label>
                  <Select
                    value={formData.degree}
                    onValueChange={(value) =>
                      setFormData({ ...formData, degree: value })
                    }
                  >
                    <SelectTrigger
                      className={formErrors.degree ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select degree level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="associate">
                        Associate's Degree
                      </SelectItem>
                      <SelectItem value="bachelor">
                        Bachelor's Degree
                      </SelectItem>
                      <SelectItem value="master">Master's Degree</SelectItem>
                      <SelectItem value="phd">Ph.D.</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.degree && (
                    <p className="text-sm text-red-500">{formErrors.degree}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="major">Major/Field of Study *</Label>
                  <Input
                    id="major"
                    value={formData.major}
                    onChange={(e) =>
                      setFormData({ ...formData, major: e.target.value })
                    }
                    placeholder="e.g., Computer Science"
                    className={formErrors.major ? "border-red-500" : ""}
                  />
                  {formErrors.major && (
                    <p className="text-sm text-red-500">{formErrors.major}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year *</Label>
                  <Select
                    value={formData.graduationYear}
                    onValueChange={(value) =>
                      setFormData({ ...formData, graduationYear: value })
                    }
                  >
                    <SelectTrigger
                      className={
                        formErrors.graduationYear ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Current/Pursuing options */}
                      <SelectItem value="pursuing">
                        Currently Pursuing
                      </SelectItem>
                      <SelectItem
                        value={`expected-${new Date().getFullYear()}`}
                      >
                        Expected {new Date().getFullYear()}
                      </SelectItem>
                      <SelectItem
                        value={`expected-${new Date().getFullYear() + 1}`}
                      >
                        Expected {new Date().getFullYear() + 1}
                      </SelectItem>
                      <SelectItem
                        value={`expected-${new Date().getFullYear() + 2}`}
                      >
                        Expected {new Date().getFullYear() + 2}
                      </SelectItem>
                      <SelectItem
                        value={`expected-${new Date().getFullYear() + 3}`}
                      >
                        Expected {new Date().getFullYear() + 3}
                      </SelectItem>
                      <SelectItem
                        value={`expected-${new Date().getFullYear() + 4}`}
                      >
                        Expected {new Date().getFullYear() + 4}
                      </SelectItem>

                      {/* Separator */}
                      <div className="px-2 py-1 text-xs font-medium text-gray-500 border-t">
                        Completed
                      </div>

                      {/* Past graduation years */}
                      {Array.from({ length: 30 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {formErrors.graduationYear && (
                    <p className="text-sm text-red-500">
                      {formErrors.graduationYear}
                    </p>
                  )}

                  {/* Show helper text for pursuing students */}
                  {(formData.graduationYear === "pursuing" ||
                    formData.graduationYear?.startsWith("expected-")) && (
                    <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      💡 You can update this once you graduate
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gpa">
                    {formData.graduationYear === "pursuing" ||
                    formData.graduationYear?.startsWith("expected-")
                      ? "Current GPA (Optional)"
                      : "GPA (Optional)"}
                  </Label>
                  <Input
                    id="gpa"
                    value={formData.gpa}
                    onChange={(e) =>
                      setFormData({ ...formData, gpa: e.target.value })
                    }
                    placeholder="e.g., 3.8"
                    className={formErrors.gpa ? "border-red-500" : ""}
                  />
                  {formErrors.gpa && (
                    <p className="text-sm text-red-500">{formErrors.gpa}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Education Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center">
                  <Award className="mr-2 h-5 w-5 text-[#33D6C4]" />
                  Additional Education
                </h3>
                <Button
                  onClick={addAdditionalEducation}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Another Degree
                </Button>
              </div>

              {formData.additionalEducation.map((education) => (
                <Card key={education.id} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => removeAdditionalEducation(education.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>University/Institution</Label>
                        <Input
                          value={education.university}
                          onChange={(e) =>
                            updateAdditionalEducation(
                              education.id,
                              "university",
                              e.target.value
                            )
                          }
                          placeholder="e.g., MIT"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Degree Level</Label>
                        <Select
                          value={education.degree}
                          onValueChange={(value) =>
                            updateAdditionalEducation(
                              education.id,
                              "degree",
                              value
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select degree level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="associate">
                              Associate's Degree
                            </SelectItem>
                            <SelectItem value="bachelor">
                              Bachelor's Degree
                            </SelectItem>
                            <SelectItem value="master">
                              Master's Degree
                            </SelectItem>
                            <SelectItem value="phd">Ph.D.</SelectItem>
                            <SelectItem value="diploma">Diploma</SelectItem>
                            <SelectItem value="certificate">
                              Certificate
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Major/Field of Study</Label>
                        <Input
                          value={education.major}
                          onChange={(e) =>
                            updateAdditionalEducation(
                              education.id,
                              "major",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Data Science"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Graduation Year</Label>
                        <Select
                          value={education.graduationYear}
                          onValueChange={(value) =>
                            updateAdditionalEducation(
                              education.id,
                              "graduationYear",
                              value
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Current/Pursuing options */}
                            <SelectItem value="pursuing">
                              Currently Pursuing
                            </SelectItem>
                            <SelectItem
                              value={`expected-${new Date().getFullYear()}`}
                            >
                              Expected {new Date().getFullYear()}
                            </SelectItem>
                            <SelectItem
                              value={`expected-${new Date().getFullYear() + 1}`}
                            >
                              Expected {new Date().getFullYear() + 1}
                            </SelectItem>
                            <SelectItem
                              value={`expected-${new Date().getFullYear() + 2}`}
                            >
                              Expected {new Date().getFullYear() + 2}
                            </SelectItem>
                            <SelectItem
                              value={`expected-${new Date().getFullYear() + 3}`}
                            >
                              Expected {new Date().getFullYear() + 3}
                            </SelectItem>
                            <SelectItem
                              value={`expected-${new Date().getFullYear() + 4}`}
                            >
                              Expected {new Date().getFullYear() + 4}
                            </SelectItem>

                            {/* Separator */}
                            <div className="px-2 py-1 text-xs font-medium text-gray-500 border-t">
                              Completed
                            </div>

                            {/* Past graduation years */}
                            {Array.from({ length: 30 }, (_, i) => {
                              const year = new Date().getFullYear() - i;
                              return (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>

                        {/* Show helper text for pursuing students */}
                        {(education.graduationYear === "pursuing" ||
                          education.graduationYear?.startsWith(
                            "expected-"
                          )) && (
                          <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                            💡 You can update this once you graduate
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>
                          {education.graduationYear === "pursuing" ||
                          education.graduationYear?.startsWith("expected-")
                            ? "Current GPA (Optional)"
                            : "GPA (Optional)"}
                        </Label>
                        <Input
                          value={education.gpa}
                          onChange={(e) =>
                            updateAdditionalEducation(
                              education.id,
                              "gpa",
                              e.target.value
                            )
                          }
                          placeholder="e.g., 3.8"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {formData.additionalEducation.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <Award className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <h4 className="text-muted-foreground">
                    No additional education added yet
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Add additional degrees, diplomas, or certifications
                  </p>
                  <Button
                    onClick={addAdditionalEducation}
                    variant="outline"
                    className="mt-2"
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add Another Degree
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-[#F8F9FA] dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 text-[#FF5E3A] dark:text-yellow-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    Education Tips
                  </h4>
                  <p className="text-sm text-muted-foreground dark:text-gray-300">
                    Include all relevant degrees and diplomas. For current
                    students, select "Currently Pursuing" or expected graduation
                    year. This helps employers understand your qualifications
                    and commitment to continuous learning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 3: // Experience
        return (
          <div className="space-y-8">
            {/* Work Experience Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                  Work Experience
                </h3>
                <Button
                  onClick={addWorkExperience}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Experience
                </Button>
              </div>

              {formData.workExperiences.map((experience, index) => (
                <Card key={experience.id} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => removeWorkExperience(experience.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`job-title-${experience.id}`}>
                          Job Title *
                        </Label>
                        <Input
                          id={`workExpTitle_${experience.id}`}
                          value={experience.title}
                          onChange={(e) =>
                            updateWorkExperience(
                              experience.id,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Software Engineer"
                          className={
                            formErrors[`workExpTitle_${experience.id}`]
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {formErrors[`workExpTitle_${experience.id}`] && (
                          <p className="text-sm text-red-500">
                            {formErrors[`workExpTitle_${experience.id}`]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`company-${experience.id}`}>
                          Company *
                        </Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`workExpCompany_${experience.id}`}
                            value={experience.company}
                            onChange={(e) =>
                              updateWorkExperience(
                                experience.id,
                                "company",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Google"
                            className={`pl-10 ${
                              formErrors[`workExpCompany_${experience.id}`]
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                        </div>
                        {formErrors[`workExpCompany_${experience.id}`] && (
                          <p className="text-sm text-red-500">
                            {formErrors[`workExpCompany_${experience.id}`]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`work-location-${experience.id}`}>
                          Location
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`work-location-${experience.id}`}
                            value={experience.location}
                            onChange={(e) =>
                              updateWorkExperience(
                                experience.id,
                                "location",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Bengaluru, Karnataka, India"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor={`start-date-${experience.id}`}>
                            Start Date *
                          </Label>
                          <Input
                            id={`workExpStartDate_${experience.id}`}
                            type="month"
                            value={experience.startDate}
                            onChange={(e) =>
                              updateWorkExperience(
                                experience.id,
                                "startDate",
                                e.target.value
                              )
                            }
                            className={
                              formErrors[`workExpStartDate_${experience.id}`]
                                ? "border-red-500"
                                : ""
                            }
                          />
                          {formErrors[`workExpStartDate_${experience.id}`] && (
                            <p className="text-sm text-red-500">
                              {formErrors[`workExpStartDate_${experience.id}`]}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor={`end-date-${experience.id}`}>
                              End Date
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`current-job-${experience.id}`}
                                checked={experience.current}
                                onCheckedChange={(checked) =>
                                  updateWorkExperience(
                                    experience.id,
                                    "current",
                                    checked
                                  )
                                }
                              />
                              <Label
                                htmlFor={`current-job-${experience.id}`}
                                className="text-sm font-normal"
                              >
                                Current
                              </Label>
                            </div>
                          </div>
                          <Input
                            id={`end-date-${experience.id}`}
                            type="month"
                            value={experience.endDate}
                            onChange={(e) =>
                              updateWorkExperience(
                                experience.id,
                                "endDate",
                                e.target.value
                              )
                            }
                            disabled={experience.current}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Label htmlFor={`description-${experience.id}`}>
                        Description
                      </Label>
                      <Textarea
                        id={`description-${experience.id}`}
                        value={experience.description}
                        onChange={(e) =>
                          updateWorkExperience(
                            experience.id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe your responsibilities and achievements..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {formData.workExperiences.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <Briefcase className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <h4 className="text-muted-foreground">
                    No work experience added yet
                  </h4>
                  <Button
                    onClick={addWorkExperience}
                    variant="outline"
                    className="mt-2"
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add Work Experience
                  </Button>
                </div>
              )}
            </div>

            {/* Projects Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center">
                  <Laptop className="mr-2 h-5 w-5 text-[#33D6C4]" />
                  Projects
                </h3>
                <Button
                  onClick={addProject}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Project
                </Button>
              </div>

              {formData.projects.map((project) => (
                <Card key={project.id} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => removeProject(project.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`project-title-${project.id}`}>
                          Project Title *
                        </Label>
                        <Input
                          id={`projectTitle_${project.id}`}
                          value={project.title}
                          onChange={(e) =>
                            updateProject(project.id, "title", e.target.value)
                          }
                          placeholder="e.g., E-commerce Platform"
                          className={
                            formErrors[`projectTitle_${project.id}`]
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {formErrors[`projectTitle_${project.id}`] && (
                          <p className="text-sm text-red-500">
                            {formErrors[`projectTitle_${project.id}`]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`project-url-${project.id}`}>
                          Project URL
                        </Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`project-url-${project.id}`}
                            value={project.url}
                            onChange={(e) =>
                              updateProject(project.id, "url", e.target.value)
                            }
                            placeholder="e.g., https://github.com/username/project"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`project-start-${project.id}`}>
                          Start Date
                        </Label>
                        <Input
                          id={`project-start-${project.id}`}
                          type="month"
                          value={project.startDate}
                          onChange={(e) =>
                            updateProject(
                              project.id,
                              "startDate",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`project-end-${project.id}`}>
                          End Date
                        </Label>
                        <Input
                          id={`project-end-${project.id}`}
                          type="month"
                          value={project.endDate}
                          onChange={(e) =>
                            updateProject(project.id, "endDate", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Label htmlFor={`project-description-${project.id}`}>
                        Description
                      </Label>
                      <Textarea
                        id={`project-description-${project.id}`}
                        value={project.description}
                        onChange={(e) =>
                          updateProject(
                            project.id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe the project, technologies used, and your role..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {formData.projects.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <Laptop className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <h4 className="text-muted-foreground">
                    No projects added yet
                  </h4>
                  <Button
                    onClick={addProject}
                    variant="outline"
                    className="mt-2"
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add Project
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-[#F8F9FA] dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 text-[#FF5E3A] dark:text-yellow-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    Pro Tip
                  </h4>
                  <p className="text-sm text-muted-foreground dark:text-gray-300">
                    Adding detailed work experience and projects helps employers
                    understand your capabilities and increases your chances of
                    getting matched with relevant opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Skills
        return (
          <div className="space-y-8">
            {/* Technical Skills Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Zap className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                Technical Skills*
              </h3>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Select all the technical skills that apply to you
                </Label>

                {/* Selected Skills */}
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(formData.technicalSkills) &&
                    formData.technicalSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-[#33D6C4] text-white hover:bg-[#2bc0b0] cursor-pointer flex items-center gap-1 px-3 py-1"
                        onClick={() => toggleTechnicalSkill(skill)}
                      >
                        {skill}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                </div>

                {/* Add Skills Section */}
                <div className="mt-4 border rounded-lg p-4 space-y-3">
                  <div className="text-sm font-medium">Add Skills</div>

                  {/* Custom Skill Input */}
                  {/* <div className="flex gap-2">
                    <Input
                      placeholder="Type a skill"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          customSkill.trim() &&
                          !formData.technicalSkills.includes(customSkill.trim())
                        ) {
                          toggleTechnicalSkill(customSkill.trim());
                          setCustomSkill("");
                        }
                      }}
                      className="px-4 py-2 bg-[#33D6C4] text-white rounded-lg hover:bg-[#2bc0b0] transition"
                    >
                      Add
                    </button>
                  </div> */}

                  {/* Predefined Skills */}
                  <div className="flex flex-wrap gap-2">
                    {technicalSkillOptions
                      .filter(
                        (skill) => !formData.technicalSkills.includes(skill)
                      )
                      .map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="cursor-pointer hover:bg-[#EDEFF2]"
                          onClick={() => toggleTechnicalSkill(skill)}
                        >
                          + {skill}
                        </Badge>
                      ))}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Tip: Click a skill to add.
                  </p>
                </div>
              </div>
            </div>

            {/* Soft Skills Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-[#33D6C4]" />
                Soft Skills*
              </h3>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Select all the soft skills that apply to you
                </Label>

                {/* Selected Skills */}
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(formData.softSkills) &&
                    formData.softSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-[#FF6B4A] text-white hover:bg-[#e85d3d] cursor-pointer flex items-center gap-1 px-3 py-1"
                        onClick={() => toggleSoftSkill(skill)}
                      >
                        {skill}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                </div>

                {/* Add Skills Section */}
                <div className="mt-4 border rounded-lg p-4 space-y-3">
                  <div className="text-sm font-medium">Add Skills</div>

                  {/* Custom Skill Input */}
                  {/* <div className="flex gap-2">
                    <Input
                      placeholder="Type a soft skill"
                      value={customSoftSkill}
                      onChange={(e) => setCustomSoftSkill(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          customSoftSkill.trim() &&
                          !formData.softSkills.includes(customSoftSkill.trim())
                        ) {
                          toggleSoftSkill(customSoftSkill.trim());
                          setCustomSoftSkill("");
                        }
                      }}
                      className="px-4 py-2 bg-[#FF6B4A] text-white rounded-lg hover:bg-[#e85d3d] transition"
                    >
                      Add
                    </button>
                  </div> */}

                  {/* Predefined Skills */}
                  <div className="flex flex-wrap gap-2">
                    {softSkillOptions
                      .filter((skill) => !formData.softSkills.includes(skill))
                      .map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="cursor-pointer hover:bg-[#EDEFF2]"
                          onClick={() => toggleSoftSkill(skill)}
                        >
                          + {skill}
                        </Badge>
                      ))}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Tip: Click a skill to add.
                  </p>
                </div>
              </div>
            </div>

            {/* Languages Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center">
                  <Globe className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                  Languages
                </h3>
                <Button
                  onClick={addLanguage}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Language
                </Button>
              </div>

              {formData.languages.map((lang, index) => (
                <div key={index} className="flex items-end gap-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`language-${index}`}>Language</Label>
                    <Input
                      id={`language-${index}`}
                      value={lang.language}
                      onChange={(e) =>
                        updateLanguage(index, "language", e.target.value)
                      }
                      placeholder="e.g., English"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`proficiency-${index}`}>Proficiency</Label>
                    <Select
                      value={lang.proficiency}
                      onValueChange={(value) =>
                        updateLanguage(index, "proficiency", value)
                      }
                    >
                      <SelectTrigger id={`proficiency-${index}`}>
                        <SelectValue placeholder="Select proficiency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Fluent">Fluent</SelectItem>
                        <SelectItem value="Native">Native</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLanguage(index)}
                    className="mb-2"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="bg-[#F8F9FA] dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 text-[#FF5E3A] dark:text-yellow-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    AI-Powered Skill Matching
                  </h4>
                  <p className="text-sm text-muted-foreground dark:text-gray-300">
                    Our AI will analyze your skills to match you with the most
                    relevant job opportunities. The more skills you add, the
                    better your matches will be.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // Preferences
        return (
          <div className="space-y-8">
            {/* Job Types Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <BriefcaseIcon className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                Job Types
              </h3>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Select all job types you're interested in
                </Label>
                <div className="flex flex-wrap gap-2">
                  {jobTypes.map((jobType) => (
                    <Badge
                      key={jobType}
                      variant={
                        formData.jobTypes.includes(jobType)
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        formData.jobTypes.includes(jobType)
                          ? "bg-[#33D6C4] text-white hover:bg-[#2bc0b0] cursor-pointer"
                          : "cursor-pointer hover:bg-[#EDEFF2]"
                      }
                      onClick={() => toggleJobType(jobType)}
                    >
                      {formData.jobTypes.includes(jobType)
                        ? `${jobType} ✓`
                        : jobType}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Salary Expectations */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                {/* <DollarSign className="mr-2 h-5 w-5 text-[#33D6C4]" /> */}
                ₹Salary Expectations
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Annual Salary (INR)</Label>
                  <span className="font-medium">
                    ₹
                    {Number.parseInt(
                      formData.salaryExpectation || 0
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
                <Slider
                  value={[Number.parseInt(formData.salaryExpectation || 0)]}
                  min={30000}
                  max={1050000}
                  step={5000}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      salaryExpectation: value[0].toString(),
                    })
                  }
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹30,000</span>
                  <span>₹10,50,000+</span>
                </div>
              </div>
            </div>

            {/* Location Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <MapPinned className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                Location Preferences
              </h3>

              <div className="space-y-4">
                {/* Willing to relocate switch */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="relocate"
                    checked={formData.willingToRelocate}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        willingToRelocate: checked,
                      })
                    }
                  />
                  <Label htmlFor="relocate">Willing to relocate</Label>
                </div>

                {/* Preferred locations */}
                <div className="space-y-2">
                  <Label>Preferred Locations</Label>

                  {formData.preferredLocations.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.preferredLocations.map((location, index) => (
                        <Badge
                          key={`${location}-${index}`}
                          variant="secondary"
                          className="bg-[#FF6B4A] text-white hover:bg-[#e85d3d] cursor-pointer flex items-center gap-1 px-3 py-1"
                        >
                          {location}
                          <X
                            className="h-3 w-3 ml-1"
                            onClick={() => removeLocation(location)}
                          />
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No locations added yet.
                    </p>
                  )}

                  {/* Input + Add button */}
                  <div className="flex gap-2">
                    <Input
                      id="new-location"
                      placeholder="Add a location (e.g., Bengaluru, Karnataka, India)"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const value = e.currentTarget.value.trim();
                          if (value) {
                            addLocation(value);
                            e.currentTarget.value = "";
                          } else {
                            toast({
                              title: "Invalid Input",
                              description: "Please enter a valid location.",
                              variant: "destructive",
                            });
                          }
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        const input = document.getElementById("new-location");
                        const value = input.value.trim();
                        if (value) {
                          addLocation(value);
                          input.value = "";
                        } else {
                          toast({
                            title: "Invalid Input",
                            description: "Please enter a valid location.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Environment */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Building className="mr-2 h-5 w-5 text-[#33D6C4]" />
                Work Environment
              </h3>
              <div className="space-y-2">
                <Label>Preferred Work Environment</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {workEnvironments.map((env) => (
                    <Button
                      key={env}
                      type="button"
                      variant={
                        formData.workEnvironment === env ? "default" : "outline"
                      }
                      className={
                        formData.workEnvironment === env
                          ? "bg-[#FF5E3A] hover:bg-[#e04c2b]"
                          : ""
                      }
                      onClick={() =>
                        setFormData({ ...formData, workEnvironment: env })
                      }
                    >
                      {env}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Industry Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                Industry Preferences
              </h3>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Select industries you're interested in working in
                </Label>
                <div className="flex flex-wrap gap-2">
                  {industries.map((industry) => (
                    <Badge
                      key={industry}
                      variant={
                        formData.preferredIndustries.includes(industry)
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        formData.preferredIndustries.includes(industry)
                          ? "bg-[#33D6C4] text-white hover:bg-[#2bc0b0] cursor-pointer"
                          : "cursor-pointer hover:bg-[#EDEFF2]"
                      }
                      onClick={() => toggleIndustry(industry)}
                    >
                      {formData.preferredIndustries.includes(industry)
                        ? `${industry} ✓`
                        : industry}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Company Size */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Users className="mr-2 h-5 w-5 text-[#33D6C4]" />
                Company Size
              </h3>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Select preferred company sizes
                </Label>
                <div className="flex flex-wrap gap-2">
                  {companySizes.map((size) => (
                    <Badge
                      key={size}
                      variant={
                        formData.preferredCompanySize.includes(size)
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        formData.preferredCompanySize.includes(size)
                          ? "bg-[#FF6B4A] text-white hover:bg-[#e85d3d] cursor-pointer"
                          : "cursor-pointer hover:bg-[#EDEFF2]"
                      }
                      onClick={() => toggleCompanySize(size)}
                    >
                      {formData.preferredCompanySize.includes(size)
                        ? `${size} ✓`
                        : size}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Career Goals */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Target className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                Career Goals
              </h3>
              <div className="space-y-2">
                <Label htmlFor="career-goals">
                  Describe your career goals and aspirations
                </Label>
                <Textarea
                  id="career-goals"
                  value={formData.careerGoals}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      careerGoals: e.target.value,
                    })
                  }
                  placeholder="What are your short and long-term career goals? What kind of role are you looking for next?"
                  rows={4}
                />
              </div>
            </div>

            <div className="bg-[#F8F9FA] dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 text-[#FF5E3A] dark:text-yellow-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    AI-Powered Job Matching
                  </h4>
                  <p className="text-sm text-muted-foreground dark:text-gray-300">
                    Your preferences help our AI match you with jobs that align
                    with your career goals and work style. Be specific about
                    what matters most to you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">
              Step {currentStep} Content
            </h3>
            <p className="text-muted-foreground">
              This step is under construction. Continue to see the complete
              flow.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and career details
        </p>
      </div>
      {hasEvaluationResult && (
        <div className="flex justify-center mt-6">
          <Button
            className="bg-[#FF5E3A] hover:bg-[#e8552e] text-white rounded-md px-8 py-3 text-lg font-semibold"
            onClick={() => setShowReportOptions(true)}
          >
            Reports
          </Button>
        </div>
      )}

      {/* Report Options Modal/Dropdown */}
      {showReportOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Choose Report Type
              </h3>
              <p className="text-gray-600 text-sm">
                Select the evaluation report you want to view
              </p>
            </div>

            <div className="space-y-4">
              {/* Self Evaluation Report Button */}
              <Button
                className="w-full bg-[#FF5E3A] hover:bg-[#e8552e] text-white rounded-md py-3 text-base font-medium"
                onClick={handleSelfEvaluationReport}
              >
                Self Evaluation Report
              </Button>

              {/* Actual Evaluation Report Button */}
              {evaluationAvailable && (
                <Button
                  className="w-full text-white rounded-md py-3 text-base font-medium"
                  style={{ backgroundColor: "#2ED6C4", border: "none" }}
                  onClick={handleActualEvaluationReport}
                >
                  Actual Evaluation Report
                </Button>
              )}
            </div>

            {/* Close button */}
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={() => setShowReportOptions(false)}
                className="px-6 py-2 text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* {hasEvaluationResult && (
        <div className="flex justify-center mt-6">
          <Button
            className="bg-[#FF5E3A] hover:bg-[#e8552e] text-white rounded-md"
            onClick={() => setShowDetailedRecommendations(true)}
          >
            Self Evaluation Results
          </Button>
        </div>
      )}
      {evaluationAvailable && (
        <Button
          onClick={handleViewEvaluation}
          className="bg-[#FF5E3A] hover:bg-[#e8552e] text-white rounded-md"
          style={{ backgroundColor: "#28564F", border: "none" }}
        >
          Actual Evaluation Result
        </Button>
      )}
      {evaluationAvailable && hasEvaluationResult && (
        <Button
          onClick={handleViewUpdated}
          className="bg-[#FF5E3A] hover:bg-[#e8552e] text-white rounded-md"
          style={{ backgroundColor: "#112233", border: "none" }}
        >
          Updated Result
        </Button>
      )} */}

      {/* Step Navigation */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4 overflow-x-auto pb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center min-w-0">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                    ${
                      currentStep >= step.id
                        ? "bg-[#FF5E3A] text-white"
                        : "bg-[#EDEFF2] text-[#6C757D]"
                    }
                  `}
                >
                  {step.id}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    w-12 h-0.5 mx-4 mt-5
                    ${currentStep > step.id ? "bg-[#FF5E3A]" : "bg-[#EDEFF2]"}
                  `}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>
            {steps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent>{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="border-[#EDEFF2] text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#2A2D34]"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSaveDraft(false)}
            className="border-[#EDEFF2] text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#2A2D34]"
          >
            Save Draft
          </Button>
          {currentStep === steps.length ? (
            hasEvaluationResult ? (
              <Button
                variant="outline"
                className="border-[#FF5E3A] text-[#FF5E3A] hover:bg-[#FF5E3A] hover:text-white rounded-md"
                onClick={handleReanalyzeButtonClick}
                disabled={isLoading}
              >
                {isLoading
                  ? "Analyzing..."
                  : canReanalyze
                  ? "Re-analyze Profile"
                  : `Re-analyze (${daysUntilReanalysis} days)`}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-[#FF5E3A] hover:bg-[#e04c2b]"
              >
                Complete Profile
              </Button>
            )
          ) : (
            <Button
              onClick={handleNext}
              className="bg-[#FF5E3A] hover:bg-[#e04c2b]"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
