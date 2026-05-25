import React from 'react'

interface CodeBlockProps {
  readonly title: string
  readonly lang: string
  readonly highlightedHtml: string // El HTML con los tokens de color ya procesados por Shiki
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ title, lang, highlightedHtml }) => {
  return (
    <div className='border-border-subtle bg-canvas-base my-4 w-full overflow-hidden rounded-md border font-sans'>
      {/* Barra superior de la ventana */}
      <div className='bg-surface-variant border-border-subtle flex items-center justify-between border-b px-4 py-2'>
        <span className='text-secondary font-mono text-xs'>{title}</span>
        <span className='bg-border-subtle text-text-primary rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase'>
          {lang}
        </span>
      </div>

      {/* Contenedor del código estructurado */}
      <div
        className='overflow-x-auto p-4 font-mono text-sm leading-6 select-text'
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
    </div>
  )
}
