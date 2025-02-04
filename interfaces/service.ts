import { IBanner } from "./design"

export interface IService {
    _id?: string
    name: string
    description?: string
    steps: { _id?: string, step: string, slug?: string }[]
    typeService: string
    typePrice: string
    price?: string
    anualPrice?: string
    plans?: IPlans
    tags?: string[]

    createdAt?: Date
    updatedAt?: Date
}

export interface IPlans {
    functionalities: string[]
    plans: IPlan[]
}

export interface IPlan {
    _id?: string
    name: string
    description?: string
    price: string
    anualPrice?: string
    level2?: string
    anualLevel2?: string
    level3?: string
    anualLevel3?: string
    level4?: string
    anualLevel4?: string
    level5?: string
    anualLevel5?: string
    level6?: string
    anualLevel6?: string
    functionalities?: { name: string, value: string }[]
    characteristics?: string[]
}

export interface IStepService {
    _id?: string
    step: string
    slug?: string
    metaTitle?: string
    metaDescription?: string
    image?: string
    design?: { content: string, meetings?: string[], meeting?: string, form?: string, service?: { service: string, plan?: string }, services?: { service: string, url: string }[], info: IInfoService }[]
}

export interface IInfoService {
    title?: string
    subTitle?: string
    description?: string
    image?: string
    titleForm?: string
    button?: string
    buttonLink?: string
    subTitle2?: string
    description2?: string
    button2?: string
    buttonLink2?: string
    subTitle3?: string
    description3?: string
    button3?: string
    buttonLink3?: string
    subTitle4?: string
    descriptionView?: boolean
    products?: string
    video?: string
    banner?: IBanner[]
    typeBackground?: string
    background?: string
    textColor?: string
    faq?: [{ question?: string, response?: string }]
    blocks?: [{ title?: string, description?: string, buttonText?: string, buttonLink?: string }]
    reviews?: [{ review?: string, stars?: string, name?: string }]
    form?: { type: string, text:  string, name: string, data: string, datas?: string[] }[]
}