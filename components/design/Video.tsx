"use client"
import React, { useState } from 'react'
import { H1, H2 } from '../ui'
import Link from 'next/link'
import Image from 'next/image'
import { IStoreData } from '@/interfaces'

export const Video = ({ content, index, storeData }: { content: any, index: any, storeData?: IStoreData }) => {

  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`py-10 md:py-20 w-full p-4 flex`} style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}` }}>
      <div className='w-full max-w-[1280px] m-auto flex flex-col gap-6'>
        {
          content.info.titleForm === 'Logo principal' && storeData?.logo && storeData.logo !== ''
            ? <Link href='/' target='_blank' className='w-fit m-auto'><Image src={storeData.logo} alt={`Logo ${storeData.name}`} width={320} height={150} className='w-44 m-auto lg:w-52' /></Link>
            : content.info.titleForm === 'Logo blanco' && storeData?.logoWhite && storeData.logoWhite !== ''
              ? <Link href='/' target='_blank' className='w-fit m-auto'><Image src={storeData.logoWhite} alt={`Logo ${storeData.name}`} width={320} height={150} className='w-44 m-auto lg:w-52' /></Link>
              : ''
        }
        {
          content.info.description && content.info.description !== ''
            ? <p className='text-white bg-main px-4 py-2 w-fit text-base lg:text-lg'>{content.info.description}</p>
            : ''
        }
        {
          index === 0
            ? <H1 text={content.info.title} config='text-center font-semibold' color={content.info.textColor} />
            : <H2 text={content.info.title} config='text-center font-semibold' color={content.info.textColor} />
        }
        <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000' }}><iframe src={content.info.video} loading="lazy" onLoad={() => setIsLoaded(true)} style={{ border: 0, position: 'absolute', top: 0, height: '100%', width: '100%' }} allow="accelerometer;gyroscope;encrypted-media;picture-in-picture;" allowFullScreen={true}></iframe></div>
      </div>
    </div>
  )
}
