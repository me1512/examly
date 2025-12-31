// app/(dashboard)/courses/create/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Save,
  Eye,
  BookOpen,
  Clock,
  DollarSign,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useCreateCourse } from "@/hooks/useCourseQueries";
import { CourseCategory, CourseLevel } from "@/types/course";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "react-hot-toast";

const createCourseSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title too long"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  category: z.nativeEnum(CourseCategory),
  level: z.nativeEnum(CourseLevel),
  price: z.number().min(0, "Price cannot be negative"),
  duration: z.number().min(0.5, "Duration must be at least 30 minutes"),
  prerequisites: z.array(z.string()).optional(),
  learningOutcomes: z
    .array(z.string())
    .min(3, "At least 3 learning outcomes required"),
  tags: z.array(z.string()).optional(),
});

type CreateCourseFormData = z.infer<typeof createCourseSchema>;

const CreateCoursePage = () => {
  const router = useRouter();
  const createCourseMutation = useCreateCourse();

  const [currentStep, setCurrentStep] = useState(1);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    getValues,
    control,
    trigger,
  } = useForm<CreateCourseFormData>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      prerequisites: [],
      learningOutcomes: [""],
      tags: [],
      price: 0,
      duration: 1,
    },
    mode: "onChange",
  });

  const formValues = watch();

  const steps = [
    {
      id: 1,
      title: "Basic Information",
      description: "Course title, description, and category",
    },
    {
      id: 2,
      title: "Course Details",
      description: "Pricing, duration, and level",
    },
    {
      id: 3,
      title: "Learning Outcomes",
      description: "What students will learn",
    },
    {
      id: 4,
      title: "Prerequisites & Tags",
      description: "Requirements and keywords",
    },
    { id: 5, title: "Preview & Submit", description: "Review and publish" },
  ];

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addLearningOutcome = () => {
    const outcomes = getValues("learningOutcomes") || [];
    setValue("learningOutcomes", [...outcomes, ""]);
  };

  const removeLearningOutcome = (index: number) => {
    const outcomes = getValues("learningOutcomes") || [];
    if (outcomes.length > 1) {
      setValue(
        "learningOutcomes",
        outcomes.filter((_, i) => i !== index),
      );
    }
  };

  const addPrerequisite = () => {
    const prerequisites = getValues("prerequisites") || [];
    setValue("prerequisites", [...prerequisites, ""]);
  };

  const removePrerequisite = (index: number) => {
    const prerequisites = getValues("prerequisites") || [];
    setValue(
      "prerequisites",
      prerequisites.filter((_, i) => i !== index),
    );
  };

  const addTag = () => {
    const tags = getValues("tags") || [];
    setValue("tags", [...tags, ""]);
  };

  const removeTag = (index: number) => {
    const tags = getValues("tags") || [];
    setValue(
      "tags",
      tags.filter((_, i) => i !== index),
    );
  };

  const onSubmit = async (data: CreateCourseFormData) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("level", data.level);
      formData.append("price", data.price.toString());
      formData.append("duration", data.duration.toString());
      formData.append(
        "learningOutcomes",
        JSON.stringify(data.learningOutcomes),
      );

      if (data.prerequisites) {
        formData.append("prerequisites", JSON.stringify(data.prerequisites));
      }

      if (data.tags) {
        formData.append("tags", JSON.stringify(data.tags));
      }

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      const result = await createCourseMutation.mutateAsync(formData);

      if (result) {
        toast.success("Course created successfully!");
        router.push(`/courses/${result.id}`);
      }
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course. Please try again.");
    }
  };

  const canProceed = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        await trigger(["title", "description", "category"]);
        return !errors.title && !errors.description && !errors.category;
      case 2:
        await trigger(["level", "price", "duration"]);
        return !errors.level && !errors.price && !errors.duration;
      case 3:
        await trigger("learningOutcomes");
        return !errors.learningOutcomes;
      default:
        return true;
    }
  };

  const handleNextStep = async () => {
    if (await canProceed(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="thumbnail">Course Thumbnail</Label>
              <div className="mt-2">
                {thumbnailPreview ? (
                  <div className="relative">
                    <img
                      src={thumbnailPreview}
                      alt="Course thumbnail"
                      className="h-48 w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnailFile(null);
                        setThumbnailPreview("");
                      }}
                      className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
                    <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <p className="mb-2 text-gray-600 dark:text-gray-400">
                      Upload course thumbnail
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                      id="thumbnail"
                    />
                    <Label htmlFor="thumbnail">
                      <Button
                        type="button"
                        variant="secondary"
                        className="cursor-pointer"
                      >
                        Choose File
                      </Button>
                    </Label>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter course title"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Course Description *</Label>
              <textarea
                id="description"
                {...register("description")}
                placeholder="Describe what this course is about..."
                rows={5}
                className={cn(
                  "w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600",
                  "bg-white text-gray-900 dark:bg-gray-700 dark:text-white",
                  "focus:ring-2 focus:ring-blue-500 focus:outline-none",
                  errors.description ? "border-red-500" : "",
                )}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Course Category *</Label>
              <Select
                id="category"
                value={formValues.category || ""}
                onValueChange={(value) =>
                  setValue("category", value as CourseCategory)
                }
                className={errors.category ? "border-red-500" : ""}
              >
                <option value="">Select a category</option>
                {Object.values(CourseCategory).map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </Select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="level">Difficulty Level *</Label>
              <Select
                id="level"
                value={formValues.level || ""}
                onValueChange={(value) =>
                  setValue("level", value as CourseLevel)
                }
                className={errors.level ? "border-red-500" : ""}
              >
                <option value="">Select difficulty level</option>
                {Object.values(CourseLevel).map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </Select>
              {errors.level && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.level.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="price">Course Price ($) *</Label>
              <div className="relative">
                <DollarSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                  className={cn("pl-10", errors.price ? "border-red-500" : "")}
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Set to $0 for a free course
              </p>
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="duration">Estimated Duration (hours) *</Label>
              <div className="relative">
                <Clock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  id="duration"
                  type="number"
                  min="0.5"
                  step="0.5"
                  {...register("duration", { valueAsNumber: true })}
                  placeholder="1.0"
                  className={cn(
                    "pl-10",
                    errors.duration ? "border-red-500" : "",
                  )}
                />
              </div>
              {errors.duration && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.duration.message}
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>Learning Outcomes *</Label>
              <p className="mb-4 text-sm text-gray-500">
                What will students be able to do after completing this course?
              </p>

              {(formValues.learningOutcomes || []).map((outcome, index) => (
                <div key={index} className="mb-3 flex items-center space-x-2">
                  <Input
                    value={outcome}
                    onChange={(e) => {
                      const outcomes = [...(formValues.learningOutcomes || [])];
                      outcomes[index] = e.target.value;
                      setValue("learningOutcomes", outcomes);
                    }}
                    placeholder={`Learning outcome ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => removeLearningOutcome(index)}
                    disabled={(formValues.learningOutcomes?.length || 0) <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="secondary"
                onClick={addLearningOutcome}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Learning Outcome</span>
              </Button>

              {errors.learningOutcomes && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.learningOutcomes.message}
                </p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label>Prerequisites (Optional)</Label>
              <p className="mb-4 text-sm text-gray-500">
                What should students know before taking this course?
              </p>

              {(formValues.prerequisites || []).map((prerequisite, index) => (
                <div key={index} className="mb-3 flex items-center space-x-2">
                  <Input
                    value={prerequisite}
                    onChange={(e) => {
                      const prerequisites = [
                        ...(formValues.prerequisites || []),
                      ];
                      prerequisites[index] = e.target.value;
                      setValue("prerequisites", prerequisites);
                    }}
                    placeholder={`Prerequisite ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => removePrerequisite(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="secondary"
                onClick={addPrerequisite}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Prerequisite</span>
              </Button>
            </div>

            <div>
              <Label>Tags (Optional)</Label>
              <p className="mb-4 text-sm text-gray-500">
                Add keywords to help students find your course
              </p>

              {(formValues.tags || []).map((tag, index) => (
                <div key={index} className="mb-3 flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Tag className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input
                      value={tag}
                      onChange={(e) => {
                        const tags = [...(formValues.tags || [])];
                        tags[index] = e.target.value;
                        setValue("tags", tags);
                      }}
                      placeholder={`Tag ${index + 1}`}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => removeTag(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="secondary"
                onClick={addTag}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Tag</span>
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Course Preview
              </h3>

              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700">
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="Course thumbnail"
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 w-full items-center justify-center bg-gray-200 dark:bg-gray-600">
                    <BookOpen className="h-16 w-16 text-gray-400" />
                  </div>
                )}

                <div className="p-6">
                  <div className="mb-3 flex items-start justify-between">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {formValues.title || "Course Title"}
                    </h4>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {formValues.price === 0 ? "Free" : `$${formValues.price}`}
                    </span>
                  </div>

                  <p className="mb-4 text-gray-600 dark:text-gray-300">
                    {formValues.description ||
                      "Course description will appear here..."}
                  </p>

                  <div className="mb-4 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {formValues.duration || 0}h
                    </span>
                    <span className="capitalize">
                      {formValues.level || "Level"}
                    </span>
                    <span className="capitalize">
                      {formValues.category || "Category"}
                    </span>
                  </div>

                  {formValues.learningOutcomes &&
                    formValues.learningOutcomes.filter((lo) => lo.trim())
                      .length > 0 && (
                      <div className="mb-4">
                        <h5 className="mb-2 font-semibold text-gray-900 dark:text-white">
                          What you'll learn:
                        </h5>
                        <ul className="list-inside list-disc space-y-1">
                          {formValues.learningOutcomes
                            .filter((lo) => lo.trim())
                            .slice(0, 3)
                            .map((outcome, index) => (
                              <li
                                key={index}
                                className="text-sm text-gray-600 dark:text-gray-300"
                              >
                                {outcome}
                              </li>
                            ))}
                        </ul>
                        {formValues.learningOutcomes.filter((lo) => lo.trim())
                          .length > 3 && (
                          <p className="mt-1 text-sm text-gray-500">
                            +
                            {formValues.learningOutcomes.filter((lo) =>
                              lo.trim(),
                            ).length - 3}{" "}
                            more outcomes
                          </p>
                        )}
                      </div>
                    )}

                  {formValues.tags &&
                    formValues.tags.filter((t) => t.trim()).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formValues.tags
                          .filter((t) => t.trim())
                          .map((tag, index) => (
                            <span
                              key={index}
                              className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/courses"
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Courses
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create New Course
        </h1>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Steps Navigation */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold">Course Setup</h2>
            <nav className="space-y-4">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={cn(
                    "w-full rounded-md p-3 text-left transition-colors",
                    currentStep === step.id
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700",
                  )}
                >
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "mr-3 flex h-8 w-8 items-center justify-center rounded-full",
                        currentStep === step.id
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
                      )}
                    >
                      {step.id}
                    </div>
                    <div>
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Form */}
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
          >
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>

            <div className="mt-8 flex justify-between border-t pt-6">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handlePrevStep}
                  className="flex items-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
              ) : (
                <div></div>
              )}

              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="ml-auto"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={createCourseMutation.isLoading || !isValid}
                  className="ml-auto"
                >
                  {createCourseMutation.isLoading ? (
                    <LoadingSpinner className="mr-2" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Create Course
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;
