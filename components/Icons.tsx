import React from "react";

interface GoogleIconProps {
  name: string;
  className?: string;
}

export function GoogleIcon({ name, className = "" }: GoogleIconProps) {
  return (
    <span
      className={`material-symbols-rounded select-none inline-flex items-center justify-center shrink-0 leading-none ${className}`}
      aria-hidden="true"
      translate="no"
    >
      {name}
    </span>
  );
}

// Google Material Symbols mapping
export function DiceIcon({ className = "text-xl" }: { className?: string }) {
  return <GoogleIcon name="casino" className={className} />;
}

export function PlusIcon({ className = "text-xl" }: { className?: string }) {
  return <GoogleIcon name="add" className={className} />;
}

export function TrashIcon({
  className = "text-sm small",
}: {
  className?: string;
}) {
  return <GoogleIcon name="delete" className={className} />;
}

export function EditIcon({
  className = "text-sm small",
}: {
  className?: string;
}) {
  return <GoogleIcon name="edit" className={className} />;
}

export function SearchIcon({ className = "text-lg" }: { className?: string }) {
  return <GoogleIcon name="search" className={className} />;
}

export function CheckIcon({ className = "text-base" }: { className?: string }) {
  return <GoogleIcon name="check" className={className} />;
}

export function CloseIcon({ className = "text-lg" }: { className?: string }) {
  return <GoogleIcon name="close" className={className} />;
}

export function LightModeIcon({
  className = "text-xl",
}: {
  className?: string;
}) {
  return <GoogleIcon name="light_mode" className={className} />;
}

export function DarkModeIcon({
  className = "text-xl",
}: {
  className?: string;
}) {
  return <GoogleIcon name="dark_mode" className={className} />;
}

export function RefreshIcon({ className = "text-xl" }: { className?: string }) {
  return <GoogleIcon name="refresh" className={className} />;
}

export function AlertCircleIcon({
  className = "text-lg",
}: {
  className?: string;
}) {
  return <GoogleIcon name="error" className={className} />;
}

export function UploadCloudIcon({
  className = "text-2xl",
}: {
  className?: string;
}) {
  return <GoogleIcon name="cloud_upload" className={className} />;
}

export function ClockIcon({ className = "text-base" }: { className?: string }) {
  return <GoogleIcon name="schedule" className={className} />;
}

export function ShieldIcon({
  className = "text-base",
}: {
  className?: string;
}) {
  return <GoogleIcon name="shield" className={className} />;
}

export function SparklesIcon({
  className = "text-base",
}: {
  className?: string;
}) {
  return <GoogleIcon name="auto_awesome" className={className} />;
}

export function ShuffleIcon({
  className = "text-base",
}: {
  className?: string;
}) {
  return <GoogleIcon name="shuffle" className={className} />;
}

export function RestaurantIcon({
  className = "text-2xl",
}: {
  className?: string;
}) {
  return <GoogleIcon name="restaurant" className={className} />;
}
