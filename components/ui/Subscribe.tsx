"use client"
import { IInfo } from "@/interfaces"
import { SubscribePage } from "."

export const Subscribe = ({ info, style }: { info: IInfo, style?: any }) => {

  return (
    <SubscribePage info={info} style={style} />
  )
}