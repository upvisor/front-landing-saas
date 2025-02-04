export interface IForm {
    _id?: string
    nameForm: string
    title?: string
    informations: { icon: string, text: string, subText?: string }[]
    labels: { _id?: string, text: string, name: string, data: string, type: string, datas?: string[] }[]
    button: string
    tags?: string[]
    action: string
    redirect?: string
    message?: string
}