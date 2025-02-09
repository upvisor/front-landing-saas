"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Button, Check, H1, H2, H3, Input, Select } from '../ui'
import { IClient, IDesign, IForm, IService, IStoreData } from '@/interfaces'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import Image from 'next/image'
import Link from 'next/link'

declare const fbq: Function

export const Lead2 = ({ content, forms, step, index, services, storeData, style }: { content: IDesign, forms: IForm[], step?: string, index: any, services: IService[], storeData: IStoreData, style?: any }) => {

  const [client, setClient] = useState<IClient>({ email: '', tags: forms.find(form => form._id === content.form)?.tags, forms: [{ form: forms.find(form => form._id === content.form)?._id! }] })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [view, setView] = useState(false)
  const [viewLogo, setViewLogo] = useState(false)
  const [viewLogo2, setViewLogo2] = useState(false)
  
  const ref = useRef(null)
  const refLogo = useRef(null)
  const refLogo2 = useRef(null)

  const router = useRouter()
  const pathname = usePathname()

  const getFunnel = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-by-step${pathname}`)
      const respo = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-name/${res.data}`)
      const stepFind = respo.data.steps.find((ste: any) => ste.step === step)
      const service = services?.find(service => service._id === respo.data.service)
      if (res.data) {
        setClient({ ...client, funnels: [{ funnel: respo.data._id, step: stepFind._id }], services: service?._id ? [{ service: service?._id }] : undefined })
      }
    } catch (error) {
      console.log(error)
    }
    
  }

  useEffect(() => {
    getFunnel()
  }, [step])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setView(true);
          }, 100);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.7 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setViewLogo(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.7 }
    );

    if (refLogo.current) {
      observer.observe(refLogo.current);
    }

    return () => {
      if (refLogo.current) {
        observer.unobserve(refLogo.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setViewLogo2(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.7 }
    );

    if (refLogo2.current) {
      observer.observe(refLogo2.current);
    }

    return () => {
      if (refLogo2.current) {
        observer.unobserve(refLogo2.current);
      }
    };
  }, []);

  const getClientValue = (name: string) => client[name] || client.data?.find(dat => dat.name === name)?.value;

  return (
    <div className={`py-10 md:py-20 w-full m-auto flex px-4`} style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}` }}>
      <div className='flex flex-col gap-4 w-full max-w-[1280px] mx-auto'>
        {
          content.info.titleForm === 'Logo principal' && storeData.logo && storeData.logo !== ''
            ? <Link ref={refLogo} href='/' target='_blank' className={`${viewLogo ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 w-fit m-auto`}><Image src={storeData.logo} alt={`Logo ${storeData.name}`} width={320} height={150} className='w-44 m-auto lg:w-52' /></Link>
            : content.info.titleForm === 'Logo blanco' && storeData.logoWhite && storeData.logoWhite !== ''
              ? <Link ref={refLogo2} href='/' target='_blank' className={`${viewLogo2 ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 w-fit m-auto`}><Image src={storeData.logoWhite} alt={`Logo ${storeData.name}`} width={320} height={150} className='w-44 m-auto lg:w-52' /></Link>
              : ''
        }
        <H1 text={content.info.title} config="text-center font-semibold" color={content.info.textColor} />
        <H2 text={content.info.description} config="text-center font-medium text-xl lg:text-2xl" color={content.info.textColor} />
        <div className='flex flex-col gap-4'>
          {
            content.info.subTitle && content.info.subTitle !== ''
              ? (
                <div className='flex gap-3 m-auto'>
                  <Check config='my-auto' style={style} />
                  <p className="text-lg text-center lg:text-2xl" style={{ color: content.info.textColor }}>{content.info.subTitle}</p>
                </div>
              )
              : ''
          }
          {
            content.info.subTitle2 && content.info.subTitle2 !== ''
              ? (
                <div className='flex gap-3 m-auto'>
                  <Check config='my-auto' style={style} />
                  <p className="text-lg text-center lg:text-2xl" style={{ color: content.info.textColor }}>{content.info.subTitle2}</p>
                </div>
              )
              : ''
          }
          {
            content.info.subTitle3 && content.info.subTitle3 !== ''
              ? (
                <div className='flex gap-3 m-auto'>
                  <Check config='my-auto' style={style} />
                  <p className="text-lg text-center lg:text-2xl" style={{ color: content.info.textColor }}>{content.info.subTitle3}</p>
                </div>
              )
              : ''
          }
          {
            content.info.subTitle4 && content.info.subTitle4 !== ''
              ? (
                <div className='flex gap-3 m-auto'>
                  <Check config='my-auto' style={style} />
                  <p className="text-lg text-center lg:text-2xl" style={{ color: content.info.textColor }}>{content.info.subTitle4}</p>
                </div>
              )
              : ''
          }
        </div>
        {
          content.form && content.form !== ''
            ? (
              <div ref={ref} className={`${view ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 w-full flex`}>
                <form className="flex w-full" onSubmit={async (e: any) => {
                  e.preventDefault()
                  if (!loading) {
                    setLoading(true)
                    setError('')
                    
                    const form = forms.find(form => form._id === content.form)
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
                
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, client)
                
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
                
                    if (form?.action === 'Ir a una pagina') {
                      router.push(form.redirect!)
                    } else if (form?.action === 'Mostrar mensaje') {
                      setMessage(form.message!)
                    }
                  }
                }}>
                  <div className={`${style.design === 'Borde' ? 'border' : ''} flex flex-col gap-4 h-fit m-auto w-full p-6 md:p-8 max-w-[500px] bg-white`} style={{ boxShadow: style.design === 'Sombreado' ? '0px 3px 20px 3px #11111110' : '', borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '' }}>
                    {
                      message !== ''
                        ? (
                          <>
                            <p className='text-xl font-medium'>Formulario completado con exito</p>
                            <p>{message}</p>
                          </>
                        )
                        : (
                          <>
                            {
                              error !== ''
                                ? <p className='w-fit px-2 py-1 bg-red-500 text-white m-auto'>{error}</p>
                                : ''
                            }
                            <p className="text-main text-xl font-medium text-center">{forms?.find(form => form._id === content.form)?.title}</p>
                            {
                              forms?.find(form => form._id === content.form)?.informations.map(information => (
                                <div key={information.text} className="flex gap-2">
                                  <div
                                    className="my-auto"
                                    dangerouslySetInnerHTML={{ __html: information.icon }}
                                  />
                                  <div className="flex flex-col my-auto">
                                    <p>{information.text}</p>
                                    {
                                      information.subText && information.subText !== ''
                                        ? <p className="text-gray-400">{information.subText}</p>
                                        : ''
                                    }
                                  </div>
                                </div>
                              ))
                            }
                            {
                              forms?.find(form => form._id === content.form)?.labels.map(label => (
                                <div key={label._id} className="flex flex-col gap-2">
                                  <p>{label.text !== '' ? label.text : label.name}</p>
                                  {
                                    label.type === 'Texto' && (
                                      <Input
                                        style={style}
                                        placeholder={label.name}
                                        value={getClientValue(label.data)} // Usamos la función getClientValue
                                        inputChange={(e: any) => {
                                          if (['firstName', 'lastName', 'email', 'phone'].includes(label.data)) {
                                            setClient({ ...client, [label.data]: e.target.value })
                                          } else if (Array.isArray(client.data)) {
                                            const oldData = [...client.data]
                                            const existingData = oldData.find(dat => dat.name === label.data)
                                            if (existingData) {
                                              existingData.value = e.target.value
                                            } else {
                                              oldData.push({ name: label.data, value: e.target.value })
                                            }
                                            setClient({ ...client, data: oldData })
                                          } else {
                                            setClient({ ...client, data: [{ name: label.data, value: e.target.value }] })
                                          }
                                        }}
                                      />
                                    )
                                  }
                                  {
                                    label.type === 'Selector' && (
                                      <Select
                                        selectChange={(e: any) => {
                                          if (['firstName', 'lastName', 'email', 'phone'].includes(label.data)) {
                                            setClient({ ...client, [label.data]: e.target.value })
                                          } else if (Array.isArray(client.data)) {
                                            const oldData = [...client.data]
                                            const existingData = oldData.find(dat => dat.name === label.data)
                                            if (existingData) {
                                              existingData.value = e.target.value
                                            } else {
                                              oldData.push({ name: label.data, value: e.target.value })
                                            }
                                            setClient({ ...client, data: oldData })
                                          } else {
                                            setClient({ ...client, data: [{ name: label.data, value: e.target.value }] })
                                          }
                                        }}
                                        value={getClientValue(label.data)} // Usamos la función getClientValue
                                        style={style}
                                      >
                                        <option>Seleccionar opción</option>
                                        {label.datas?.map(data => <option key={data}>{data}</option>)}
                                      </Select>
                                    )
                                  }
                                </div>
                              ))
                            }
                            <Button type='submit' config='w-full' loading={loading} style={style}>{forms?.find(form => form._id === content.form)?.button}</Button>
                          </>
                        )
                    }
                  </div>
                </form>
              </div>
            )
            : ''
        }
      </div>
    </div>
  )
}
