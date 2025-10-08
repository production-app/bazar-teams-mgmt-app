"use client";

import { AlertTriangle } from "lucide-react";
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

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  teamName: string;
}

export function DeleteConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  teamName,
}: DeleteConfirmModalProps) {
  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="items-center text-center">
          <div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10"
            aria-hidden="true">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <AlertDialogTitle className="text-xl font-semibold">
            Delete Team
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-muted-foreground pt-2">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{teamName}</span>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center gap-2">
          <AlertDialogCancel
            onClick={handleCancel}
            className="bg-transparent hover:bg-muted w-full sm:w-auto">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive hover:bg-destructive/90  w-full sm:w-auto text-stone-50">
            Yes, Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
