"use client"
import { IDesign, IPayment, IPlan, IService } from '@/interfaces'
import React, { useState } from 'react'
import { Button, Check, H1, H2, P } from '../ui'
import { NumberFormat } from '@/utils'
import { PopupPlans } from './PopupPlans'

interface Props {
    content: IDesign
    services: IService[]
    index: number
    payment: IPayment
    step?: string
    style?: any
}

export const Table: React.FC<Props> = ({ content, services, index, payment, step, style }) => {

    const [popup, setPopup] = useState({ view: 'hidden', opacity: 'opacity-0', mouse: false })
    const [plan, setPlan] = useState<IPlan>()

  return (
    <>
      <PopupPlans popup={popup} setPopup={setPopup} plan={plan} services={services} payment={payment} content={content} step={step} style={style} />
      <div className={`py-10 md:py-20 px-4 m-auto w-full flex`} style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}`, color: content.info.textColor }}>
        <div className='flex flex-col gap-8 m-auto w-full max-w-[1280px]'>
          {
            content.info.title && content.info.title !== '' || content.info.description && content.info.description !== ''
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
                </div>
              )
              : ''
          }
          {
            services?.find(service => service._id === content.service?.service)?.plans?.plans.length
              ? (
                <div className={`overflow-x-auto w-full`} style={{ boxShadow: style.design === 'Sombreado' ? '0px 3px 20px 3px #11111110' : '', borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '', border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '' }}>
                  <table className='min-w-full table-auto rounded-xl'>
                    <thead>
                      <tr>
                        <th className='px-4 py-5 text-left font-medium'>Funcionalidades</th>
                        {
                          services?.find(service => service._id === content.service?.service)?.plans?.plans.map((plan, idx) => (
                            <th key={plan._id} className='px-4 py-5 text-center font-medium'>{plan.name}</th>
                          ))
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {
                        services?.find(service => service._id === content.service?.service)?.plans?.functionalities.map((functionality, index) => (
                          <tr key={index}>
                            <td className='p-4' style={{ borderTop: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '' }}>{functionality}</td>
                            {
                              services?.find(service => service._id === content.service?.service)?.plans?.plans.map((plan) => (
                                <td key={plan._id} className={`p-4 text-center`} style={{ borderTop: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '' }}>
                                  {
                                    // Buscar si la funcionalidad existe en el plan
                                    plan.functionalities?.some(f => f.name === functionality)
                                      ? (
                                        // Si la funcionalidad existe, muestra el valor de la funcionalidad
                                        plan.functionalities?.find(f => f.name === functionality)?.value === 'Si' ? <Check config='m-auto' style={style} /> : plan.functionalities?.find(f => f.name === functionality)?.value
                                      ) 
                                      : '✘'
                                  }
                                </td>
                              ))
                            }
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              )
              : ''
          }
        </div>
      </div>
    </>
  )
}
