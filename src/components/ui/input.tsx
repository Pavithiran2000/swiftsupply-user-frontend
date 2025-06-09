import * as React from "react"
import TextField, { type TextFieldProps } from "@mui/material/TextField"

interface InputProps extends Omit<TextFieldProps, "variant"> {
  className?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <TextField
        type={type}
        variant="outlined"
        inputRef={ref}
        className={className}
        fullWidth
        size="medium"
        InputProps={{
          classes: {
            notchedOutline: "border border-input rounded-md", // custom border radius & color via Tailwind class
          },
          // className:
          //   "flex h-10 bg-background px-3 py-2 text-base placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        }}
        InputLabelProps={{
          shrink: true, // keep label above when focused or filled
          className: "text-muted-foreground", // you can style label if needed
        }}
        {...props}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "inherit", // let Tailwind border-input control border color
            },
            "&:hover fieldset": {
              borderColor: "inherit",
            },
            "&.Mui-focused fieldset": {
              borderColor: "inherit",
              boxShadow: "0 0 0 2px var(--tw-ring-color)", // mimic ring effect with Tailwind ring color variable
            },
          },
          ...props.sx,
        }}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
