import React from 'react'

interface ButtonProps {
  onClick:()=>void,
  children:React.ReactNode,
  className?:string,
  type?: string,
  isDisabled?: boolean
}
export const Button = ({onClick, children,className,type,isDisabled}:ButtonProps) => {
  return (
    <button
            onClick={onClick}
            className={className}
            type={type as "submit" | "reset" | "button" | undefined}
            disabled={isDisabled}
          >
            {children}
          </button>
  )
}
