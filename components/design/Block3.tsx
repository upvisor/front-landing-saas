"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Button, ButtonSecondary, H1, H2, P } from '../ui'
import Link from 'next/link'
import Image from 'next/image'
import { Design, ICall, IDesign, IForm, IPayment } from '@/interfaces'
import { PopupPage } from './PopupPage'

export const Block3 = ({ content, index, calls, forms, design, payment, style, storeData }: { content: IDesign, index: any, forms: IForm[], calls: ICall[], design: Design, payment: IPayment, style?: any, storeData?: any }) => {

  const [popup, setPopup] = useState({ view: 'hidden', opacity: 'opacity-0', mouse: false })
  const [cont, setCont] = useState('')
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageLoaded(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.7 }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  return (
    <>
      <PopupPage popup={popup} setPopup={setPopup} content={cont} design={design} calls={calls} forms={forms} payment={payment} style={style} />
      <div key={content.content} className={`py-10 md:py-20 w-full flex px-4`} style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}` }}>
        <div className="text-center m-auto max-w-[1280px] w-full flex flex-col gap-8">
          {
            content.info.titleForm === 'Logo principal' && storeData.logo && storeData.logo !== ''
              ? <Link href='/' target='_blank' className='w-fit m-auto'><Image src={storeData.logo} alt={`Logo ${storeData.name}`} width={320} height={150} className='w-44 m-auto lg:w-52' /></Link>
              : content.info.titleForm === 'Logo blanco' && storeData.logoWhite && storeData.logoWhite !== ''
                ? <Link href='/' target='_blank' className='w-fit m-auto'><Image src={storeData.logoWhite} alt={`Logo ${storeData.name}`} width={320} height={150} className='w-44 m-auto lg:w-52' /></Link>
                : ''
          }
          <div className='flex gap-4 flex-col'>
            {
              index === 0
                ? <H1 text={content.info.title} color={content.info.textColor} />
                : <H2 text={content.info.title} color={content.info.textColor} />
            }
            <P text={content.info.description} color={content.info.textColor} />
            <div className='w-fit m-auto flex gap-4 flex-wrap'>
              {
                content.info.buttonLink === 'Abrir popup' || calls.find(call => call._id === content.info.buttonLink) || forms.find(form => form._id === content.info.buttonLink)
                  ? <Button action={(e: any) => {
                    e.preventDefault()
                    setCont(content.info.buttonLink!)
                    setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                    setTimeout(() => {
                      setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                    }, 10);
                  }} config='mx-auto' style={style}>{content.info.button}</Button>
                  : content.info.buttonLink === '' || content.info.button === ''
                    ? ''
                    : <Link href={`${content.info.buttonLink}`} className='mx-auto'><Button style={style}>{content.info.button}</Button></Link>
              }
              {
                content.info.buttonLink2 === 'Abrir popup' || calls.find(call => call._id === content.info.buttonLink2) || forms.find(form => form._id === content.info.buttonLink2)
                  ? <ButtonSecondary action={(e: any) => {
                    e.preventDefault()
                    setCont(content.info.buttonLink2!)
                    setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                    setTimeout(() => {
                      setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                    }, 10);
                  }} config='mx-auto' style={style} content={content}>{content.info.button2}</ButtonSecondary>
                  : content.info.buttonLink2 === '' || content.info.button2 === ''
                    ? ''
                    : <Link href={`${content.info.buttonLink2}`} className='mx-auto'><ButtonSecondary style={style} content={content}>{content.info.button2}</ButtonSecondary></Link>
              }
            </div>
          </div>
          {
            content.info?.image && content.info.image !== ''
              ? <Image ref={imageRef} className={`${imageLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 h-fit m-auto`} style={{ boxShadow: style.design === 'Sombreado' ? `0px 3px 20px 3px ${style.borderColor}10` : '', borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '', border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '' }} width={640} height={360} alt='Imagen slider prueba' src={content.info.image} />
              : ''
          }
        </div>
      </div>
    </>
  )
}
