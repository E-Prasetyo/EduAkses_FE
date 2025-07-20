import React from "react";

const Button = React.forwardRef(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      children,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "btn-sm",
      md: "",
      lg: "btn-lg",
    };

    const buttonClass = `btn btn-${variant} ${sizeClasses[size]} ${className}`.trim();

    return (
      <button className={buttonClass} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
