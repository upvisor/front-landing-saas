"use client"
import Link from 'next/link'
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Design, IPolitics, IStoreData } from '@/interfaces'
import { LinkButton } from '../ui'
import Footer from '../ui/Footer'
import { SubPage } from './'

interface Props {
  design: Design
  storeData: IStoreData
  politics: IPolitics | undefined
  style?: any
}

export const Navbar: React.FC<PropsWithChildren<Props>> = ({ children, design, storeData, politics, style }) => {

  const [menu, setMenu] = useState('-ml-[350px]')
  const [index, setIndex] = useState('hidden')
  const [subPages, setSubPages] = useState(-1)
  const [view, setView] = useState(false)
  const [element1, setElement1] = useState(false)
  const [element2, setElement2] = useState(false)
  const [element3, setElement3] = useState(false)
  const [element4, setElement4] = useState(false)
  const [element5, setElement5] = useState(false)
  const [element6, setElement6] = useState(false)
  const [element7, setElement7] = useState(false)

  const pathname = usePathname()

  useEffect(() => {
    setView(true)
  }, [])

  return (
    <>
      <div className='w-full min-h-screen flex flex-col justify-between'>
      <div>
      {
        pathname !== '/finalizar-compra'
          ? design.header?.topStrip && design.header.topStrip !== ''
            ? (
              <div className='flex pl-2 pr-2 pt-1.5 pb-1.5 text-center sticky z-50' style={{ backgroundColor: design.header?.bgColorTop, color: design.header?.textColorTop }}>
                <p className='m-auto font-medium text-[13px]'>{design.header.topStrip}</p>
              </div>
            )
            : ''
          : ''
      }
      <div style={{ top: '-0.5px' }} className={`${view ? 'opacity-1' : 'opacity-0 -translate-y-16'} transition-all duration-500 sticky flex w-full z-40 flex-col`}>
        <div className={`z-40 m-auto w-full absolute flex justify-between px-2 sm:py-0`} style={{ boxShadow: style.design === 'Sombreado' ? `0px 0px 10px 0px ${style.borderColor}15` : '', backgroundColor: design.header?.bgColor, color: design.header?.textColor, borderBottom: style.design === 'Borde' ? subPages !== -1 ? '' : `1px solid ${style.borderColor}` : '' }}>
          <div className='m-auto w-[1280px] flex justify-between py-1 sm:py-0'>
          <div className='hidden gap-2 sm:flex'>
            {
              storeData?.logo && storeData?.logo !== '' && design.header?.logo === 'Logo'
                ? <Link href='/'><Image className={`w-auto h-[60px] py-1`} src={`${storeData.logo}`} alt='Logo' width={320} height={150} /></Link>
                : storeData?.logoWhite && storeData?.logoWhite !== '' && design.header?.logo === 'Logo blanco'
                  ? <Link href='/'><Image className={`w-auto h-[60px] py-1`} src={`${storeData.logoWhite}`} alt='Logo blanco' width={320} height={150} /></Link>
                  : <Link href='/'><div className='h-[60px] flex'><p className='m-auto text-2xl font-medium'>SITIO WEB</p></div></Link>
            }
          </div>
          {
            pathname !== '/finalizar-compra'
              ? <>
                <div className='hidden gap-6 sm:flex'>
                  {
                    design.pages?.map((page, index) => {
                      if (page.header) {
                        if (page.button) {
                          return (
                            <LinkButton key={page.slug} url={page.slug} config='py-[6px] my-auto' style={style}>{page.page}</LinkButton>
                          )
                        } else {
                          if (page.slug === '') {
                            return (
                              <Link key={page.slug} className='mt-auto flex h-full font-medium mb-auto' href='/'>
                                <div className={`mt-auto ${pathname === '/' ? 'dark:border-white' : 'border-white dark:border-neutral-900 dark:hover:border-white'} transition-colors duration-150 mb-auto`}>{page.page}</div>
                              </Link>
                            )
                          } else {
                            return (
                              <Link key={page.slug} className='mt-auto flex h-full font-medium mb-auto' href={`/${page.slug}`} onMouseEnter={() => page.subPage?.length ? setSubPages(index) : console.log(page)} onMouseLeave={() => setSubPages(-1)} onClick={() => setSubPages(-1)}>
                                <div className={`mt-auto ${pathname.includes(`/${page.slug}`) ? 'dark:border-white' : 'border-white dark:border-neutral-900 dark:hover:border-white'} transition-colors duration-150 mb-auto`}>{page.page}</div>
                              </Link>
                            )
                          }
                        }
                      }
                    })
                  }
                </div>
                <div className='flex px-2 w-full justify-between gap-4 sm:hidden'>
                  <div className='flex gap-4'>
                    {
                      menu === '-ml-[350px]'
                        ? <button onClick={() => {
                            setIndex('flex')
                            setTimeout(() => {
                              setMenu('')
                              setTimeout(() => {
                                setElement1(true)
                                setTimeout(() => {
                                  setElement2(true)
                                  setTimeout(() => {
                                    setElement3(true)
                                    setTimeout(() => {
                                      setElement4(true)
                                      setTimeout(() => {
                                        setElement5(true)
                                        setTimeout(() => {
                                          setElement6(true)
                                          setTimeout(() => {
                                            setElement7(true)
                                          }, 50)
                                        }, 50)
                                      }, 50)
                                    }, 50)
                                  }, 50)
                                }, 50)
                              }, 200)
                            }, 10)
                          }} aria-label='Boton para abrir el menu'>
                          <svg className="w-5" role="presentation" viewBox="0 0 20 14">
                            <path d="M0 14v-1h20v1H0zm0-7.5h20v1H0v-1zM0 0h20v1H0V0z" fill="currentColor"></path>
                          </svg>
                        </button>
                        : <button onClick={() => {
                            setMenu('-ml-[350px]')
                            setTimeout(() => {
                              setIndex('hidden')
                              setElement1(false)
                              setElement2(false)
                              setElement3(false)
                              setElement4(false)
                              setElement5(false)
                              setElement6(false)
                              setElement7(false)
                            }, 500)
                          }} className='flex w-5' aria-label='Boton para cerrar el menu'>
                          <svg className="m-auto w-[17px]" role="presentation" viewBox="0 0 16 14">
                            <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
                          </svg>
                        </button>
                    }
                  </div>
                  <div className='flex gap-2 sm:hidden'>
                    {
                      storeData?.logo && storeData?.logo !== '' && design.header?.logo === 'Logo'
                        ? <Link href='/'><Image className={`w-auto h-[52px] py-0.5`} src={`${storeData.logo}`} alt='Logo' width={320} height={150} /></Link>
                        : storeData?.logoWhite && storeData?.logoWhite !== '' && design.header?.logo === 'Logo blanco'
                          ? <Link href='/'><Image className={`w-auto h-[52px] py-0.5`} src={`${storeData.logoWhite}`} alt='Logo blanco' width={320} height={150} /></Link>
                          : <Link href='/'><div className='h-[52px] flex'><p className='m-auto text-2xl font-medium'>SITIO WEB</p></div></Link>
                    }
                  </div>
                  <div />
                </div>
              </>
              : <div className='flex gap-4 justify-between'>
                <div className='gap-2 flex sm:hidden'>
                  {
                    storeData?.logo && storeData?.logo !== '' && design.header?.logo === 'Logo'
                      ? <Link href='/'><Image className='max-w-[110px] min-w-[110px] py-0.5' src={`${storeData.logo}`} alt='Logo' width={320} height={150} /></Link>
                      : storeData?.logoWhite && storeData?.logoWhite !== '' && design.header?.logo === 'Logo blanco'
                        ? <Link href='/'><Image className='max-w-[110px] min-w-[110px] py-0.5' src={`${storeData.logoWhite}`} alt='Logo blanco' width={320} height={150} /></Link>
                        : <Link href='/'><div className='h-[42px] flex'><p className='m-auto text-2xl font-medium'>SITIO WEB</p></div></Link>
                  }
                </div>
                <Link href='/tienda' className='mt-auto mb-auto text-sm text-neutral-500'>Continuar comprando</Link>
              </div>
          }
          </div>
        </div>
        <div className={`${index} w-full ${menu === '' ? 'bg-black/30' : ''} transition-colors duration-500 absolute z-30 justify-between 530:hidden`} style={{ top: '60px', height: 'calc(100vh - 49px)' }}>
          <div className={`${menu} flex flex-col p-4 shadow-md transition-all duration-500 overflow-hidden`} style={{ backgroundColor: design.header?.bgColor }}>
            {
              design.pages?.filter(page => page.header).map((page, index) => {
                if (page.button) {
                  return (
                    <LinkButton key={page.slug} url={page.slug} config={`${index === 0 ? element1 ? 'opacity-1' : 'opacity-0 translate-y-5' : index === 1 ? element2 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 2 ? element3 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 3 ? element4 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 4 ? element5 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 5 ? element6 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 6 ? element7 ? 'opacity-1' : 'opacity-0 translate-y-4' : ''} transition-all duration-500 py-[6px] mx-auto mb-4`} style={style} click={() => {
                      setMenu('-ml-[350px]')
                      setTimeout(() => {
                        setIndex('hidden')
                        setElement1(false)
                        setElement2(false)
                        setElement3(false)
                        setElement4(false)
                        setElement5(false)
                        setElement6(false)
                        setElement7(false)
                      }, 500)
                    }}>{page.page}</LinkButton>
                  )
                } else {
                  if (page.subPage?.length) {
                    return <SubPage key={page.slug} page={page} setMenu={setMenu} setIndex={setIndex} design={design} style={style} element1={element1} element2={element2} element3={element3} element4={element4} element5={element5} element6={element6} element7={element7} index={index} />
                  } else {
                    return (
                      <Link key={page.slug} className={`${index === 0 ? element1 ? 'opacity-1' : 'opacity-0 translate-y-5' : index === 1 ? element2 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 2 ? element3 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 3 ? element4 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 4 ? element5 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 5 ? element6 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 6 ? element7 ? 'opacity-1' : 'opacity-0 translate-y-4' : ''} transition-all duration-500 font-medium mb-4 flex pb-2 min-w-[250px] border-b`} style={{ color: design.header?.textColor, borderBottom: `1px solid ${style.borderColor}` }} onClick={() => {
                        setMenu('-ml-[350px]')
                        setTimeout(() => {
                          setIndex('hidden')
                          setElement1(false)
                          setElement2(false)
                          setElement3(false)
                          setElement4(false)
                          setElement5(false)
                          setElement6(false)
                          setElement7(false)
                        }, 500)
                      }} href={`/${page.slug}`}>{page.page}<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="ml-auto w-4 text-lg text-neutral-500" xmlns="http://www.w3.org/2000/svg"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg></Link>
                    )
                  }
                }
              })
            }
          </div>
          <div className='h-full' style={{ width: 'calc(100% - 284px)' }} onClick={() => {
            setMenu('-ml-[350px]')
            setTimeout(() => {
              setIndex('hidden')
              setElement1(false)
              setElement2(false)
              setElement3(false)
              setElement4(false)
              setElement5(false)
              setElement6(false)
              setElement7(false)
            }, 500)
          }} />
        </div>
        <div className={`${subPages !== -1 ? 'top-0' : '-mt-[130px]'} transition-all duration-500 z-30 w-full p-6 flex absolute h-32`} style={{ top: '52px', boxShadow: style.design === 'Sombreado' ? '0px 0px 10px 0px #11111115' : '', backgroundColor: design.header?.bgColor, color: design.header?.textColor, border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '' }} onMouseEnter={() => setSubPages(subPages)} onMouseLeave={() => setSubPages(-1)}>
          <div className='m-auto flex gap-6'>
            {
              subPages !== -1 ? design.pages[subPages].subPage?.map(subPage => <Link key={subPage.slug} href={subPage.slug!} className='text-lg' onClick={() => setSubPages(-1)}>{subPage.page}</Link>) : ''
            }
          </div>
        </div>
      </div>
      { children }
      </div>
      <Footer storeData={storeData} politics={politics} design={design} />
    </div>
    </>
  )
}
