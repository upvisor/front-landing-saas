import React from 'react'
import { Spinner2 } from '.'

interface Props {
    submitLoading: boolean
    textButton: string
    action: any
    config?: string
    style?: any
}

export const ButtonSubmit: React.FC<Props> = ({ submitLoading, textButton, action, config, style }) => {
  return (
    <button onClick={action} className={`${config} ${submitLoading ? 'cursor-not-allowed' : ''} transition-colors duration-300 h-10 font-medium`} style={{ backgroundColor: style?.primary, color: style?.button, borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '' }}>{submitLoading ? <Spinner2 /> : textButton}</button>
  )
}
