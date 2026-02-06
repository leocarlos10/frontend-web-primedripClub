import type { ButtonProps } from "../../types/UItypes/ButtonProps";

function Button({ onClick, children, className, ...rest }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={
        className
          ? className
          : `
            bg-black
           dark:bg-white
            text-white 
            dark:text-black 
            px-6 
            py-2.5 
            rounded-full 
            text-sm 
            font-bold 
            uppercase 
            tracking-wider 
            flex 
            items-center 
            gap-2 
            hover:opacity-90 
            transition-opacity 
            cursor-pointer`
      }
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
