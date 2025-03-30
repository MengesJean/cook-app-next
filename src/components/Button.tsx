import Link from "next/link";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  href?: string;
};

const variantStyles = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 border border-transparent",
  secondary:
    "bg-gray-200 text-gray-800 hover:bg-gray-300 border border-transparent",
  outline:
    "bg-transparent border border-current text-foreground hover:bg-gray-100",
  ghost: "bg-transparent hover:bg-gray-100 border border-transparent",
  danger:
    "bg-red-500 hover:bg-red-700 border border border-transparent text-white",
};

const sizeStyles = {
  sm: "text-sm px-3 py-1 rounded",
  md: "px-4 py-2 rounded-md",
  lg: "text-lg px-6 py-3 rounded-lg",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  href,
}: ButtonProps) => {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  const classes = `
    font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    ${variantStyle}
    ${sizeStyle}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `;

  // If href is provided and component is not disabled, render as Link
  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
};

export default Button;
