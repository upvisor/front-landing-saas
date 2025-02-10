"use client"
import { IMessage, IStoreData } from '@/interfaces'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import io from 'socket.io-client'
import { Input } from '../ui'

declare const fbq: Function

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/`, {
  transports: ['websocket']
})

interface Props {
  style?: any
  storeData?: IStoreData
  design: any
  viewChat: boolean
}

export const Chat: React.FC<Props> = ({ style, storeData, design, viewChat }) => {

  const [chatView, setChatView] = useState(false)
  const [chatOpacity, setChatOpacity] = useState('-mb-[200px]')
  const [chat, setChat] = useState<IMessage[]>([{
    response: `¡Hola! Te damos la bienvenida a ${storeData?.name}, mi nombre es ${storeData?.nameContact}, ¿En que te puedo ayudar?`,
    adminView: false,
    userView: false
  }])
  const [newMessage, setNewMessage] = useState('')

  const chatRef = useRef(chat)
  const containerRef = useRef<HTMLDivElement>(null)
  const chatOpacityRef = useRef(chatOpacity)

  const getMessages = async () => {
    if (localStorage.getItem('chatId')) {
      const senderId = localStorage.getItem('chatId')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/${senderId}`)
      setChat(response.data)
    }
  }

  useEffect(() => {
    getMessages()
  }, [])

  useEffect(() => {
    chatRef.current = chat
  }, [chat])

  useEffect(() => {
    chatOpacityRef.current = chatOpacity
  }, [chatOpacity])

  useEffect(() => {
    socket.on('messageAdmin', message => {
      if (localStorage.getItem('chatId') === message.senderId) {
        if (chatOpacityRef.current === '') {
          setChat(chatRef.current.concat([{ ...message, agent: true, adminView: true, userView: true }]))
        } else {
          setChat(chatRef.current.concat([{ ...message, agent: true, adminView: true, userView: false }]))
        }
      }
    })

    return () => {
      socket.off('messageAdmin', message => console.log(message))
    }
  }, [])

  const inputChange = (e: any) => {
    setNewMessage(e.target.value)
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [chat])

  const submitMessage = async (e: any) => {
    e.preventDefault()
    let senderId
    let message = newMessage
    let ultimateMessage = [...chat]
    ultimateMessage.reverse()
    setNewMessage('')
    setChat(chat.concat({message: message, userView: true}))
    if (localStorage.getItem('chatId')) {
      senderId = localStorage.getItem('chatId')
    } else {
      senderId = uuidv4()
      localStorage.setItem('chatId', senderId)
    }
    let response
    socket.emit('message', {message: message, senderId: senderId, createdAt: new Date()})
    if (chat.length === 1) {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat/create`, { senderId: senderId, response: chat[0].response, agent: false, adminView: false, userView: true })
    }
    response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, { senderId: senderId, message: message, adminView: false, userView: true })
    if (response!.data.response) {
      setChat(chat.filter(mes => mes.message === message))
    }
    setChat(chat.concat(response!.data))
  }

  return (
    <>
        <div className={`${chatOpacity} ${chatView ? 'flex' : 'hidden'} ${chatOpacity === '-mb-[200px]' ? 'opacity-0' : 'opacity-1'} fixed bottom-24 right-4 z-50 h-[480px] ml-3 justify-between flex-col gap-3 transition-all duration-500 w-80 sm:w-96 sm:h-[600px] sm:gap-4`} style={{ borderRadius: `${style.borderBlock}px`, border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '', boxShadow: style.design === 'Sobreado' ? `0px 3px 20px 3px ${style.borderColor}10` : '', backgroundColor: design.chat.bgColor }}>
          <div className='h-28 w-full flex p-4' style={{ backgroundColor: style.primary, borderTopLeftRadius: `${style.borderBlock}px`, borderTopRightRadius: `${style.borderBlock}px` }}>
            <span className='text-white mt-auto mb-auto text-xl'>Chat</span>
          </div>
          <div ref={containerRef} className='flex flex-col h-full gap-2 pl-3 sm:pl-4' style={{ overflow: 'overlay' }}>
            {
              chat?.length
                ? chat.map((info, i) => (
                  <div key={info.response} className='flex flex-col gap-2 pr-3 sm:pr-4'>
                    {
                      info.message
                        ? (
                          <div className='flex flex-col gap-2 ml-6'>
                            <div className='bg-gray-200 p-1.5 rounded-md w-fit ml-auto'><p>{info.message}</p></div>
                          </div>
                        )
                        : ''
                    }
                    {
                      info.response
                        ? (
                          <div className='flex flex-col gap-2 mr-6'>
                            <div className='text-white p-1.5 rounded-md w-fit' style={{ backgroundColor: style.primary }}><p>{info.response}</p></div>
                          </div>
                        )
                        : ''
                    }
                  </div>
                ))
                : ''
            }
          </div>
          <form className='flex gap-2 pr-3 pl-3 pb-3 sm:pr-4 sm:pl-4 sm:pb-4'>
            <Input inputChange={inputChange} value={newMessage} type={'text'} placeholder={'Mensaje'} style={style} />
            <button type='submit' onClick={submitMessage} className='text-white w-28 rounded-xl dark:bg-neutral-700 transition-colors duration-200 hover:bg-transparent' style={{ backgroundColor: style.primary }}>Enviar</button>
          </form>
        </div>
        <button onClick={async (e: any) => {
          e.preventDefault()
          if (chatOpacity === '-mb-[200px]') {
            setChatView(true)
            setTimeout(() => {
              setChatOpacity('')
            }, 50)
          } else {
            setChatOpacity('-mb-[200px]')
            setTimeout(() => {
              setChatView(false)
            }, 500);
          }
          const senderId = localStorage.getItem('chatId')
          if (senderId) {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/chat-user/${senderId}`)
            getMessages()
          } else {
            chat[0].userView = true
            setChat(chat)
          }
        }} aria-label='Botón para abrir y cerrar el chat' id='chat' className={`${viewChat ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 w-14 h-14 z-50 flex rounded-full fixed bottom-4 right-4 ml-auto`} style={{ backgroundColor: style.primary }}>
          {
            chatOpacity === '-mb-[200px]'
              ? (
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="text-3xl text-white m-auto" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path><path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"></path>
                </svg>
              )
              : (
                <svg className="m-auto w-[19px] text-white" role="presentation" viewBox="0 0 16 14">
                  <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
                </svg>
              )
          }
          {
            chat.map((message, index) => (
              <div key={index}>
                {
                  index === chat.length - 1
                    ? message.userView
                        ? ''
                        : <div className='h-3 w-3 rounded-full bg-button right-0 absolute' />
                    : ''
                  }
              </div>
            ))
          }
        </button>
    </>
  )
}
