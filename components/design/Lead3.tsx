"use client"
import { IClient, IDesign, IForm, IService, IStoreData } from '@/interfaces'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Check, H1, H2, Input, P, Select } from '../ui'
import axios from 'axios'
import Cookies from 'js-cookie'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
    content: IDesign
    index: number
    style?: any
    services?: IService[]
    forms?: IForm[]
    storeData?: IStoreData
    step?: string
}

declare const fbq: Function

export const Lead3: React.FC<Props> = ({ content, index, style, services, forms, storeData, step }) => {
  
  const [question, setQuestion] = useState(-1);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [client, setClient] = useState<IClient>({ email: '', tags: forms?.find(form => form._id === content.form)?.tags, forms: [{ form: forms?.find(form => form._id === content.form)?._id! }] })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

  const toggleQuestion = (i: number) => {
    setQuestion(question === i ? -1 : i);
  };

  const getMaxHeight = (i: number): string => {
    if (contentRefs.current[i]) {
      return question === i ? `${contentRefs.current[i]?.scrollHeight}px` : "0px";
    }
    return "0px";
  };

  const getClientValue = (name: string) => client[name] || client.data?.find(dat => dat.name === name)?.value;

  return (
    <div
      className={`py-10 md:py-20 px-4 m-auto w-full flex`}
      style={{
        background: `${
          content.info.typeBackground === "Degradado"
            ? content.info.background
            : content.info.typeBackground === "Color"
            ? content.info.background
            : ""
        }`,
      }}
    >
      <div className='flex flex-col gap-8 w-full max-w-[1280px] m-auto'>
        {
          content.info.titleForm === 'Logo principal' && storeData?.logo && storeData.logo !== ''
            ? <Link href='/' target='_blank' className='w-fit m-auto'><Image src={storeData.logo} alt={`Logo ${storeData.name}`} width={320} height={150} className='w-44 m-auto lg:w-52' /></Link>
            : content.info.titleForm === 'Logo blanco' && storeData?.logoWhite && storeData.logoWhite !== ''
              ? <Link href='/' target='_blank' className='w-fit m-auto'><Image src={storeData.logoWhite} alt={`Logo ${storeData.name}`} width={320} height={150} className='w-44 m-auto lg:w-52' /></Link>
              : ''
        }
        {content.info.title && content.info.title !== "" || content.info.description && content.info.description !== "" ? (
          <div className="flex flex-col gap-4">
            {content.info.description2 && content.info.description2 !== "" ? (
              <p className='text-xl lg:text-3xl font-medium text-center' style={{ color: content.info.textColor }}>{content.info.description2}</p>
            ) : (
              ""
            )}
            {content.info.title && content.info.title !== "" ? (
              index === 0 ? (
                <H1 text={content.info.title} color={content.info.textColor} config="text-center font-semibold" />
              ) : (
                <H2 text={content.info.title} color={content.info.textColor} config="text-center font-semibold" />
              )
            ) : (
              ""
            )}
            {content.info.description && content.info.description !== "" ? (
              <p className='text-xl lg:text-3xl font-medium text-center underline' style={{ color: content.info.textColor }}>{content.info.description}</p>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
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
          content.info.video !== ''
            ? (
              <div className='flex w-full max-w-[800px] m-auto'>
                <div
                  className="m-auto w-full"
                  style={{
                    position: 'relative',
                    height: 0,
                    paddingBottom: '56.25%', // Ratio 16:9
                    backgroundColor: '#000',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%', // Se ajusta a la pantalla, pero no excede el max-width
                  }}
                >
                  <iframe
                    src={content.info.video}
                    loading="lazy"
                    style={{
                      border: 0,
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    }}
                    allow="accelerometer; gyroscope; encrypted-media; picture-in-picture;"
                    allowFullScreen={true}
                  ></iframe>
                </div>
              </div>
            )
            : ''
        }
        {
          content.form && content.form !== ''
            ? (
              <div className={`w-full flex`}>
                <form className="flex w-full" onSubmit={async (e: any) => {
                  e.preventDefault()
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
                            <p className="text-xl font-medium text-center" style={{ color: style.primary }}>{forms?.find(form => form._id === content.form)?.title}</p>
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
  );
};