import { useState } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface InputProps {
  name: string;
  label: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'textarea';
  value?: string;
  placeholder?: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors | any;
  autocomplete?: string;
  required?: boolean;
  readonly?: boolean;
}

const InputForm: React.FC<InputProps> = ({
  name,
  label,
  type = 'text',
  value,
  placeholder,
  register,
  errors,
  autocomplete,
  required,
  readonly,
}: InputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="sm:col-span-4">
      <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
        {label}
      </label>

      <div className="mt-2 relative">
        {type !== 'textarea' ? (
          <input
            type={type === "password" ? (isPasswordVisible ? "text" : "password") : type}
            value={value}
            {...register(name)}
            placeholder={placeholder}
            autoComplete={autocomplete}
            className="block w-full rounded-md border-0 py-2 px-2 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            required={required}
            readOnly={readonly}
          />
        ) : (
          <textarea
            {...register(name)}
            placeholder={placeholder}
            autoComplete={autocomplete}
            className="block w-full rounded-md border-0 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            required={required}
            readOnly={readonly}
          >
            {value}
          </textarea>
        )}

        {type === "password" && (
          <div className="absolute right-4 top-3 cursor-pointer" onClick={togglePasswordVisibility}>
            {isPasswordVisible ? (
              <AiOutlineEyeInvisible className="text-gray-500" />
            ) : (
              <AiOutlineEye className="text-gray-500" />
            )}
          </div>
        )}

        {errors[name]?.message && (
          <p className="text-xs text-red-500 mt-2">{errors[name]!.message}</p>
        )}
      </div>
    </div>
  );
}

export default InputForm;