"use client"
import { IDesign } from '@/interfaces'
import React, { useRef, useState } from 'react'
import { Button, H1, H2, H3, LinkButton, P } from '../ui'

interface Props {
    content: IDesign
    index: number
    style?: any
}

export const Blocks: React.FC<Props> = ({ content, index, style }) => {
  const [question, setQuestion] = useState(-1);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);

  const toggleQuestion = (i: number) => {
    setQuestion(question === i ? -1 : i);
  };

  const getMaxHeight = (i: number): string => {
    if (contentRefs.current[i]) {
      return question === i ? `${contentRefs.current[i]?.scrollHeight}px` : "0px";
    }
    return "0px";
  };

  return (
    <div
      className={`py-10 md:py-20 px-4 m-auto w-full flex`}
      style={{
        background: `${
          content.info.typeBackground === "Degradado"
            ? content.info.background
            : content.info.typeBackground === "Color"
            ? content.info.background
            : ""
        }`,
      }}
    >
      <div className='flex flex-col gap-8 w-full max-w-[1280px] m-auto'>
        {content.info.title && content.info.title !== "" || content.info.description && content.info.description !== "" ? (
          <div className="flex flex-col gap-4">
            {content.info.title && content.info.title !== "" ? (
              index === 0 ? (
                <H1 text={content.info.title} color={content.info.textColor} config="text-center font-semibold" />
              ) : (
                <H2 text={content.info.title} color={content.info.textColor} config="text-center font-semibold" />
              )
            ) : (
              ""
            )}
            {content.info.description && content.info.description !== "" ? (
              <P config="text-center" text={content.info.description} color={content.info.textColor} />
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        <div className='flex gap-6 justify-around flex-wrap'>
          {content.info.blocks?.map((block, i) => (
            <div
            key={i}
            className={`${style.design === 'Borde' ? 'border' : ''} flex flex-col p-6 w-full max-w-96 min-h-48 lg:min-h-56`}
            style={{
              boxShadow: style.design === 'Sombreado' ? `0px 3px 20px 3px ${style.borderColor}10` : '',
              borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '',
              border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '',
            }}
          >
            <div className='flex flex-col gap-2 m-auto'>
              {block.title && block.title !== "" ? (
                index === 0 ? (
                    <H2 text={block.title} color={content.info.textColor} config="text-center font-semibold" />
                ) : (
                    <H3 text={block.title} color={content.info.textColor} config="text-center font-semibold" />
                )
                ) : (
                ""
              )}
              <p className="text-center" style={{ color: content.info.textColor }}>{block.description}</p>
              {
                block.buttonLink && block.buttonLink !== '' && block.buttonText && block.buttonText !== ''
                  ? <LinkButton url={block.buttonLink} style={style} config='mx-auto'>{block.buttonText}</LinkButton>
                  : ''
              }
            </div>
          </div>
          ))}
        </div>
      </div>
    </div>
  );
};