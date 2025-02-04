"use client"
import React from 'react'

export default function PageBuyError () {

  return (
    <div className='flex px-2'>
      <div className='w-full max-w-[1360px] m-auto py-20 flex flex-col gap-4'>
        <h1 className='text-4xl font-medium'>No se ha realizado el pago correctamente</h1>
        <p className='text-lg'>Lamentablemente el pago de tu compra ha fallado, intentalo de nuevo más tarde</p>
      </div>
    </div>
  )
}