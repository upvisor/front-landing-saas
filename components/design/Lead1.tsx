"use client"
import React, { useEffect, useState } from 'react'
import { Button, Check, H1, H2, Input, P, Select } from '../ui'
import { IClient, IDesign, IForm, IService } from '@/interfaces'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

declare const fbq: Function

export const Lead1 = ({ content, forms, step, index, services, style }: { content: IDesign, forms: IForm[], step?: string, index: any, services?: IService[], style?: any }) => {

  const [client, setClient] = useState<IClient>({ email: '', tags: forms.find(form => form._id === content.form)?.tags, forms: [{ form: forms.find(form => form._id === content.form)?._id! }] })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState([])

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

  const getClientData = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-data`)
    setData(res.data)
  }

  useEffect(() => {
    getClientData()
  }, [])

  return (
    <div className={`py-10 md:py-20 w-full flex px-4`} style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}` }}>
      <div className="flex flex-col gap-8 m-auto w-full max-w-[1280px] lg:flex-row">
        <div className='w-full flex flex-col gap-4 my-auto lg:w-1/2'>
          {
            content.info.description2 && content.info.description2 !== ''
              ? <p className='px-4 py-2 w-fit text-base lg:text-lg' style={{ backgroundColor: style.primary, color: style.button }}>{content.info.description2}</p>
              : ''
          }
          <H1 text={content.info.title} color={content.info.textColor} />
          <P text={content.info.description} color={content.info.textColor} />
          <div className='flex flex-col gap-4'>
            {
              content.info.subTitle && content.info.subTitle !== ''
                ? (
                  <div className='flex gap-3'>
                    <Check config='my-auto' style={style} />
                    <p className="text-lg text-center lg:text-2xl" style={{ color: content.info.textColor }}>{content.info.subTitle}</p>
                  </div>
                )
                : ''
            }
            {
              content.info.subTitle2 && content.info.subTitle2 !== ''
                ? (
                  <div className='flex gap-3'>
                    <Check config='my-auto' style={style} />
                    <p className="text-lg text-center lg:text-2xl" style={{ color: content.info.textColor }}>{content.info.subTitle2}</p>
                  </div>
                )
                : ''
            }
            {
              content.info.subTitle3 && content.info.subTitle3 !== ''
                ? (
                  <div className='flex gap-3'>
                    <Check config='my-auto' style={style} />
                    <p className="text-lg text-center lg:text-2xl" style={{ color: content.info.textColor }}>{content.info.subTitle3}</p>
                  </div>
                )
                : ''
            }
            {
              content.info.subTitle4 && content.info.subTitle4 !== ''
                ? (
                  <div className='flex gap-3'>
                    <Check config='my-auto' style={style} />
                    <p className="text-lg text-center lg:text-2xl" style={{ color: content.info.textColor }}>{content.info.subTitle4}</p>
                  </div>
                )
                : ''
            }
          </div>
        </div>
        {
          content.form && content.form !== ''
            ? (
              <div className='w-full flex lg:w-1/2'>
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
                  <div className={`${style.design === 'Borde' ? 'border' : ''} flex flex-col gap-4 h-fit m-auto w-full p-6 max-w-[500px]`} style={{ boxShadow: style.design === 'Sombreado' ? '0px 3px 10px 3px #11111108' : '', borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '' }}>
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
                                ? <p className='px-2 py-1 bg-red-500 text-white w-fit m-auto'>{error}</p>
                                : ''
                            }
                            {
                              forms?.find(form => form._id === content.form)?.title !== ''
                                ? <p className="text-xl font-medium text-center" style={{ backgroundColor: style.primary, color: style.button }}>{forms?.find(form => form._id === content.form)?.title}</p>
                                : ''
                            }
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
                                    label.type === 'Texto'
                                      ? (
                                        <Input
                                          style={style}
                                          placeholder={label.name}
                                          value={client.data?.find(dat => dat.name === label.name)?.value || client[label.data]}
                                          inputChange={(e: any) => {
                                            if (label.data === 'firstName' || label.data === 'lastName' || label.data === 'email' || label.data === 'phone') {
                                              setClient({ ...client, [label.data]: e.target.value })
                                            } else if (Array.isArray(client.data)) {
                                              const oldData = [...client.data];
                                              const existingData = oldData.find(dat => dat.name === label.name);
                                              if (existingData) {
                                                existingData.value = e.target.value;
                                              } else {
                                                oldData.push({ name: label.data, value: e.target.value });
                                              }
                                              setClient({ ...client, data: oldData });
                                            } else {
                                              setClient({ ...client, data: [{ name: label.data, value: e.target.value }] });
                                            }
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
                                          } else if (Array.isArray(client.data)) {
                                            const oldData = [...client.data];
                                            const existingData = oldData.find(dat => dat.name === label.name);
                                            if (existingData) {
                                              existingData.value = e.target.value;
                                            } else {
                                              oldData.push({ name: label.data, value: e.target.value });
                                            }
                                            setClient({ ...client, data: oldData });
                                          } else {
                                            setClient({ ...client, data: [{ name: label.data, value: e.target.value }] });
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
