import { ContactPage } from "@/components/contact"
import { Slider } from "@/components/home"
import { Subscribe } from "@/components/ui"
import { Design } from "@/interfaces"
import { Block1, Block2, Block3, Block4, Block5, Block7, Blocks, Call, Calls, Checkout, Faq, Form, Lead1, Lead2, Lead3, Plans, Services, Table, Video } from '@/components/design'

export const revalidate = 3600

async function fetchDesign () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`)
  return res.json()
}

async function fetchForms () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forms`)
  return res.json()
}

async function fetchCalls () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calls`)
  return res.json()
}

async function fetchServices () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`)
  return res.json()
}

async function fetchStoreData () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store-data`)
  return res.json()
}

async function fetchPayment () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment`)
  return res.json()
}

async function fetchStyle () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/style`)
  return res.json()
}

export async function generateMetadata() {
  const design: Design = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`, { next: { revalidate: 3600 } }).then((res) => res.json())
  const home = design.pages?.find(page => page.page === 'Inicio')
  return {
    title: home?.metaTitle && home?.metaTitle !== '' ? home?.metaTitle : '',
    description: home?.metaDescription && home?.metaDescription !== '' ? home?.metaDescription : '',
    openGraph: {
      title: home?.metaTitle && home?.metaTitle !== '' ? home?.metaTitle : '',
      description: home?.metaDescription && home?.metaDescription !== '' ? home?.metaDescription : '',
      url: `${process.env.NEXT_PUBLIC_WEB_URL}/`,
      images: [home?.image && home.image !== '' ? home.image : '']
    }
  }
}

export default async function Home() {

  const designData = fetchDesign()

  const formsData = fetchForms()

  const callsData = fetchCalls()

  const servicesData = fetchServices()

  const storeDataData = fetchStoreData()

  const paymentData = fetchPayment()

  const styleData = fetchStyle()

  const [design, forms, calls, services, storeData, payment, style] = await Promise.all([designData, formsData, callsData, servicesData, storeDataData, paymentData, styleData])

  return (
    <div className="flex flex-col">
      {
        design.pages?.map((page: any) => {
          if (page.page === 'Inicio') {
            return (
              <>
                {
                  page.design.map((content: any, index: any) => {
                    if (content.content === 'Carrusel') {
                      return <Slider key={content.content} info={content.info} index={index} calls={calls} forms={forms} design={design} payment={payment} style={style} />
                    } else if (content.content === 'Bloque 1') {
                      return <Block1 key={content.content} content={content} index={index} calls={calls} forms={forms} design={design} payment={payment} style={style} />
                    } else if (content.content === 'Bloque 2') {
                      return <Block2 key={content.content} content={content} index={index} calls={calls} forms={forms} design={design} payment={payment} style={style} />
                    } else if (content.content === 'Bloque 3') {
                      return <Block3 key={content.content} content={content} index={index} calls={calls} forms={forms} design={design} payment={payment} style={style} storeData={storeData} />
                    } else if (content.content === 'Bloque 4') {
                      return <Block4 key={content.content} content={content} index={index} calls={calls} forms={forms} design={design} payment={payment} style={style} />
                    } else if (content.content === 'Bloque 5') {
                      return <Block5 key={content.content} content={content} index={index} calls={calls} forms={forms} design={design} payment={payment} style={style} />
                    } else if (content.content === 'Contacto') {
                      return <ContactPage key={content.content} info={ content.info } index={index} style={style} />
                    } else if (content.content === 'Suscripción') {
                      return <Subscribe key={content.content} info={ content.info } style={style} />
                    } else if (content.content === 'Lead 1') {
                      return <Lead1 key={content.content} content={content} forms={forms} index={index} services={services} style={style} />
                    } else if (content.content === 'Video') {
                      return <Video key={content.content} content={content} index={index} storeData={storeData} />
                    } else if (content.content === 'Agendar llamada') {
                      return <Call key={content.content} calls={calls} content={content} services={services} payment={payment} storeData={storeData} index={index} style={style} />
                    } else if (content.content === 'Bloque 7') {
                      return <Block7 key={content.content} content={content} />
                    } else if (content.content === 'Llamadas') {
                      return <Calls key={content.content} content={content} calls={calls} style={style} index={index} />
                    } else if (content.content === 'Checkout') {
                      return <Checkout key={content.content} content={content} services={services} payment={payment} storeData={storeData} style={style} index={index} />
                    } else if (content.content === 'Lead 2') {
                      return <Lead2 key={content.content} content={content} forms={forms} index={index} services={services} storeData={storeData} style={style} />
                    } else if (content.content === 'Servicios') {
                      return <Services key={content.content} content={content} services={services} index={index} style={style} />
                    } else if (content.content === 'Planes') {
                      return <Plans key={content.content} content={content} services={services} index={index} payment={payment} style={style} forms={forms} />
                    } else if (content.content === 'Preguntas frecuentes') {
                      return <Faq key={content.content} content={content} services={services} index={index} />
                    } else if (content.content === 'Lead 3') {
                      return <Lead3 key={content.content} content={content} services={services} index={index} style={style} forms={forms} storeData={storeData} />
                    } else if (content.content === 'Tabla comparativa') {
                      return <Table key={content.content} content={content} services={services} index={index} payment={payment} style={style} />
                    } else if (content.content === 'Bloques') {
                      return <Blocks key={content.content} content={content} index={index} style={style} />
                    } else if (content.content === 'Formulario') {
                      return <Form key={content.content} content={content} index={index} style={style} forms={forms} />
                    }
                  })
                }
              </>
            )
          }
        })
      }
    </div>
  )
}
