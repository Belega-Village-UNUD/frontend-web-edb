"use client";

import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disable?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type,
  disable,
  required,
  register,
  errors
}) => {
  return (  
    <div className="w-full relative">
      <input 
      autoComplete="off"
      id={id}
      disabled={disable}
      {...register(id, {required})}
      placeholder=""
      type={type}
      className={`peer w-full p-4 pt-6 outline-none bg-white font-light border-2 rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed ${errors[id] ? "border-red-500" : "border-slate-300"} ${errors[id] ? "peer-focus:border-red-500" : "peer-focus:border-lime-600"}
      `}/>
      
      <label htmlFor={id} className={`absolute cursor-text text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${errors[id]? "text-red-500" : "text-slate-400"}`}>
        {label}
      </label>
    </div>
  );
}

export default Input;