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
import type { Team } from "@/lib/types";

interface EditTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team;
}

export function EditTeamModal({
  open,
  onOpenChange,
  team,
}: EditTeamModalProps) {
  const { updateTeam } = useTeamsStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [pendingData, setPendingData] = useState<TeamFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
    reset,
    setValue,
    watch,
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: team.name,
      code: team.code,
      description: team.description,
      email: team.email,
      entity: team.entity,
      managerName: team.manager.name,
    },
  });

  useEffect(() => {
    if (open) {
      console.log("[v0] Edit modal opened for team:", team.name);
      reset({
        name: team.name,
        code: team.code,
        description: team.description,
        email: team.email,
        entity: team.entity,
        managerName: team.manager.name,
      });
      setPendingData(null);
      setShowConfirm(false);
      setShowNotification(false);
    }
  }, [open, team, reset]);

  const selectedEntity = watch("entity");
  const nameValue = watch("name");
  const codeValue = watch("code");

  // Check if fields are valid (no errors and have value)
  const isNameValid = !errors.name && nameValue && nameValue.length > 0;
  const isCodeValid = !errors.code && codeValue && codeValue.length > 0;

  const onSubmitForm = (data: TeamFormData) => {
    console.log("[v0] Edit form submitted, showing confirm modal");
    setPendingData(data);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!pendingData) return;

    console.log("[v0] Edit confirmed, updating team...", team.id);
    try {
      // Generate initials from manager name
      const initials = pendingData.managerName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      await updateTeam(team.id, {
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

      console.log("[v0] Team updated successfully, showing notification");
      setShowConfirm(false);
      setShowNotification(true);
    } catch (error) {
      console.error("[v0] Error updating team:", error);
      setShowConfirm(false);
    }
  };

  const handleNotificationClose = (open: boolean) => {
    console.log("[v0] Edit notification closing, open:", open);
    setShowNotification(open);
    if (!open) {
      setPendingData(null);
      reset();
      onOpenChange(false);
    }
  };

  const handleSheetOpenChange = (open: boolean) => {
    console.log(
      "[v0] Sheet open change requested:",
      open,
      "showConfirm:",
      showConfirm,
      "showNotification:",
      showNotification
    );
    // Don't allow closing if confirm or notification modal is open
    if (!open && (showConfirm || showNotification)) {
      console.log("[v0] Preventing sheet close - modal is open");
      return;
    }

    if (!open) {
      console.log("[v0] Edit modal closing");
      reset();
      setPendingData(null);
      setShowConfirm(false);
      setShowNotification(false);
    }
    onOpenChange(open);
  };

  const handleClose = () => {
    console.log("[v0] Close button clicked");
    // Don't allow closing if confirm or notification modal is open
    if (showConfirm || showNotification) {
      console.log("[v0] Preventing close - modal is open");
      return;
    }

    reset();
    setPendingData(null);
    setShowConfirm(false);
    setShowNotification(false);
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
      <Sheet open={open} onOpenChange={handleSheetOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[540px] p-0 overflow-y-auto"
          aria-describedby="edit-team-description">
          <SheetHeader className="px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-semibold">
                Edit Team
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
            aria-label="Edit team form">
            <p id="edit-team-description" className="sr-only">
              Edit the team information below. All fields marked with an
              asterisk are required.
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
                Team Email Address <span className="text-destructive">*</span>
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
              <div className="text-xs text-muted-foreground">
                Everyone in this Team receives an email whenever a message is
                sent to this email address.
              </div>
            </div>

            {/* Manager Name */}
            <div className="space-y-2">
              <Label htmlFor="managerName" className="text-sm font-medium">
                Team Manager <span className="text-destructive">*</span>
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
              className="flex gap-3 pt-4 border-t border-border sticky bottom-0 bg-background pb-2"
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
                {isSubmitting ? "Updating..." : "Update Team"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <ConfirmModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleConfirm}
        title="Update Team"
        description="Are you sure you want to update this team?"
      />

      <NotificationModal
        open={showNotification}
        onOpenChange={handleNotificationClose}
        title="Team Updated"
        description="The team has been updated successfully."
      />
    </>
  );
}
