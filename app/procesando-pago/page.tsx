"use client"
import { Spinner } from '@/components/ui'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function PayProcess () {

  const router = useRouter()

  const verifyPay = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const tokenWs = urlParams.get('token_ws')
    if (tokenWs) {
      const pay = JSON.parse(localStorage.getItem('pay')!)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay/commit`, { token: tokenWs })
      if (response.data.status === 'FAILED') {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/pay/${pay._id}`, { state: 'Pago no realizado' })
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${pay.email}`)
        const services = [...res.data.services];
        const serviceToUpdate = services.find(service => service.service === pay.service)
        serviceToUpdate.payStatus =
          serviceToUpdate.payStatus === 'Pago iniciado'
            ? 'Pago no realizado'
            : serviceToUpdate.payStatus === 'Segundo pago iniciado'
            ? 'Segundo pago no realizado'
            : '';
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/client/${pay.email}`, { services: serviceToUpdate })
        router.push('/pago-fallido')
      }
      if (response.data.status === 'AUTHORIZED') {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/pay/${pay._id}`, { state: 'Pago realizado' })
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${pay.email}`)
        const services = [...res.data.services];
        const serviceToUpdate = services.find(service => service.service === pay.service)
        serviceToUpdate.payStatus =
          serviceToUpdate.payStatus === 'Pago iniciado'
            ? 'Pago realizado'
            : serviceToUpdate.payStatus === 'Segundo pago iniciado'
            ? 'Segundo pago realizado'
            : '';
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/client/${pay.email}`, { services: serviceToUpdate })
        router.push('/gracias-por-comprar')
      }
    }
  }

  useEffect(() => {
    verifyPay()
  }, [])

  return (
    <div className='w-full bg-white fixed flex' style={{ height: 'calc(100% - 150px)' }}>
      <div className='w-fit m-auto'>
        <Spinner />
      </div>
    </div>
  )
}