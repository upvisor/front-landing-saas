export interface ICall {
    _id?: string
    type?: string
    nameMeeting: string
    title?: string
    duration: string
    description?: string
    price?: string
    labels?: { _id?: string, text: string, name: string, data: string }[]
    buttonText?: string
    tags?: string[]
    action: string
    message?: string
    redirect?: string
    calendar?: string
}