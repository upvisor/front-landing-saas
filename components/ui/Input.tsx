import React from 'react'

export const Input = ({ inputChange, value, type, placeholder, name, text, style }: { inputChange: any, value: any, type?: string, placeholder: string, name?: string, text?: string, style?: any }) => {
  return (
    <input onChange={inputChange} value={value} type={type ? type : text} placeholder={placeholder} name={name ? name : ''} className={`${text} border py-2 px-3 w-full text-sm transition-all duration-200`} style={{ borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '' }} />
  )
}
