"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Button, H1, H2, P } from '../ui'
import Link from 'next/link'
import Image from 'next/image'
import { Design, ICall, IDesign, IForm, IPayment } from '@/interfaces'
import { PopupPage } from './PopupPage'

export const Block2 = ({ content, index, calls, forms, design, payment, style }: { content: IDesign, index: any, forms: IForm[], calls: ICall[], design: Design, payment: IPayment, style?: any }) => {

  const [popup, setPopup] = useState({ view: 'hidden', opacity: 'opacity-0', mouse: false })
  const [cont, setCont] = useState('')
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageLoaded2, setImageLoaded2] = useState(false)
  const imageRef = useRef(null)
  const imageRef2 = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageLoaded(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.7 } // Detecta cuando el 30% de la imagen es visible
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageLoaded2(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.7 } // Detecta cuando el 30% de la imagen es visible
    );

    if (imageRef2.current) {
      observer.observe(imageRef2.current);
    }

    return () => {
      if (imageRef2.current) {
        observer.unobserve(imageRef2.current);
      }
    };
  }, []);

  return (
    <>
      <PopupPage popup={popup} setPopup={setPopup} content={cont} design={design} calls={calls} forms={forms} payment={payment} style={style} />
      <div key={content.content} className={`py-10 md:py-20 w-full flex px-4`} style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}` }}>
        <div className={`w-full flex max-w-[1280px] ${content.info?.image && content.info.image !== '' ? 'gap-8 lg:gap-16' : ''} m-auto flex-col text-center md:flex-row md:text-left`}>
          <div className="w-full hidden md:w-1/2 md:flex">
            {
              content.info?.image && content.info.image !== ''
                ? <Image ref={imageRef2} className={`${imageLoaded2 ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 h-fit m-auto`} style={{ boxShadow: style.design === 'Sombreado' ? `0px 3px 20px 3px ${style.borderColor}10` : '', borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '', border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '' }} width={1080} height={1080} alt='Imagen slider prueba' src={content.info.image} />
                : ''
            }
          </div>
          <div className="w-full m-auto flex flex-col gap-3 md:w-1/2">
            {
              index === 0
                ? <H1 text={content.info.title} color={content.info.textColor} /> 
                : <H2 text={content.info.title} color={content.info.textColor} />
            }
            <P text={content.info.description} color={content.info.textColor} />
            {
              content.info.buttonLink === 'Abrir popup' || calls.find(call => call._id === content.info.buttonLink) || forms.find(form => form._id === content.info.buttonLink)
                ? <Button action={(e: any) => {
                  e.preventDefault()
                  setCont(content.info.buttonLink!)
                  setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                  setTimeout(() => {
                    setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                  }, 10);
                }} config='mx-auto lg:m-0' style={style}>{content.info.button}</Button>
                : content.info.buttonLink === '' || content.info.button === ''
                  ? ''
                  : <Link href={`${content.info.buttonLink}`}><Button style={style}>{content.info.button}</Button></Link>
            }
          </div>
          <div className="w-full flex md:w-1/2 md:hidden">
            {
              content.info?.image && content.info.image !== ''
                ? <Image ref={imageRef} className={`${imageLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 h-fit m-auto`} style={{ boxShadow: style.design === 'Sombreado' ? `0px 3px 20px 3px ${style.borderColor}10` : '', borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '', border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '' }} width={1080} height={1080} alt='Imagen slider prueba' src={content.info.image} />
                : ''
            }
          </div>
        </div>
      </div>
    </>
  )
}
