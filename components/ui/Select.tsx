import React from 'react'

export const Select = ({ children, selectChange, name, config, value, style }: { children: React.ReactNode, selectChange: any, name?: string, config?: string, value?: string, style?: any }) => {
  return (
    <select value={value} name={name ? name : ''} className={`${config} text-sm border p-2 transition-colors duration-100 dark:border-neutral-500 dark:text-white`} style={{ borderRadius: style.form === 'Redondeadas' ? `${style.borderButton}px` : '' }} onChange={selectChange}>
      { children }
    </select>
  )
}
