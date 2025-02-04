"use client"
import axios from 'axios'
import React, { useState } from 'react'
import { IInfo } from '@/interfaces'
import { ButtonFunction, ButtonSubmit, H2, H3, Input, P, Spinner2 } from '.'
import { usePathname } from 'next/navigation'
import Cookies from 'js-cookie'

declare const fbq: Function

export const SubscribePage = ({ info, style }: { info: IInfo, style?: any }) => {

  const [subscribeData, setSubscribeData] = useState({ email: '', tags: ['suscriptores'] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [send, setSend] = useState(false)

  const pathname = usePathname()

  const inputChange = (e: any) => {
    setSubscribeData({...subscribeData, email: e.target.value})
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!loading) {
      setLoading(true)
      setError('')
      if (emailRegex.test(subscribeData.email)) {
        const newEventId = new Date().getTime().toString()
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, { ...subscribeData, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), page: pathname, eventId: newEventId })
        fbq('track', 'Lead', { email: subscribeData.email, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
        setSubscribeData({ ...subscribeData, email: '' })
        setSend(true)
      } else {
        setError('Correo no valido')
        setLoading(false)
      }
    }
  }

  return (
    <div className='w-full min-h-[230px] bg-neutral-100 pl-4 pr-4 flex dark:bg-neutral-900/40' style={{ background: `${info.typeBackground === 'Degradado' ? info.background : info.typeBackground === 'Color' ? info.background : ''}` }}>
      <form className='w-[1280px] m-auto flex flex-col gap-4'>
        {
          error !== ''
            ? <p className='bg-red-500 px-2 py-1 text-white w-fit'>{error}</p>
            : ''
        }
        {
          send
            ? (
              <>
                <p className='text-center font-medium text-xl lg:text-3xl' color={info.textColor}>¡Listo!</p>
                <P text='Pronto empezaras a recibir nuestros correos.' config='text-center' color={info.textColor} />
              </>
            )
            : (
              <>
                <h2 className='text-center font-medium text-xl lg:text-3xl' style={{ color: info.textColor }}>{info?.title ? info.title : 'Suscribete a nuestra lista'}</h2>
                <div className='flex gap-2'>
                  <Input inputChange={inputChange} type='text' placeholder={'Email'} value={subscribeData.email} style={style} />
                  <ButtonSubmit action={handleSubmit} submitLoading={loading} textButton='Enviar' config='w-28' style={style} />
                </div>
              </>
            )
        }
        
      </form>
    </div>
  )
}
