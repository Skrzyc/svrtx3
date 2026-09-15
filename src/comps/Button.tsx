import React from "react";
import { Link } from "react-router";

type Props = {
  name: string;
  navLink?: string;
  className?: string;
  onClick?: () => void;
};

type ButtonProps = {
  props?: Props;
  name?: string;
  navLink?: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

export const Button = ({
  props,
  name: directName,
  navLink: directNavLink,
  className: directClassName,
  onClick: directOnClick,
  children,
}: ButtonProps) => {
  const name = props?.name ?? directName ?? "";
  const navLink = props?.navLink ?? directNavLink;
  const customClass = props?.className ?? directClassName ?? "";
  const onClick = props?.onClick ?? directOnClick;

  const buttonContent = (
    <span className="font-fancy text-2xl sm:text-3xl md:text-4xl text-white tracking-wider drop-shadow-[2px_2px_4px_rgba(0,0,0,0.9)] select-none">
      {children ?? name}
    </span>
  );

  const baseClasses = `fancyCursor inline-flex items-center justify-center text-center px-6 py-2.5 sm:px-8 sm:py-3 bg-black/85 hover:bg-accent border-2 border-accent/70 hover:border-white rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(255,59,108,0.5)] transition-all duration-200 ease-in-out active:scale-95 ${customClass}`;

  if (navLink) {
    return (
      <Link to={navLink} className={baseClasses} onClick={onClick}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button type="button" className={baseClasses} onClick={onClick}>
      {buttonContent}
    </button>
  );
};
