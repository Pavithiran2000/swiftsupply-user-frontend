import * as React from "react"
import MuiButton from "@mui/material/Button"
import type { ButtonProps as MuiButtonProps } from "@mui/material/Button"

type Variant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
type Size = "default" | "sm" | "lg" | "icon"

export interface ButtonProps extends Omit<MuiButtonProps, "variant" | "size"> {
  variant?: Variant
  size?: Size
  asChild?: boolean
}

/**
 * Maps your custom variant names to MUI Button variants and colors.
 */
const variantMapping: Record<Variant, { variant: MuiButtonProps["variant"]; color?: MuiButtonProps["color"]; sx?: object }> = {
  default: { variant: "contained", color: "primary" },
  destructive: { variant: "contained", color: "error" },
  outline: { variant: "outlined", color: "inherit" },
  secondary: { variant: "contained", color: "secondary" },
  ghost: { variant: "text", color: "inherit", sx: { ":hover": { backgroundColor: "action.hover" } } },
  link: {
    variant: "text",
    color: "primary",
    sx: {
      textDecoration: "underline",
      textUnderlineOffset: "4px",
      padding: 0,
      minWidth: 0,
      ":hover": {
        backgroundColor: "transparent",
        textDecoration: "underline",
      },
    },
  },
}

/**
 * Maps your size variants to MUI size and styles
 */
const sizeMapping: Record<Size, { size: MuiButtonProps["size"]; sx?: object }> = {
  default: { size: "medium" },
  sm: { size: "small" },
  lg: { size: "large" },
  icon: {
    size: "medium",
    sx: {
      minWidth: 40,
      width: 40,
      height: 40,
      padding: 0,
      borderRadius: "50%",
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
    },
  },
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", asChild = false, sx, ...props }, ref) => {
    const { variant: muiVariant, color, sx: variantSx } = variantMapping[variant]
    const { size: muiSize, sx: sizeSx } = sizeMapping[size]

    const combinedSx = { ...variantSx, ...sizeSx, ...sx }

    if (asChild && props.children && React.isValidElement(props.children)) {
      // Wrap children and apply MUI Button props/styles
      return React.cloneElement(props.children, {
        ref,
        ...props,
        variant: muiVariant,
        color,
        size: muiSize,
        sx: combinedSx,
      } as any)
    }

    return <MuiButton ref={ref} variant={muiVariant} color={color} size={muiSize} sx={combinedSx} {...props} />
  }
)

Button.displayName = "Button"

export { Button }
