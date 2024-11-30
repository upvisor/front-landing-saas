import { IDesign, IService } from '@/interfaces'
import React from 'react'
import { H1, H2, LinkButton, P } from '../ui'

interface Props {
    content: IDesign
    services: IService[]
    index: number
}

export const Services: React.FC<Props> = ({ content, services, index }) => {
  return (
    <div className="flex px-4 py-8 m-auto w-full md:py-12" style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}` }}>
      <div className='flex flex-col gap-8 w-full max-w-[1280px] m-auto'>
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
        <div className='flex gap-8 flex-wrap justify-center'>
          {
            content.services?.length
              ? content.services.map(service => {
                const serviceFind = services?.find(servi => servi._id === service.service)
                if (serviceFind) {
                  return (
                    <div key={service.service} className='flex flex-col gap-2 p-4 rounded-2xl border border-black/5 w-[350px] min-h-60 justify-center' style={{ boxShadow: '0px 3px 20px 3px #11111110' }}>
                      {
                        index === 0
                          ? <h2 className={`text-center font-semibold text-xl lg:text-3xl`} style={{ color: content.info.textColor }}>{serviceFind.name}</h2>
                          : <h3 className={`text-center font-semibold text-lg lg:text-2xl`} style={{ color: content.info.textColor }}>{serviceFind.name}</h3>
                      }
                      <p className='text-center'>{serviceFind.description}</p>
                      <LinkButton url={service.url} config='mx-auto'>Ver más información</LinkButton>
                    </div>
                  )
                }
              })
              : <p className='text-center m-auto'>No tienes servicios seleccionados</p>
          }
        </div>
      </div>
    </div>
  )
}
