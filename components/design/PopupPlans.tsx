"use client"
import { IClient, IDesign, IForm, IPayment, IPlan, IService } from '@/interfaces';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, H3, Input, Select, Spinner } from '../ui';
import { usePathname } from 'next/navigation';
import { CardPayment, initMercadoPago, StatusScreen } from '@mercadopago/sdk-react';
import axios from 'axios';
import Cookies from 'js-cookie'
import { io } from 'socket.io-client'
import { NumberFormat } from '@/utils';

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/`, {
    transports: ['websocket']
  })

interface Props {
    popup: any
    setPopup: any
    plan?: IPlan
    services: IService[]
    payment: IPayment
    content: IDesign
    step?: string
    style?: any
    typePrice?: string
    contacts?: string
    forms?: IForm[]
}

declare global {
    interface Window {
      MercadoPago: any;
      cardPaymentBrickController: any;
    }
}

declare const fbq: Function

export const PopupPlans: React.FC<Props> = ({ popup, setPopup, plan, services, payment, content, step, style, typePrice, contacts, forms }) => {

  const [client, setClient] = useState<IClient>({ email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [initialization, setInitialization] = useState({ amount: Number(typePrice === 'Mensual' ? contacts === '' ? plan?.price : contacts === 'level2' ? plan?.level2 : contacts === 'level3' ? plan?.level3 : contacts === 'level4' ? plan?.level4 : contacts === 'level5' ? plan?.level5 : contacts === 'level6' ? plan?.level6 : '' : contacts === '' ? plan?.anualPrice : contacts === 'level2' ? plan?.anualLevel2 : contacts === 'level3' ? plan?.anualLevel3 : contacts === 'level4' ? plan?.anualLevel4 : contacts === 'level5' ? plan?.anualLevel5 : contacts === 'level6' ? plan?.anualLevel6 : '') })
  const [loadingPayment, setLoadingPayment] = useState(true)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [formCompleted, setFormCompleted] = useState(false)
  const [idService, setIdService] = useState('')

  const clientRef = useRef(client)
  const initializationRef = useRef({ amount: Number(typePrice === 'Mensual' ? contacts === '' ? plan?.price : contacts === 'level2' ? plan?.level2 : contacts === 'level3' ? plan?.level3 : contacts === 'level4' ? plan?.level4 : contacts === 'level5' ? plan?.level5 : contacts === 'level6' ? plan?.level6 : '' : contacts === '' ? plan?.anualPrice : contacts === 'level2' ? plan?.anualLevel2 : contacts === 'level3' ? plan?.anualLevel3 : contacts === 'level4' ? plan?.anualLevel4 : contacts === 'level5' ? plan?.anualLevel5 : contacts === 'level6' ? plan?.anualLevel6 : '') })
  const paymentIdRef = useRef(null)
  const popupRef = useRef<any>(null)

  const pathname = usePathname()

  initMercadoPago(payment?.mercadoPago.publicKey!)

  useEffect(() => {
    setInitialization({ amount: Number(typePrice === 'Mensual' ? contacts === '' ? plan?.price : contacts === 'level2' ? plan?.level2 : contacts === 'level3' ? plan?.level3 : contacts === 'level4' ? plan?.level4 : contacts === 'level5' ? plan?.level5 : contacts === 'level6' ? plan?.level6 : '' : contacts === '' ? plan?.anualPrice : contacts === 'level2' ? plan?.anualLevel2 : contacts === 'level3' ? plan?.anualLevel3 : contacts === 'level4' ? plan?.anualLevel4 : contacts === 'level5' ? plan?.anualLevel5 : contacts === 'level6' ? plan?.anualLevel6 : '') })
    initializationRef.current = { amount: Number(typePrice === 'Mensual' ? contacts === '' ? plan?.price : contacts === 'level2' ? plan?.level2 : contacts === 'level3' ? plan?.level3 : contacts === 'level4' ? plan?.level4 : contacts === 'level5' ? plan?.level5 : contacts === 'level6' ? plan?.level6 : '' : contacts === '' ? plan?.anualPrice : contacts === 'level2' ? plan?.anualLevel2 : contacts === 'level3' ? plan?.anualLevel3 : contacts === 'level4' ? plan?.anualLevel4 : contacts === 'level5' ? plan?.anualLevel5 : contacts === 'level6' ? plan?.anualLevel6 : '') }
  }, [plan])

  const viewCheckout = async () => {
    if (content.info.video === 'Realizar pago') {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-by-step${pathname}`)
      if (!res.data.message) {
        const respo = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-name/${res.data}`)
        const stepFind = respo.data.steps.find((ste: any) => ste.step === step)
        setClient({ ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: plan?._id, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : '' }], funnels: [{ funnel: respo.data._id, step: stepFind._id }] })
        clientRef.current = { ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: plan?._id, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : '' }], funnels: [{ funnel: respo.data._id, step: stepFind._id }] }
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
        setClient({ ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: plan?._id, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : initializationRef.current.amount.toString() }] })
        clientRef.current = { ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: plan?._id, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : initializationRef.current.amount.toString() }] }
        const service = services?.find(servi => servi._id === content.service?.service)
        const newEventId = new Date().getTime().toString()
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, { page: pathname, service: service?._id, stepService: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id, typeService: service?.typeService, typePrice: service?.typePrice, plan: content.service?.plan, price: initializationRef.current.amount, event_id: newEventId, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp') })
        fbq('track', 'InitiateCheckout', { content_name: service?._id, currency: "clp", value: initializationRef.current.amount, contents: { id: service?._id, item_price: initializationRef.current.amount, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
      }
    } else {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-by-step${pathname}`)
      if (!res.data.message) {
        const respo = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-name/${res.data}`)
        const stepFind = respo.data.steps.find((ste: any) => ste.step === step)
        setClient({ ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: plan?._id, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : initializationRef.current.amount.toString() }], funnels: [{ funnel: respo.data._id, step: stepFind?._id }] })
        clientRef.current = { ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: plan?._id, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : initializationRef.current.amount.toString() }], funnels: [{ funnel: respo.data._id, step: stepFind?._id }] }
      } else {
        setClient({ ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: plan?._id, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : initializationRef.current.amount.toString() }] })
        clientRef.current = { ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: plan?._id, step: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname)) ? services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id : services?.find(servi => servi._id === content.service?.service)?.steps[0]._id, price: services?.find(servi => servi._id === content.service?.service)?.price ? services?.find(servi => servi._id === content.service?.service)?.price : services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price ? services?.find(servi => servi._id === content.service?.service)?.plans?.plans.find(plan => plan._id === content.service?.plan)?.price : initializationRef.current.amount.toString() }] }
      }
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof fbq === 'function' && plan?._id) {
        viewCheckout()
        clearInterval(interval)
      }
    }, 100)
  
    return () => clearInterval(interval)
  }, [plan])
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node) && popup.view === 'flex') {
          setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
          setTimeout(() => {
            setPopup({ ...popup, view: 'hidden', opacity: 'opacity-0' })
          }, 200)
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [popup, setPopup])

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
                    currentClient.services![0].payStatus = res.data.services.find((service: any) => service.service === currentClient.services![0].service)?.payStatus === 'Pago realizado' ? 'Segundo pago realizado' : 'Pago realizado'
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, currentClient)
                    const service = services?.find(service => service._id === content.service?.service)
                    const price = Number(initializationRef.current.amount)
                    const newEventId = new Date().getTime().toString()
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay`, { firstName: clientRef.current.firstName, lastName: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone, service: service?._id, stepService: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id, typeService: service?.typeService, typePrice: service?.typePrice, plan: content.service?.plan, price: price, state: 'Pago realizado', fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), pathname: pathname, eventId: newEventId, funnel: clientRef.current.funnels?.length ? clientRef.current.funnels[0].funnel : undefined, step: clientRef.current.funnels?.length ? clientRef.current.funnels[0].step : undefined })
                    fbq('track', 'Purchase', { first_name: clientRef.current.firstName, last_name: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone && clientRef.current.phone !== '' ? `56${clientRef.current.phone}` : undefined, content_name: service?._id, currency: "clp", value: price, contents: { id: service?._id, item_price: price, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
                    socket.emit('newNotification', { title: 'Nuevo pago recibido:', description: services?.find(servi => servi._id === content.service?.service)?.name, url: '/pagos', view: false })
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notification`, { title: 'Nuevo pago recibido:', description: services?.find(servi => servi._id === content.service?.service)?.name, url: '/pagos', view: false })
                    setLoading(false)
                    setPaymentCompleted(true)
                    resolve();
                  })
                  .catch(async (error) => {
                    let currentClient = clientRef.current
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${currentClient.email}`)
                    currentClient.services![0].payStatus = res.data.services.find((service: any) => service.service === currentClient.services![0].service)?.payStatus === 'Pago realizado' ? 'Segundo pago no realizado' : 'Pago no realizado'
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, currentClient)
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
        // Verificar que initialization.amount sea un número y mayor que 0
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
    <div className={`${popup.view} ${popup.opacity} transition-opacity duration-200 w-full h-full top-0 fixed bg-black/30 flex z-50 px-4`}>
      <div ref={popupRef} onMouseEnter={() => setPopup({ ...popup, mouse: true })} onMouseLeave={() => setPopup({ ...popup, mouse: false })} className={`${popup.opacity === 'opacity-1' ? 'scale-1' : 'scale-90'} max-w-[800px] transition-transform duration-200 w-full rounded-2xl max-h-[600px] overflow-y-auto bg-white m-auto flex flex-col`} style={{ boxShadow: '0px 3px 20px 3px #11111120' }}>
        <div className='flex flex-col gap-4 sticky top-0 bg-white border-b z-50 p-6 md:p-8'>
          <p className='text-center text-2xl font-medium'>{plan?.name}</p>
          <div className='flex gap-4 w-fit m-auto'>
            <p className='text-center text-3xl font-semibold'>${NumberFormat(Number(typePrice === 'Mensual' ? contacts === '' ? plan?.price : contacts === 'level2' ? plan?.level2 : contacts === 'level3' ? plan?.level3 : contacts === 'level4' ? plan?.level4 : contacts === 'level5' ? plan?.level5 : contacts === 'level6' ? plan?.level6 : '' : contacts === '' ? plan?.anualPrice : contacts === 'level2' ? plan?.anualLevel2 : contacts === 'level3' ? plan?.anualLevel3 : contacts === 'level4' ? plan?.anualLevel4 : contacts === 'level5' ? plan?.anualLevel5 : contacts === 'level6' ? plan?.anualLevel6 : ''))}</p>
            <p className='my-auto'>/ {typePrice === 'Mensual' ? 'Mes' : 'Anual'}</p>
          </div>
        </div>
        <div className='flex flex-col'>
          {
            paymentCompleted
              ? (
                <div className='flex flex-col gap-6 py-20'>
                  <svg className='m-auto' stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="100px" width="100px" xmlns="http://www.w3.org/2000/svg"><polygon fill="#8BC34A" points="24,3 28.7,6.6 34.5,5.8 36.7,11.3 42.2,13.5 41.4,19.3 45,24 41.4,28.7 42.2,34.5 36.7,36.7 34.5,42.2 28.7,41.4 24,45 19.3,41.4 13.5,42.2 11.3,36.7 5.8,34.5 6.6,28.7 3,24 6.6,19.3 5.8,13.5 11.3,11.3 13.5,5.8 19.3,6.6"></polygon><polygon fill="#CCFF90" points="34.6,14.6 21,28.2 15.4,22.6 12.6,25.4 21,33.8 37.4,17.4"></polygon></svg>
                  <p className='text-center mx-auto text-3xl font-medium'>Pago realizado con exito</p>
                  <p className='text-center mx-auto text-lg'>Recibiras un correo con toda la información.</p>
                </div>
              )
              : formCompleted
                ? (
                  <div className='flex flex-col gap-6 py-20'>
                    <svg className='m-auto' stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="100px" width="100px" xmlns="http://www.w3.org/2000/svg"><polygon fill="#8BC34A" points="24,3 28.7,6.6 34.5,5.8 36.7,11.3 42.2,13.5 41.4,19.3 45,24 41.4,28.7 42.2,34.5 36.7,36.7 34.5,42.2 28.7,41.4 24,45 19.3,41.4 13.5,42.2 11.3,36.7 5.8,34.5 6.6,28.7 3,24 6.6,19.3 5.8,13.5 11.3,11.3 13.5,5.8 19.3,6.6"></polygon><polygon fill="#CCFF90" points="34.6,14.6 21,28.2 15.4,22.6 12.6,25.4 21,33.8 37.4,17.4"></polygon></svg>
                    <p className='text-center mx-auto text-3xl font-medium'>Servicio solicitado con exito</p>
                    <p className='text-center mx-auto text-lg'>Recibiras un correo con toda la información.</p>
                  </div>
                )
                : (
                  <>
                    <div className='flex flex-col gap-4 p-6 md:p-8'>
                      <p className='text-lg font-medium'>Datos de contacto</p>
                      <div className='flex flex-col gap-2'>
                        <p>Email</p>
                        <Input style={style} placeholder='Email' inputChange={(e: any) => {
                          setClient({ ...client, email: e.target.value })
                          clientRef.current = { ...client, email: e.target.value }
                        }} value={client.email} />
                      </div>
                      <div className='flex gap-4'>
                        <div className='flex flex-col gap-2 w-1/2'>
                          <p>Nombre</p>
                          <Input style={style} placeholder='Nombre' inputChange={(e: any) => {
                            setClient({ ...client, firstName: e.target.value })
                            clientRef.current = { ...client, firstName: e.target.value }
                          }} value={client.firstName} />
                        </div>
                        <div className='flex flex-col gap-2 w-1/2'>
                          <p>Apellido</p>
                          <Input style={style} placeholder='Apellido' inputChange={(e: any) => {
                            setClient({ ...client, lastName: e.target.value })
                            clientRef.current = { ...client, lastName: e.target.value }
                          }} value={client.lastName} />
                        </div>
                      </div>
                      <div className='flex flex-col gap-2'>
                        <p>Teléfono</p>
                        <div className='flex gap-2'>
                          <p className='my-auto'>+56</p>
                          <Input style={style} placeholder='Teléfono' inputChange={(e: any) => {
                            setClient({ ...client, phone: e.target.value })
                            clientRef.current = { ...client, phone: e.target.value }
                          }} value={client.phone} />
                        </div>
                      </div>
                      {
                        content.info.form?.map((label, index) => (
                          <div key={index} className="flex flex-col gap-2">
                            <p>{label.text !== '' ? label.text : label.name}</p>
                            {
                              label.type === 'Texto'
                                ? (
                                  <Input
                                    style={style}
                                    placeholder={label.name}
                                    value={client.data?.find(dat => dat.name === label.name)?.value || client[label.data]}
                                    inputChange={(e: any) => {
                                      if (label.data === 'firstName' || label.data === 'lastName' || label.data === 'email' || label.data === 'phone') {
                                        setClient({ ...client, [label.data]: e.target.value })
                                        clientRef.current = { ...client, [label.data]: e.target.value }
                                      } else if (Array.isArray(client.data)) {
                                        const oldData = [...client.data];
                                        const existingData = oldData.find(dat => dat.name === label.data);
                                        if (existingData) {
                                          existingData.value = e.target.value;
                                        } else {
                                          oldData.push({ name: label.data, value: e.target.value });
                                        }
                                        setClient({ ...client, data: oldData });
                                        clientRef.current = { ...client, data: oldData };
                                      } else {
                                        setClient({ ...client, data: [{ name: label.data, value: e.target.value }] });
                                        clientRef.current = { ...client, data: [{ name: label.data, value: e.target.value }] };
                                      }
                                      console.log(clientRef.current)
                                    }}
                                  />
                                )
                                : ''
                            }
                            {
                              label.type === 'Selector'
                                ? (
                                  <Select selectChange={(e: any) => {
                                    if (label.data === 'firstName' || label.data === 'lastName' || label.data === 'email' || label.data === 'phone') {
                                      setClient({ ...client, [label.data]: e.target.value })
                                      clientRef.current = { ...client, [label.data]: e.target.value }
                                    } else if (Array.isArray(client.data)) {
                                      const oldData = [...client.data];
                                      const existingData = oldData.find(dat => dat.name === label.name);
                                      if (existingData) {
                                        existingData.value = e.target.value;
                                      } else {
                                        oldData.push({ name: label.data, value: e.target.value });
                                      }
                                      setClient({ ...client, data: oldData });
                                      clientRef.current = { ...client, data: oldData };
                                    } else {
                                      setClient({ ...client, data: [{ name: label.data, value: e.target.value }] });
                                      clientRef.current = { ...client, data: [{ name: label.data, value: e.target.value }] };
                                    }
                                  }} value={client.data?.find(dat => dat.name === label.name)?.value || client[label.data]} style={style}>
                                    <option>Seleccionar opción</option>
                                    {
                                      label.datas?.map(data => <option key={data}>{data}</option>)
                                    }
                                  </Select>
                                )
                                : ''
                            }
                          </div>
                        ))
                      }
                    </div>
                    {
                      content.info.video === 'Realizar pago'
                        ? (
                          <div className='flex flex-col gap-6 px-2 md:px-4'>
                            <div className='flex flex-col'>
                              {cardPaymentMemo}
                              <div id="cardPaymentBrick_container"></div>
                              {
                                error !== ''
                                  ? <p className='px-2 py-1 bg-red-500 text-white w-fit'>{error}</p>
                                  : ''
                              }
                            </div>
                          </div>
                        )
                        : <div className='flex flex-col gap-6 pb-8 px-8 w-full'><Button style={style} config='w-full' loading={loading} action={async (e: any) => {
                          if (!loading) {
                            setLoading(true)
                            setError('')

                            const form = forms?.find(form => form._id === content.form)
                            let valid = true
                            let errorMessage = ''
                        
                            // Función para obtener el valor del campo desde client o client.data
                            const getClientValue = (name: string) => client[name] || client.data?.find(dat => dat.name === name)?.value;
                        
                            form?.labels.forEach(label => {
                              const value = getClientValue(label.data)
                              
                              if (label.data && (!value || value.trim() === '')) {
                                valid = false
                                errorMessage = `Por favor, completa el campo ${label.text || label.name}.`
                              }
                            })
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                            if (client.email && !emailRegex.test(client.email)) {
                              valid = false
                              errorMessage = 'Por favor, ingresa un correo electrónico válido.'
                            }
                        
                            if (!valid) {
                              setError(errorMessage)
                              setLoading(false)
                              return
                            }
                            let currentClient = clientRef.current
                            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, currentClient)
                            const newEventId = new Date().getTime().toString()
                            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/lead`, {
                              firstName: client.firstName,
                              lastName: client.lastName,
                              email: client.email,
                              phone: client.phone,
                              data: client.data,
                              form: client.forms![0].form,
                              fbc: Cookies.get('_fbc'),
                              fbp: Cookies.get('_fbp'),
                              service: client.services?.length && client.services[0].service !== '' ? client.services[0].service : undefined,
                              funnel: client.funnel,
                              step: client.funnel?.step,
                              page: pathname,
                              eventId: newEventId
                            })
                            fbq('track', 'Lead', {
                              first_name: client.firstName,
                              last_name: client.lastName,
                              email: client.email,
                              phone: client.phone && client.phone !== '' ? `56${client.phone}` : undefined,
                              fbp: Cookies.get('_fbp'),
                              fbc: Cookies.get('_fbc'),
                              content_name: client.services?.length && client.services[0].service !== '' ? client.services[0].service : undefined,
                              contents: { id: client.services?.length && client.services[0].service !== '' ? client.services[0].service : undefined, quantity: 1 },
                              event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}`
                            }, { eventID: newEventId })
                            setFormCompleted(true)
                            setLoading(false)
                          }
                        }}>Solicitar plan</Button></div>
                    }
                  </>
                )
          }
        </div>
      </div>
    </div>
  )
}
