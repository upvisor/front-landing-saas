"use client"
import axios from 'axios'
import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import { io } from 'socket.io-client'
import { H1 } from '@/components/ui'

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/`, {
  transports: ['websocket']
})

declare const fbq: Function

const PageBuySuccess = () => {

  const updateClient = async () => {
    if (localStorage.getItem('pay')) {
      const pay = JSON.parse(localStorage.getItem('pay')!)
      fbq('track', 'Purchase', { first_name: pay.firstName, last_name: pay.lastName, email: pay.email, phone: pay.phone && pay.phone !== '' ? `56${pay.phone}` : undefined, content_name: pay.service, currency: "clp", value: pay.price, contents: { id: pay.service, item_price: pay.price, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pay.pathname}` }, { eventID: pay.eventId })
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, { email: pay.email, firstName: pay.firstName, lastName: pay.lastName, phone: pay.phone, address: pay.address, departament: pay.details, region: pay.region, city: pay.city, tags: ['clientes'] })
      socket.emit('newNotification', { title: 'Nuevo pago recibido:', description: '', url: '/pagos', view: false })
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notification`, { title: 'Nuevo pago recibido:', description: '', url: '/pagos', view: false })
      localStorage.setItem('pay', '')
    }
  }

  useEffect(() => {
    updateClient()
  }, [])

  return (
    <div className='flex px-2'>
      <div className='w-full max-w-[1280px] m-auto py-20 flex flex-col gap-4'>
      <svg className='m-auto' stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="100px" width="100px" xmlns="http://www.w3.org/2000/svg"><polygon fill="#8BC34A" points="24,3 28.7,6.6 34.5,5.8 36.7,11.3 42.2,13.5 41.4,19.3 45,24 41.4,28.7 42.2,34.5 36.7,36.7 34.5,42.2 28.7,41.4 24,45 19.3,41.4 13.5,42.2 11.3,36.7 5.8,34.5 6.6,28.7 3,24 6.6,19.3 5.8,13.5 11.3,11.3 13.5,5.8 19.3,6.6"></polygon><polygon fill="#CCFF90" points="34.6,14.6 21,28.2 15.4,22.6 12.6,25.4 21,33.8 37.4,17.4"></polygon></svg>
        <H1 text='Tu pago se ha realizado correctamente' config='text-center font-semibold' />
        <p className='text-lg text-center'>Recibiras un correo con todos los detalles.</p>
      </div>
    </div>
  )
}

export default PageBuySuccess