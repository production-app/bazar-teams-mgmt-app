"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export function ConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
}: ConfirmModalProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="flex flex-col items-center justify-center  max-w-md">
          <AlertDialogHeader>
            <img
              src="/img/user-plus.png"
              alt="confirmation icon"
              className="h-20 w-20 mx-auto"
            />
            <AlertDialogTitle className="text-xl flex mx-auto items-center font-semibold">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-muted-foreground pt-2">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="bg-transparent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="bg-primary hover:bg-primary/90">
              Yes, {title.includes("Create") ? "Create" : "Update"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
