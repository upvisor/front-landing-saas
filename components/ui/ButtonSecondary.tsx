import React, { PropsWithChildren } from 'react'
import { Spinner2 } from './Spinner2'

interface Props {
    action?: any
    config?: string
    type?: any
    loading?: boolean
    style?: any
    content?: any
}

export const ButtonSecondary: React.FC<PropsWithChildren<Props>> = ({ children, action, config, type, loading, style, content }) => {
  return (
    <button type={type ? type : 'button'} onClick={action} className={`${config} ${loading !== undefined ? loading ? `cursor-not-allowed` : `` : ``} h-10 px-6 w-fit transition-colors duration-300 font-medium border`} style={{ borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '', border: `1px solid ${style.borderColor}`, color: content?.info?.textColor }}>{ loading !== undefined ? loading ? <Spinner2 /> : children : children }</button>
  )
}