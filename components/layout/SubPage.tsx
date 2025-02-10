"use client"
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

interface Props {
    page: any
    setMenu: any
    setIndex: any
    design: any
    style: any
    element1: boolean
    element2: boolean
    element3: boolean
    element4: boolean
    element5: boolean
    element6: boolean
    element7: boolean
    index: any
}

export const SubPage: React.FC<Props> = ({ page, setMenu, setIndex, design, style, element1, element2, element3, element4, element5, element6, element7, index }) => {

  const [subPage, setSubPage] = useState(0)
  const [rotate, setRotate] = useState('rotate-90')
  
  const subPageRef = useRef(null)

  useEffect(() => {
    if (subPageRef.current) {
      setSubPage(rotate === '-rotate-90' ? 30 * page.subPage!.length : 0)
    }
  }, [rotate])

  return (
    <>
      <div key={page.slug} className={`${index === 0 ? element1 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 1 ? element2 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 2 ? element3 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 3 ? element4 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 4 ? element5 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 5 ? element6 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 6 ? element7 ? 'opacity-1' : 'opacity-0 translate-y-4' : ''} transition-all duration-500 font-medium mb-4 flex pb-2 min-w-[250px] border-b`} style={{ borderBottom: `1px solid ${style.borderColor}` }}><Link style={{ color: design.header.textColor }} href={`/${page.slug}`} onClick={() => {
        setMenu('-ml-[350px]')
        setTimeout(() => {
          setIndex('hidden')
        }, 500)
      }}>{page.page}</Link><svg onClick={() => rotate === 'rotate-90' ? setRotate('-rotate-90') : setRotate('rotate-90')} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className={`ml-auto w-4 text-lg text-neutral-500 ${rotate} transition-all duration-300`} xmlns="http://www.w3.org/2000/svg"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg></div>
      {
        page.subPage.length
          ? (
            <div ref={subPageRef} className={`${index === 0 ? element1 ? 'opacity-1' : 'opacity-0 translate-y-5' : index === 1 ? element2 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 2 ? element3 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 3 ? element4 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 4 ? element5 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 5 ? element6 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 6 ? element7 ? 'opacity-1' : 'opacity-0 translate-y-4' : ''} transition-all duration-500 flex flex-col gap-2`} style={{ maxHeight: `${subPage}px`, overflow: 'hidden' }}>
              {
                page.subPage.map((subPage: any) => <Link key={subPage.slug} href={subPage.slug!} style={{ color: design.header.textColor }} onClick={() => {
                  setMenu('-ml-[350px]')
                  setTimeout(() => {
                    setIndex('hidden')
                  }, 500)
                }}>{subPage.page}</Link>)
              }
            </div>
          )
          : ''
      }
    </>
  )
}
