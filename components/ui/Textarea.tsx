import React from 'react'

interface Props {
    placeholder: string
    name?: string
    change: any
    value: string
    config?: string
    style?: any
}

export const Textarea: React.FC<Props> = ({ placeholder, name, change, value, config, style }) => {
  return (
    <textarea placeholder={placeholder} name={name} onChange={change} value={value} className={`${config} border py-2 px-3 w-full text-sm transition-colors duration-200`} style={{ borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '' }} />
  )
}
