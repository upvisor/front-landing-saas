"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, H3, H4, Input, Spinner, Spinner2 } from '../ui'
import { NumberFormat } from '@/utils';
import { IClient, IDesign, IPayment, IService, IStoreData } from '@/interfaces';
import { CardPayment, initMercadoPago, StatusScreen } from '@mercadopago/sdk-react'
import axios from 'axios';
import { io } from 'socket.io-client'
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie'
import Link from 'next/link';
import Image from 'next/image'

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/`, {
  transports: ['websocket']
})

interface Props {
    content: IDesign
    services?: IService[]
    step?: string
    payment?: IPayment
    storeData: IStoreData
    style?: any
    index: number
}

declare global {
    interface Window {
      MercadoPago: any;
      cardPaymentBrickController: any;
    }
}

declare const fbq: Function

export const Checkout: React.FC<Props> = ({ content, services, step, payment, storeData, style, index }) => {

  const [client, setClient] = useState<IClient>({ email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [initialization, setInitialization] = useState({ amount: Number(services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : '') })
  const [idService, setIdService] = useState('')
  const [loadingPayment, setLoadingPayment] = useState(true)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [clientData, setClientData] = useState<IClient>()
  const [pay, setPay] = useState('')
  const [link, setLink] = useState('')
  const [token, setToken] = useState('')
  const [url, setUrl] = useState('')
  const [transbankLoading, setTransbankLoading] = useState(false)
  const [paymentFailed, setPaymentFailed] = useState(false)

  const clientRef = useRef(client);
  const initializationRef = useRef(initialization)
  const paymentIdRef = useRef(null)

  const pathname = usePathname()

  initMercadoPago(payment?.mercadoPago.publicKey!)

  const viewCheckout = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-by-step${pathname}`)
    if (!res.data.message) {
      const respo = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-name/${res.data}`)
      const stepFind = respo.data.steps.find((ste: any) => ste.step === step)
      const currentUrl = window.location.href
      const url = new URL(currentUrl)
      const params = new URLSearchParams(url.search)
      const email = params.get('email')
      const serviceId = params.get('service')
      setIdService(serviceId? serviceId : '')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${email}`)
      setClientData(response.data)
      if (email && serviceId) {
        const resp = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pay-email/${email}-${serviceId}`)
        setInitialization({ amount: Number(services?.find(servi => servi._id === content.service?.service)?.typePrice === '2 pagos' || services?.find(servi => servi._id === content.service?.service)?.typePrice === 'Precio variable con 2 pagos' ? resp.data.price / 2 : resp.data.price) })
        initializationRef.current.amount = Number(services?.find(servi => servi._id === content.service?.service)?.typePrice === '2 pagos' || services?.find(servi => servi._id === content.service?.service)?.typePrice === 'Precio variable con 2 pagos' ? resp.data.price / 2 : resp.data.price)
        setClient({ ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || [])] : [], services: [{ service: content.service?.service, plan: content.service?.plan, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: resp.data.price ? resp.data.price : services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : '' }], funnels: [{ funnel: respo.data._id, step: stepFind._id }] })
        clientRef.current = { ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || [])] : [], services: [{ service: content.service?.service, plan: content.service?.plan, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: resp.data.price ? resp.data.price : services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : '' }], funnels: [{ funnel: respo.data._id, step: stepFind._id }] }
      } else {
        setClient({ ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || [])] : [], services: [{ service: content.service?.service, plan: content.service?.plan, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : '' }], funnels: [{ funnel: respo.data._id, step: stepFind._id }] })
        clientRef.current = { ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || [])] : [], services: [{ service: content.service?.service, plan: content.service?.plan, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : '' }], funnels: [{ funnel: respo.data._id, step: stepFind._id }] }
      }
      const service = services?.find(servi => servi._id === content.service?.service)
      const newEventId = new Date().getTime().toString()
      if (pathname !== '/') {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, { page: pathname, funnel: respo.data._id, step: stepFind?._id, service: service?._id, stepService: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id, typeService: service?.typeService, typePrice: service?.typePrice, plan: content.service?.plan, price: initializationRef.current.amount, event_id: newEventId, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp') })
        fbq('track', 'InitiateCheckout', { content_name: service?._id, currency: "clp", value: initializationRef.current.amount, contents: { id: service?._id, item_price: initializationRef.current.amount, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, { page: pathname, service: service?._id, stepService: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id, typeService: service?.typeService, typePrice: service?.typePrice, plan: content.service?.plan, price: initializationRef.current.amount, eventId: newEventId, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp') })
        fbq('track', 'InitiateCheckout', { content_name: service?._id, currency: "clp", value: initializationRef.current.amount, contents: { id: service?._id, item_price: initializationRef.current.amount, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
      }
    } else {
      const currentUrl = window.location.href
      const url = new URL(currentUrl)
      const params = new URLSearchParams(url.search)
      const email = params.get('email')
      const serviceId = params.get('service')
      setIdService(serviceId? serviceId : '')
      let response: any
      if (email) {
        response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${email}`)
      }
      setClientData(response?.data)
      if (email && serviceId) {
        const resp = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pay-email/${email}-${serviceId}`)
        setInitialization({ amount: Number(services?.find(servi => servi._id === content.service?.service)?.typePrice === '2 pagos' || services?.find(servi => servi._id === content.service?.service)?.typePrice === 'Precio variable con 2 pagos' ? resp.data.price / 2 : resp.data.price) })
        initializationRef.current.amount = Number(services?.find(servi => servi._id === content.service?.service)?.typePrice === '2 pagos' || services?.find(servi => servi._id === content.service?.service)?.typePrice === 'Precio variable con 2 pagos' ? resp.data.price / 2 : resp.data.price)
        setClient({ ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || [])] : [], services: [{ service: content.service?.service, plan: content.service?.plan, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: resp.data.price ? resp.data.price : services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : '' }] })
        clientRef.current = { ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || [])] : [], services: [{ service: content.service?.service, plan: content.service?.plan, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: resp.data.price ? resp.data.price : services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : '' }] }
      } else {
        setClient({ ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || [])] : [], services: [{ service: content.service?.service, plan: content.service?.plan, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : '' }] })
        clientRef.current = { ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || [])] : [], services: [{ service: content.service?.service, plan: content.service?.plan, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : '' }] }
      }
      const service = services?.find(servi => servi._id === content.service?.service)
      const newEventId = new Date().getTime().toString()
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, { page: pathname, service: service?._id, stepService: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id, typeService: service?.typeService, typePrice: service?.typePrice, plan: content.service?.plan, price: initializationRef.current.amount, event_id: newEventId, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp') })
      fbq('track', 'InitiateCheckout', { content_name: service?._id, currency: "clp", value: initializationRef.current.amount, contents: { id: service?._id, item_price: initializationRef.current.amount, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof fbq === 'function') {
        viewCheckout()
        clearInterval(interval)
      }
    }, 100)
  
    return () => clearInterval(interval)
  }, [])
   
  const onSubmit = async (formData: any) => {
    // callback llamado al hacer clic en el botón enviar datos
    if (!loading) {
      setLoading(true)
      setError('')
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (clientRef.current.email !== '' && clientRef.current.firstName !== '' && clientRef.current.lastName !== '' && clientRef.current.phone !== '') {
        if (emailRegex.test(clientRef.current.email)) {
          return new Promise<void>((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/process_payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            })
              .then((response) => response.json())
              .then(async (response) => {
                console.log(response)
                paymentIdRef.current = response.id
                let currentClient = clientRef.current
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${currentClient.email}`)
                if (res.data.email) {
                  currentClient.services![0].payStatus = res.data.services.find((service: any) => service.service === currentClient.services![0].service)?.payStatus === 'Pago realizado' ? 'Segundo pago realizado' : 'Pago realizado'
                  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, { ...currentClient, tags: ['clientes'] })
                } else {
                  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, { ...currentClient, services: [{ ...currentClient.services![0], payStatus: 'Pago realizado' }], tags: ['clientes'] })
                }
                const service = services?.find(service => service._id === content.service?.service)
                const price = Number(initializationRef.current.amount)
                const newEventId = new Date().getTime().toString()
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay`, { firstName: clientRef.current.firstName, lastName: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone, service: service?._id, stepService: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id, typeService: service?.typeService, typePrice: service?.typePrice, plan: content.service?.plan, price: price, state: 'Pago realizado', fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), pathname: pathname, eventId: newEventId, funnel: clientRef.current.funnels?.length ? clientRef.current.funnels[0].funnel : undefined, step: clientRef.current.funnels?.length ? clientRef.current.funnels[0].step : undefined, method: 'MercadoPago' })
                fbq('track', 'Purchase', { first_name: clientRef.current.firstName, last_name: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone && clientRef.current.phone !== '' ? `56${clientRef.current.phone}` : undefined, content_name: service?._id, currency: "clp", value: price, contents: { id: service?._id, item_price: price, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
                socket.emit('newNotification', { title: 'Nuevo pago recibido:', description: services?.find(servi => servi._id === content.service?.service)?.name, url: '/pagos', view: false })
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notification`, { title: 'Nuevo pago recibido:', description: services?.find(servi => servi._id === content.service?.service)?.name, url: '/pagos', view: false })
                setLoading(false)
                setPaymentCompleted(true)
                resolve();
              })
              .catch(async (error) => {
                console.log(error)
                let currentClient = clientRef.current
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${currentClient.email}`)
                if (res.data.email) {
                  currentClient.services![0].payStatus = res.data.services.find((service: any) => service.service === currentClient.services![0].service)?.payStatus === 'Pago realizado' ? 'Segundo pago no realizado' : 'Pago no realizado'
                  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, currentClient)
                }
                setPaymentFailed(true)
                reject();
              });
          })
        } else {
          setError('Has ingresado un correo invalido')
        }
      } else {
        setError('Debes llenar todos los datos')
      }
    }
  };
   
  const onError = async (error: any) => {
    // callback llamado para todos los casos de error de Brick
    console.log(error);
  };
   
  const onReady = async () => {
    setLoadingPayment(false)
  };

  const cardPaymentMemo = useMemo(() => {
    if (typeof initializationRef.current.amount === 'number' && initializationRef.current.amount > 0) {
      return (
        <CardPayment
          initialization={initializationRef.current}
          onSubmit={onSubmit}
          onReady={onReady}
          onError={onError}
        />
      );
    }
    return null; // No renderizar CardPayment si la condición no se cumple
  }, [initializationRef.current.amount]);

  return (
    <div className={`py-10 md:py-20 w-full flex px-4`} style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}`, color: content.info.textColor }}>
      <div className='m-auto w-full max-w-[1280px] gap-6 flex flex-col'>
        { 
          content.info.titleForm === 'Logo principal' && storeData.logo && storeData.logo !== ''
            ? <Link href='/' target='_blank' className='w-fit m-auto'><Image src={storeData.logo} alt={`Logo ${storeData.name}`} width={320} height={150} className='w-44 m-auto lg:w-52' /></Link>
            : content.info.titleForm === 'Logo blanco' && storeData.logoWhite && storeData.logoWhite !== ''
              ? <Link href='/' target='_blank' className='w-fit m-auto'><Image src={storeData.logoWhite} alt={`Logo ${storeData.name}`} width={320} height={150} className='w-44 m-auto lg:w-52' /></Link>
              : ''
        }
        {
          paymentCompleted
            ? (
              <div className='flex flex-col gap-6 py-20'>
                <svg className='m-auto' stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="100px" width="100px" xmlns="http://www.w3.org/2000/svg"><polygon fill="#8BC34A" points="24,3 28.7,6.6 34.5,5.8 36.7,11.3 42.2,13.5 41.4,19.3 45,24 41.4,28.7 42.2,34.5 36.7,36.7 34.5,42.2 28.7,41.4 24,45 19.3,41.4 13.5,42.2 11.3,36.7 5.8,34.5 6.6,28.7 3,24 6.6,19.3 5.8,13.5 11.3,11.3 13.5,5.8 19.3,6.6"></polygon><polygon fill="#CCFF90" points="34.6,14.6 21,28.2 15.4,22.6 12.6,25.4 21,33.8 37.4,17.4"></polygon></svg>
                <p className='text-center mx-auto text-3xl font-medium'>Pago realizado con exito</p>
                <p className='text-center mx-auto text-lg'>Recibiras un correo con toda la información.</p>
              </div>
            )
            : paymentFailed
              ? (
                <div className='flex flex-col gap-6 py-20'>
                  <p className='text-center mx-auto text-3xl font-medium'>Pago fallido</p>
                  <p className='text-center mx-auto text-lg'>Vuelvelo a intentar más tarde.</p>
                </div>
              )
              : (
                <div className='m-auto w-full max-w-[1280px] gap-8 flex flex-col md:flex-row'>
                  <div className='flex flex-col gap-6 w-full md:w-3/5'>
                    <div className='flex flex-col gap-4'>
                      <H3 text='Datos de contacto' config='font-medium' color={content.info.textColor} />
                      <div className='flex flex-col gap-2'>
                        <p style={{ color: content.info.textColor }}>Email</p>
                        <Input placeholder='Email' inputChange={(e: any) => {
                          setClient({ ...client, email: e.target.value })
                          clientRef.current = { ...client, email: e.target.value }
                        }} value={client.email} style={style} />
                      </div>
                      <div className='flex gap-4'>
                        <div className='flex flex-col gap-2 w-1/2'>
                          <p style={{ color: content.info.textColor }}>Nombre</p>
                          <Input placeholder='Nombre' inputChange={(e: any) => {
                            setClient({ ...client, firstName: e.target.value })
                            clientRef.current = { ...client, firstName: e.target.value }
                          }} value={client.firstName} style={style} />
                        </div>
                        <div className='flex flex-col gap-2 w-1/2'>
                          <p style={{ color: content.info.textColor }}>Apellido</p>
                          <Input placeholder='Apellido' inputChange={(e: any) => {
                            setClient({ ...client, lastName: e.target.value })
                            clientRef.current = { ...client, lastName: e.target.value }
                          }} value={client.lastName} style={style} />
                        </div>
                      </div>
                      <div className='flex flex-col gap-2'>
                        <p style={{ color: content.info.textColor }}>Teléfono</p>
                        <div className='flex gap-2'>
                          <p className='my-auto' style={{ color: content.info.textColor }}>+56</p>
                          <Input placeholder='Teléfono' inputChange={(e: any) => {
                            setClient({ ...client, phone: e.target.value })
                            clientRef.current = { ...client, phone: e.target.value }
                          }} value={client.phone} style={style} />
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col gap-4'>
                      <H3 text='Pago' config='font-medium' color={content.info.textColor} />
                      <div className='flex flex-col rounded-xl' style={{ border: `1px solid ${style.borderColor}` }}>
                        <div className='w-full'>
                          <button className='p-6 border-b flex gap-4 w-full' style={{ borderBottom: `1px solid ${style.borderColor}` }} onClick={async () => {
                            setPay('WebPay Plus')
                            const pago = {
                              amount: initializationRef.current.amount,
                              returnUrl: `${process.env.NEXT_PUBLIC_WEB_URL}/procesando-pago`
                            }
                            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay/create`, pago)
                            setToken(response.data.token)
                            setUrl(response.data.url)
                          }}>
                            <input type='radio' className='my-auto' checked={pay === 'WebPay Plus'} />
                            <p>WebPay Plus</p>
                          </button>
                          {
                            pay === 'WebPay Plus'
                              ? (
                                <form action={url} method="POST" id='formTransbank' className='p-4 border-b'>
                                  <input type="hidden" name="token_ws" value={token} />
                                  <Button style={style} action={async (e: any) => {
                                    e.preventDefault()
                                    if (!transbankLoading) {
                                      setTransbankLoading(true)
                                      setError('')
                                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                                      if (clientRef.current.email !== '' && clientRef.current.firstName !== '' && clientRef.current.lastName !== '' && clientRef.current.phone !== '') {
                                        if (emailRegex.test(clientRef.current.email)) {
                                          let currentClient = clientRef.current
                                          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${currentClient.email}`)
                                          if (res.data.email) {
                                            currentClient.services![0].payStatus = res.data.services.find((service: any) => service.service === currentClient.services![0].service)?.payStatus === 'Pago realizado' ? 'Segundo pago iniciado' : 'Pago iniciado'
                                            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, currentClient)
                                          } else {
                                            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, { ...currentClient, services: [{ ...currentClient.services![0], payStatus: 'Pago iniciado' }] })
                                          }
                                          const service = services?.find(service => service._id === content.service?.service)
                                          const price = Number(initializationRef.current.amount)
                                          const newEventId = new Date().getTime().toString()
                                          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay`, { firstName: clientRef.current.firstName, lastName: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone, service: service?._id, stepService: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id, typeService: service?.typeService, typePrice: service?.typePrice, plan: content.service?.plan, price: price, state: 'Pago iniciado', fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), pathname: pathname, eventId: newEventId, funnel: clientRef.current.funnels?.length ? clientRef.current.funnels[0].funnel : undefined, step: clientRef.current.funnels?.length ? clientRef.current.funnels[0].step : undefined, method: 'WebPay Plus' })
                                          localStorage.setItem('pay', JSON.stringify(response.data))
                                          const form = document.getElementById('formTransbank') as HTMLFormElement
                                          if (form) {
                                            form.submit()
                                          }
                                        }
                                      }
                                    }
                                  }} loading={transbankLoading} config='w-[350px]'>Pagar con WebPay Plus</Button>
                                </form>
                              )
                              : ''
                          }
                        </div>
                        <div className='w-full'>
                          <button className='p-6 flex gap-4 w-full' onClick={() => setPay('MercadoPago')}>
                            <input type='radio' className='my-auto' checked={pay === 'MercadoPago'} />
                            <p>mercadoPago</p>
                          </button>
                          {
                            pay === 'MercadoPago'
                              ? (
                                <>
                                  {cardPaymentMemo}
                                  {
                                    error !== ''
                                      ? <p className='px-2 py-1 bg-red-500 text-white w-fit'>{error}</p>
                                      : ''
                                  }
                                </>
                              )
                              : ''
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`flex flex-col gap-4 sticky top-20 h-fit w-full p-6 md:p-8 md:w-2/5`} style={{ boxShadow: style.design === 'Sombreado' ? `0px 3px 20px 3px ${style.borderColor}10` : '', borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '', border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '', color: content.info.textColor }}>
                    {
                      content.service && content.service.service !== ''
                        ? (
                          <>
                            <H4 text={services?.find(servi => servi._id === content.service?.service)?.name} config='font-medium' />
                            <p>Tipo de pago: {services?.find(servi => servi._id === content.service?.service)?.typePrice}</p>
                            {
                              services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === clientData?.services?.find(service => service.service === content.service?.service)?.plan)?.name
                                ? <p>{services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === clientData?.services?.find(service => service.service === content.service?.service)?.plan)?.name}</p>
                                : ''
                            }
                            {
                              initialization.amount !== null && initialization.amount !== 0
                                ? <p className='text-xl font-medium'>${NumberFormat(Number(initialization.amount))}</p>
                                : ''
                            }
                          </>
                        )
                        : ''
                    }
                  </div>
                </div>
            )
        }
      </div>
    </div>
  )
}
