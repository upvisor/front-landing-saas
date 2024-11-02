"use client"
import React, { useEffect, useState } from 'react'
import { Calendar, H1, H2, P } from '../ui'
import { ICall, IClient, IDesign, IPayment, IService, IStoreData } from '@/interfaces'
import axios from 'axios'
import { usePathname } from 'next/navigation'
import { NumberFormat } from '@/utils'
import Link from 'next/link'
import Image from 'next/image'

export const Call = ({ calls, content, step, services, payment, storeData, index }: { calls: ICall[], content: IDesign, step?: string, services: IService[], payment: IPayment, storeData?: IStoreData, index: number }) => {

  const [newClient, setNewClient] = useState<IClient>({ email: '', meetings: [{ meeting: calls.find(call => call._id === content.meeting)?._id! }] })

  const pathname = usePathname()

  const getFunnel = async () => {
    if (step) {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-by-step${pathname}`)
      const respo = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-name/${res.data}`)
      const stepFind = respo.data.steps.find((ste: any) => ste.step === step)
      const service = services?.find(service => service._id === respo.data.service)
      if (res.data) {
        setNewClient({ ...newClient, funnels: [{ funnel: respo.data._id, step: stepFind._id }], services: service?._id ? [{ service: service?._id }] : undefined })
      }
    }
  }

  useEffect(() => {
    getFunnel()
  }, [step])

  return (
    <div className="flex flex-col gap-16 py-8 md:py-12" style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}` }}>
      <div className="w-full flex flex-col gap-8 px-4">
        {
          content.info.titleForm === 'Logo principal' && storeData?.logo && storeData.logo !== ''
            ? <Link href='/' target='_blank' className='w-fit m-auto'><Image src={storeData.logo} alt={`Logo ${storeData.name}`} width={320} height={150} className='w-44 m-auto lg:w-52' /></Link>
            : content.info.titleForm === 'Logo blanco' && storeData?.logoWhite && storeData.logoWhite !== ''
              ? <Link href='/' target='_blank' className='w-fit m-auto'><Image src={storeData.logoWhite} alt={`Logo ${storeData.name}`} width={320} height={150} className='w-44 m-auto lg:w-52' /></Link>
              : ''
        }
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
                    ? <P text={content.info.description} color={content.info.textColor} config='text-center' />
                    : ''
                }
              </div>
            )
            : ''
        }
        <div className="bg-white border border-black/5 rounded-xl m-auto w-full max-w-[1280px]" style={{ boxShadow: '0px 3px 10px 3px #11111108' }}>
          <div className="lg:flex">
            <div className="p-6 border-b border-black/5 lg:border-b-0 lg:border-r flex flex-col gap-8 w-full lg:w-5/12">
              <div className='flex flex-col gap-6 sticky top-20'>
                <div className="flex flex-col gap-3">
                  {
                    storeData?.logo && storeData.logo !== ''
                      ? <Image src={storeData.logo} alt={`Imagen logo ${storeData.name}`} width={200} height={150} className='w-32 sm:w-40' />
                      : <p className='text-lg font-medium'>{storeData?.name}</p>
                  }
                  {
                    calls.find(call => call._id === content.meeting)
                      ? (
                        <>
                          <p className="text-xl font-semibold">{calls.find(call => call._id === content.meeting)?.title}</p>
                          <div className="flex gap-2">
                            <svg className="w-5 text-gray-500" data-id="details-item-icon" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" role="img"><path d="M.5 5a4.5 4.5 0 1 0 9 0 4.5 4.5 0 1 0-9 0Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 3.269V5l1.759 2.052" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            <p className="text-gray-500">{calls.find(call => call._id === content.meeting)?.duration}</p>
                          </div>
                          {
                            calls.find(call => call._id === content.meeting)?.price
                              ? <p className='font-medium text-xl'>${NumberFormat(Number(calls.find(call => call._id === content.meeting)?.price))}</p>
                              : ''
                          }
                        </>
                      )
                      : <p>No has seleccionado una llamada</p>
                  }
                </div>
                {
                  calls.find(call => call._id === content.meeting)
                    ? (
                      <div className="flex flex-col gap-3">
                        <p className="font-medium">Descripción:</p>
                        <div onClick={() => console.log(calls.find(call => call._id === content.meeting)?.description)} className="flex flex-col gap-2">
                          {
                            calls.find(call => call._id === content.meeting)?.description?.split('\n').map(text => <p key={text}>{text}</p>)
                          }
                        </div>
                      </div>
                    )
                    : ''
                }
              </div>
            </div>
            <div className="p-6 w-full lg:w-7/12">
              <Calendar newClient={newClient} setNewClient={setNewClient} call={calls.find(call => call._id === content.meeting)!} tags={calls.find(call => call._id === content.meeting)?.tags!} meeting={calls.find(call => call._id === content.meeting)?._id!} payment={payment} services={services} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
