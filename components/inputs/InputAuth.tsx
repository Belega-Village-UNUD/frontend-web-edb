"use client";

import { useState } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const isValidEmail = (value: string): boolean => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(value);
};

interface InputProps {
  name: string;
  label?: string;
  type?: 'text' | 'password' | 'email' | 'number';
  disable?: boolean;
  required?: boolean;
  readonly?: boolean;
  value?: string;
  placeholder?: string;
  validate?: (value: any) => true | string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors | any;
}

const InputAuth: React.FC<InputProps> = ({
  name,
  label,
  type = 'text',
  disable,
  required,
  readonly,
  value,
  placeholder,
  validate,
  register,
  errors,
}: InputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="w-full relative">
      <input
        autoComplete="off"
        disabled={disable}
        {...register(name, {
          required, validate: (value) => {
            if (type === "email" && !isValidEmail(value)) {
              return "Email tidak valid";
              // } else if (type === "password" && value.length < 8) {
            } else if (type === "password" && value.length < 3) {
              return "Password minimal 8 karakter";
            }

            return validate?.(value) || true;
          }
        })}
        placeholder={placeholder}
        readOnly={readonly}
        type={type === "password" ? (isPasswordVisible ? "text" : "password") : type}
        className={`peer w-full p-4 pt-6 outline-none bg-white font-light border-2 rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed ${errors[name] ? "border-red-500" : "border-slate-300"} 
          ${errors[name]
            ? "peer-focus:border-red-500"
            : "peer-focus:border-lime-600"
          }`
        }
        value={value}
      />

      {type === "password" && (
        <div className="absolute right-6 top-6 cursor-pointer" onClick={togglePasswordVisibility}>
          {isPasswordVisible ? (
            <AiOutlineEyeInvisible className="text-gray-500" />
          ) : (
            <AiOutlineEye className="text-gray-500" />
          )}
        </div>
      )}

      <label htmlFor={name} className={`absolute cursor-text text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${errors[name] ? "text-red-500" : "text-slate-400"}`}>
        {label}
      </label>

      {errors[name]?.message && (
        <p className="text-xs text-red-500 mt-2">{errors[name]!.message}</p>
      )}
    </div>
  );
};

export default InputAuth;