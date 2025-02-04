"use client"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import styles from "./Slider.module.css"
import { Navigation, Pagination } from "swiper/modules"
import Link from "next/link"
import Image from 'next/image'
import { Button, H1, H2, P } from "../ui"
import { Design, ICall, IClient, IForm, IInfo, IPayment } from "@/interfaces"
import { useState } from "react"
import { PopupPage } from "../design"

export const Slider = ({ info, index, forms, calls, design, payment, style }: { info: IInfo, index: any, forms: IForm[], calls: ICall[], design: Design, payment: IPayment, style?: any }) => {

  const [popup, setPopup] = useState({ view: 'hidden', opacity: 'opacity-0', mouse: false })
  const [content, setContent] = useState('')

  return (
    <>
      <PopupPage popup={popup} setPopup={setPopup} content={content} design={design} calls={calls} forms={forms} payment={payment} />
      <div>
        <Swiper
          className={styles.mySwiper}
          slidesPerView={1}
          loop={true}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination, Navigation]}
        >
          {
            info.banner
              ? info.banner.map(banner => (
                <SwiperSlide key={banner.title}>
                  <div className={`flex h-[450px] md:h-[550px] 2xl:h-[700px]`}>
                    <div className="m-auto w-full p-4">
                      <div className='max-w-[1280px] w-full m-auto flex flex-col gap-3'>
                        {
                          index === 0
                            ? <H1 config="text-white font-semibold" text={banner.title} />
                            : <H2 config="text-white font-semibold" text={banner.title} />
                        }
                        <P text={banner.description} config="text-white" />
                        {
                          banner.buttonLink === 'Abrir popup' || calls.find(call => call._id === banner.buttonLink) || forms.find(form => form._id === banner.buttonLink)
                            ? <Button action={(e: any) => {
                              e.preventDefault()
                              setContent(banner.buttonLink!)
                              setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                              setTimeout(() => {
                                setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                              }, 10);
                            }} style={style}>{banner.button}</Button>
                            : banner.buttonLink === '' || banner.button === ''
                              ? ''
                              : <Link href={`${banner.buttonLink}`}><Button style={style}>{banner.button}</Button></Link>
                        }
                      </div>
                    </div>
                    <Image width={1920} height={1080} className={`absolute object-cover h-full w-full -z-10`} src={banner.image!} alt='banner' />
                  </div>
                </SwiperSlide>
              ))
              : ''
          }
        </Swiper>
      </div>
    </>
  )
}