"use client";

import { IconType } from "react-icons";

interface ButtonConfirmProps {
  label: string,
  disabled?: boolean,
  outline?: boolean,
  small?: boolean,
  custom?: string,
  icon?: IconType,
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void,
  loading?: boolean,
}

const ButtonConfirm: React.FC<ButtonConfirmProps> = (
  {
    label,
    disabled,
    outline,
    small,
    custom,
    icon: Icon,
    onClick,
    loading
  }
) => {
  return (
    <button onClick={onClick} disabled={disabled} className={`disabled:opacity-70 disabled:cursor-not-allowed rounded-md hover:opacity-80 transition w-full border-lime-900 flex items-center justify-center gap-2 
    ${outline ? "bg-white" : "bg-lime-900"} ${outline ? "hover:bg-lime-900" : "hover:bg-white"} ${outline ? "text-lime-900" : "text-white"} ${outline ? "hover:text-white" : "hover:text-lime-900"}
    ${small ? "text-sm font-light" : "text-base font-semibold"} ${small ? "py-1 px-2 border-[1px]" : "py-3 px-4 border-2"} ${custom ? custom : ""}`}>
      {loading ? 'Please wait..' : label} {loading ? <span className="loading loading-ring loading-md"></span> : Icon && <Icon size={24} />}
    </button>
  );
}

export default ButtonConfirm;