import React from "react";
import classnames from "classnames";
import border from "assets/ui/panel/light_border.png";

interface Props {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | undefined;
}
export const Button: React.FC<Props> = ({
  children,
  onClick,
  disabled,
  className,
  type,
}) => {
  return (
    <button
      className={classnames(
        "bg-brown-200 w-full p-1 shadow-sm text-white text-shadow object-contain justify-center items-center hover:bg-brown-300 cursor-pointer flex disabled:opacity-50 ",
        className
      )}
      type={type}
      disabled={disabled}
      onClick={onClick}
      // Custom styles to get pixellated border effect
      style={{
        // border: "5px solid transparent",
        borderStyle: "solid",
        borderWidth: "5px",
        borderImage: `url(${border}) 30 stretch`,
        borderImageSlice: "25%",
        imageRendering: "pixelated",
        borderImageRepeat: "repeat",
        borderRadius: "15px",
      }}
    >
      {children}
    </button>
  );
};
