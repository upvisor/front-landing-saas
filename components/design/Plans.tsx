"use client"
import { IDesign, IForm, IPayment, IPlan, IService } from '@/interfaces'
import React, { useState } from 'react'
import { Button, H1, H2, P } from '../ui'
import { NumberFormat } from '@/utils'
import { PopupPlans } from './PopupPlans'

interface Props {
    content: IDesign
    services: IService[]
    index: number
    payment: IPayment
    step?: string
    style?: any
    forms?: IForm[]
}

export const Plans: React.FC<Props> = ({ content, services, index, payment, step, style, forms }) => {

    const [popup, setPopup] = useState({ view: 'hidden', opacity: 'opacity-0', mouse: false })
    const [plan, setPlan] = useState<IPlan>()
    const [typePrice, setTypePrice] = useState('Mensual')
    const [contacts, setContacts] = useState('')
    const [isDragging, setIsDragging] = useState(false)

  return (
    <>
      <PopupPlans popup={popup} setPopup={setPopup} plan={plan} services={services} payment={payment} content={content} step={step} style={style} typePrice={typePrice} contacts={contacts} forms={forms} />
      <div onMouseUp={() => setIsDragging(false)} className={`py-10 md:py-20 px-4 m-auto w-full flex`} style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}`, color: content.info.textColor }}>
        <div className='flex flex-col gap-8 m-auto w-full max-w-[1280px]'>
          {
            content.info.title && content.info.title !== '' || content.info.description && content.info.description !== '' || services?.find(service => service._id === content.service?.service)?.plans?.plans[0]?.anualPrice
              ? (
                <div className='flex flex-col gap-4'>
                  {
                    content.info.title && content.info.title !== ''
                      ? index === 0
                        ? <H1 text={content.info.title} color={content.info.textColor} config='text-center font-semibold' />
                        : <H2 text={content.info.title} color={content.info.textColor} config='text-center font-semibold' />
                      : ''
                  }
                  {
                    content.info.description && content.info.description !== ''
                      ? <P config='text-center' text={content.info.description} />
                      : ''
                  }
                  {
                    services?.find(service => service._id === content.service?.service)?.typePrice === 'Suscripción'
                      ? (
                        <div className='m-auto p-1 rounded-full' style={{ border: `1px solid ${style.borderColor}` }}>
                          <button onClick={() => setTypePrice('Mensual')} className={`px-2 py-1 rounded-full`} style={{ backgroundColor: typePrice === 'Mensual' ? style.primary : '', color: typePrice === 'Mensual' ? style.button : '' }}>Mensual</button>
                          <button onClick={() => setTypePrice('Anual')} className={`px-2 py-1 rounded-full`} style={{ backgroundColor: typePrice === 'Anual' ? style.primary : '', color: typePrice === 'Anual' ? style.button : '' }}>Anual {Math.round(100 - Number(services?.find(service => service._id === content.service?.service)?.plans?.plans[0].anualPrice) * 100 / (Number(services?.find(service => service._id === content.service?.service)?.plans?.plans[0].price) * 12)) }%</button>
                        </div>
                      )
                      : ''
                  }
                  {
                    services?.find(service => service._id === content.service?.service)?.plans?.plans[0].level2
                      ? (
                        <div className='flex flex-col gap-3'>
                          <p className='m-auto'>Cantidad de contactos y correos</p>
                          <div
                            className="w-72 h-1.5 rounded-full m-auto bg-gray-200 flex justify-between"
                            onDragOver={(e) => e.preventDefault()} // Permite el arrastre sobre el contenedor
                          >
                            {/* Crear los círculos de los niveles */}
                            {['', 'level2', 'level3', 'level4', 'level5'].map((level, index) => (
                              <div
                                key={index}
                                draggable
                                className="w-5 h-5 rounded-full -mt-1.5 cursor-pointer"
                                onDragStart={(e) => {
                                  setIsDragging(true);
                                  e.dataTransfer.effectAllowed = 'move'; // Asegura que el arrastre sea posible
                                  e.preventDefault(); // Prevenir el comportamiento por defecto que bloquea el cursor
                                }}
                                onMouseEnter={(e) => {
                                  // Solo cambia el nivel si estamos arrastrando
                                  if (isDragging) {
                                    setContacts(level); // Cambia el nivel solo si estamos arrastrando
                                  }
                                }}
                                onClick={() => setContacts(level)}
                                style={{
                                  backgroundColor: contacts === level ? style.primary : '', // Resalta el círculo según el nivel
                                }}
                              />
                            ))}
                          </div>
                          <p className='font-medium text-lg m-auto'>{contacts === '' ? '500 contactos y 5.000 correos mensuales' : contacts === 'level2' ? '1500 contactos y 10.000 correos mensuales' : contacts === 'level3' ? 'Contactos ilimitados y 20.000 correos mensuales' : contacts === 'level4' ? 'Contactos ilimitados y 40.000 correos mensuales' : contacts === 'level5' ? 'Contactos ilimitados y 60.000 correos mensuales' : ''}</p>
                        </div>
                      )
                      : ''
                  }
                </div>
              )
              : ''
          }
          {
            services?.find(service => service._id === content.service?.service)?.plans?.plans.length
              ? (
                <div className='flex gap-6 justify-around flex-wrap'>
                  {
                    services?.find(service => service._id === content.service?.service)?.plans?.plans.map((plan, index) => (
                      <div className={`p-6 flex flex-col gap-4 w-full max-w-96 justify-between`} key={plan._id} style={{ boxShadow: style.design === 'Sombreado' ? `0px 3px 20px 3px ${style.borderColor}10` : '', borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '', border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '' }}>
                        <div className='flex flex-col gap-4'>
                          <p className='text-center font-medium text-xl'>{plan.name}</p>
                          <div className='flex gap-2 w-fit m-auto'>
                            <p className='text-center font-bold text-3xl'>${NumberFormat(Number(typePrice === 'Mensual' ? contacts === '' ? plan.price : contacts === 'level2' ? plan.level2 : contacts === 'level3' ? plan.level3 : contacts === 'level4' ? plan.level4 : contacts === 'level5' ? plan.level5 : contacts === 'level6' ? plan.level6 : '' : contacts === '' ? plan.anualPrice : contacts === 'level2' ? plan.anualLevel2 : contacts === 'level3' ? plan.anualLevel3 : contacts === 'level4' ? plan.anualLevel4 : contacts === 'level5' ? plan.anualLevel5 : contacts === 'level6' ? plan.anualLevel6 : ''))}</p>
                            <p className='my-auto'>{services?.find(service => service._id === content.service?.service)?.typePrice === 'Suscripción' ? `/ ${typePrice === 'Mensual' ? 'Mes' : 'Anual'}` : ''}</p>
                          </div>
                          {
                            plan.characteristics?.length
                              ? (
                                <>
                                  <p className='font-medium text-lg'>{index === 0 ? 'Funcionalidades:' : `Todo lo anterior más:`}</p>
                                  <div className='flex flex-col gap-2'>
                                    {
                                      plan.characteristics?.map(characteristic => characteristic ? <p key={characteristic}>{characteristic}</p> : '')
                                    }
                                  </div>
                                </>
                              )
                              : ''
                          }
                        </div>
                        <Button config='w-full' action={(e: any) => {
                          e.preventDefault()
                          setPlan(plan)
                          setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                          setTimeout(() => {
                              setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                          }, 10)
                        }} style={style}>Me interesa este plan</Button>
                      </div>
                    ))
                  }
                </div>
              )
              : ''
          }
        </div>
      </div>
    </>
  )
}
