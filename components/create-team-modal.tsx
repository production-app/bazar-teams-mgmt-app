"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, CircleCheck } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeamsStore } from "@/lib/store/teams-store";
import { teamFormSchema, type TeamFormData } from "@/lib/schemas/team-schema";
import { ConfirmModal } from "@/components/confirm-modal";
import { NotificationModal } from "@/components/notification-modal";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CreateTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTeamModal({ open, onOpenChange }: CreateTeamModalProps) {
  const { createTeam } = useTeamsStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [pendingData, setPendingData] = useState<TeamFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      code: "",
      description: "",
      email: "",
      entity: "",
      managerName: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: "",
        code: "",
        description: "",
        email: "",
        entity: "",
        managerName: "",
      });
      setPendingData(null);
    }
  }, [open, reset]);

  const selectedEntity = watch("entity");
  const nameValue = watch("name");
  const codeValue = watch("code");

  const isNameValid = !errors.name && nameValue && nameValue.length > 0;
  const isCodeValid = !errors.code && codeValue && codeValue.length > 0;

  const onSubmitForm = (data: TeamFormData) => {
    setPendingData(data);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!pendingData) return;

    try {
      // Generate initials from manager name
      const initials = pendingData.managerName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      await createTeam({
        name: pendingData.name,
        code: pendingData.code,
        description: pendingData.description,
        email: pendingData.email,
        entity: pendingData.entity,
        manager: {
          name: pendingData.managerName,
          initials,
        },
      });

      setShowConfirm(false);
      setShowNotification(true);
    } catch (error) {
      console.error("Error creating team:", error);
      setShowConfirm(false);
    }
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
    setPendingData(null);
    reset({
      name: "",
      code: "",
      description: "",
      email: "",
      entity: "",
      managerName: "",
    });
    onOpenChange(false);
  };

  const handleClose = () => {
    reset({
      name: "",
      code: "",
      description: "",
      email: "",
      entity: "",
      managerName: "",
    });
    setPendingData(null);
    onOpenChange(false);
  };

  const entities = [
    "Access Bank Nigeria",
    "Access Bank Ghana",
    "Access Bank Angola",
    "Access Bank Zambia",
  ];

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[540px] p-0 overflow-y-auto"
          aria-describedby="create-team-description">
          <SheetHeader className="px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-semibold">
                New Team
              </SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 rounded-full"
                aria-label="Close dialog">
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </SheetHeader>

          <form
            onSubmit={handleSubmit(onSubmitForm)}
            className="px-6 py-6 space-y-6"
            aria-label="Create team form">
            <p id="create-team-description" className="sr-only">
              Fill out the form below to create a new team. All fields marked
              with an asterisk are required.
            </p>

            {/* Entity */}
            <div className="space-y-2">
              <Label htmlFor="entity" className="text-sm font-medium">
                Entity <span className="text-destructive">*</span>
              </Label>
              <Select
                value={selectedEntity}
                onValueChange={(value) =>
                  setValue("entity", value, { shouldValidate: true })
                }>
                <SelectTrigger
                  id="entity"
                  className={`
                      w-full rounded-md border border-gray-300 p-2 text-sm transition-all
                      ${
                        errors.entity
                          ? "border-destructive focus-visible:ring-destructive" // Styles when there is an error
                          : "" // Default styles when no error
                      }
                    `}
                  aria-required="true"
                  aria-invalid={errors.entity ? "true" : "false"}
                  aria-describedby={errors.entity ? "entity-error" : undefined}>
                  <SelectValue placeholder="Select an entity" />
                </SelectTrigger>
                <SelectContent>
                  {entities.map((entity) => (
                    <SelectItem key={entity} value={entity}>
                      {entity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.entity && (
                <p
                  id="entity-error"
                  className="text-sm text-destructive"
                  role="alert">
                  {errors.entity.message}
                </p>
              )}
            </div>

            {/* Team Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Team Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  placeholder="Enter team name"
                  {...register("name")}
                  className={
                    errors.name
                      ? "border-destructive focus-visible:ring-destructive pr-10"
                      : "pr-10"
                  }
                  aria-required="true"
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {isNameValid && (
                  <CircleCheck
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-lime-500"
                    aria-label="Valid team name"
                  />
                )}
              </div>
              {errors.name && (
                <p
                  id="name-error"
                  className="text-sm text-destructive"
                  role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Team Code */}
            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm font-medium">
                Team Code <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="code"
                  placeholder="e.g., TECH-001"
                  {...register("code")}
                  className={
                    errors.code
                      ? "border-destructive focus-visible:ring-destructive pr-10"
                      : "pr-10"
                  }
                  onChange={(e) => {
                    // Auto-uppercase the code
                    e.target.value = e.target.value.toUpperCase();
                    register("code").onChange(e);
                  }}
                  aria-required="true"
                  aria-invalid={errors.code ? "true" : "false"}
                  aria-describedby={errors.code ? "code-error" : "code-help"}
                />
                {isCodeValid && (
                  <CircleCheck
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-lime-500"
                    aria-label="Valid team code"
                  />
                )}
              </div>
              {errors.code && (
                <p
                  id="code-error"
                  className="text-sm text-destructive"
                  role="alert">
                  {errors.code.message}
                </p>
              )}
              <p id="code-help" className="text-xs text-muted-foreground">
                Use uppercase letters, numbers, and hyphens only
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Enter team description"
                rows={4}
                {...register("description")}
                className={
                  errors.description
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
                aria-required="true"
                aria-invalid={errors.description ? "true" : "false"}
                aria-describedby={
                  errors.description ? "description-error" : undefined
                }
              />
              {errors.description && (
                <p
                  id="description-error"
                  className="text-sm text-destructive"
                  role="alert">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Team Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Team Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="team@example.com"
                {...register("email")}
                className={
                  errors.email
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
                aria-required="true"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="text-sm text-destructive"
                  role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Manager Name */}
            <div className="space-y-2">
              <Label htmlFor="managerName" className="text-sm font-medium">
                Manager Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="managerName"
                placeholder="Enter manager's full name"
                {...register("managerName")}
                className={
                  errors.managerName
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
                aria-required="true"
                aria-invalid={errors.managerName ? "true" : "false"}
                aria-describedby={
                  errors.managerName ? "managerName-error" : undefined
                }
              />
              {errors.managerName && (
                <p
                  id="managerName-error"
                  className="text-sm text-destructive"
                  role="alert">
                  {errors.managerName.message}
                </p>
              )}
            </div>

            {/* Form Actions */}
            <div
              className="flex gap-3 pt-4 border-t border-border sticky bottom-0 bg-background pb-2 mt-4"
              role="group"
              aria-label="Form actions">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 bg-transparent"
                disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
                aria-busy={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Team"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <ConfirmModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleConfirm}
        title="Create Team"
        description="Are you sure you want to create this team?"
      />

      <NotificationModal
        open={showNotification}
        onOpenChange={handleNotificationClose}
        title="Team Created Successfully"
        description="The team has been created successfully."
      />
    </>
  );
}
