'use client'

import Image from 'next/image'
import { useState } from 'react'
import type React from 'react'

type HeadingBlock = {
  blockType: 'heading'
  text: string
  level?: 'h2' | 'h3'
}

type ParagraphBlock = {
  blockType: 'paragraph'
  text: string
}

type ImageBlock = {
  blockType: 'image'
  image: {
    url: string
    alt?: string
  }
  caption?: string
  width?: 'full' | 'normal' | 'small'
}

type TextWithImageBlock = {
  blockType: 'textWithImage'
  image: {
    url: string
    alt?: string
  }
  text: string
  imagePosition?: 'left' | 'right'
  imageWidth?: 'small' | 'medium' | 'large'
}

type GalleryBlock = {
  blockType: 'gallery'
  images: Array<{
    image: {
      url: string
      alt?: string
    }
    caption?: string
  }>
  autoplay?: boolean
  autoplaySpeed?: number
}

type Block = HeadingBlock | ParagraphBlock | ImageBlock | TextWithImageBlock | GalleryBlock

type BlocksContent = Block[]

// Legacy richText format detection
type Node = {
  type?: string
  text?: string
  format?: number
  tag?: string
  children?: Node[]
  listType?: string
}

type LexicalDoc = {
  root?: {
    children?: Node[]
  }
}

function isLexicalContent(content: any): content is LexicalDoc {
  return content && typeof content === 'object' && 'root' in content
}

function isBlocksContent(content: any): content is BlocksContent {
  return Array.isArray(content) && content.length > 0 && 'blockType' in content[0]
}

// Legacy richText renderer
function renderLexicalNode(node: Node, key: React.Key): React.ReactNode {
  if (!node) return null

  switch (node.type) {
    case 'text': {
      let content: React.ReactNode = node.text ?? ''
      if (node.format && (node.format & 1) > 0) content = <strong>{content}</strong>
      if (node.format && (node.format & 2) > 0) content = <em>{content}</em>
      if (node.format && (node.format & 8) > 0) content = <u>{content}</u>
      return <>{content}</>
    }

    case 'heading': {
      const Tag = (node.tag || 'h2') as keyof React.JSX.IntrinsicElements
      return (
        <Tag key={key} className="block-heading">
          {node.children?.map((child, idx) => renderLexicalNode(child, idx))}
        </Tag>
      )
    }

    case 'paragraph':
      return (
        <p key={key} className="block-paragraph">
          {node.children?.map((child, idx) => renderLexicalNode(child, idx))}
        </p>
      )

    case 'quote':
      return (
        <blockquote key={key}>
          {node.children?.map((child, idx) => renderLexicalNode(child, idx))}
        </blockquote>
      )

    case 'list': {
      const Tag = node.listType === 'number' ? 'ol' : 'ul'
      return (
        <Tag key={key}>
          {node.children?.map((child, idx) => renderLexicalNode(child, idx))}
        </Tag>
      )
    }

    case 'listitem':
      return (
        <li key={key}>
          {node.children?.map((child, idx) => renderLexicalNode(child, idx))}
        </li>
      )

    default:
      return null
  }
}

function renderLexicalDoc(doc: LexicalDoc) {
  const nodes = doc?.root?.children ?? []
  return <div className="blocks-container">{nodes.map((node, index) => renderLexicalNode(node, index))}</div>
}

// New blocks renderer
function renderHeading(block: HeadingBlock, index: number) {
  const Tag = (block.level || 'h2') as keyof React.JSX.IntrinsicElements
  return (
    <Tag key={index} className="block-heading">
      {block.text}
    </Tag>
  )
}

function renderParagraph(block: ParagraphBlock, index: number) {
  return (
    <p key={index} className="block-paragraph">
      {block.text}
    </p>
  )
}

function renderImage(block: ImageBlock, index: number) {
  const widthClass = block.width ? `image-width-${block.width}` : 'image-width-normal'

  return (
    <figure key={index} className={`block-image ${widthClass}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={block.image.url} alt={block.image.alt || 'Obrázek'} />
      {block.caption && <figcaption>{block.caption}</figcaption>}
    </figure>
  )
}

function renderTextWithImage(block: TextWithImageBlock, index: number) {
  const positionClass = block.imagePosition === 'right' ? 'image-right' : 'image-left'
  const widthClass = block.imageWidth ? `image-width-${block.imageWidth}` : 'image-width-medium'

  return (
    <div key={index} className={`block-text-with-image ${positionClass} ${widthClass}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={block.image.url} alt={block.image.alt || 'Obrázek'} className="float-image" />
      <div className="text-content">
        <p>{block.text}</p>
      </div>
    </div>
  )
}

function renderGallery(block: GalleryBlock, index: number) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!block.images || block.images.length === 0) return null

  const current = block.images[currentIndex]

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? block.images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === block.images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div key={index} className="block-gallery">
      <div className="gallery-viewer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.image.url}
          alt={current.image.alt || `Fotografie ${currentIndex + 1}`}
          className="gallery-image"
        />
        {current.caption && <p className="gallery-caption">{current.caption}</p>}
      </div>

      {block.images.length > 1 && (
        <div className="gallery-controls">
          <button onClick={goToPrevious} className="gallery-button gallery-prev" aria-label="Předchozí">
            ◀
          </button>
          <div className="gallery-indicators">
            {block.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`indicator ${idx === currentIndex ? 'active' : ''}`}
                aria-label={`Fotografie ${idx + 1}`}
              />
            ))}
          </div>
          <button onClick={goToNext} className="gallery-button gallery-next" aria-label="Další">
            ▶
          </button>
        </div>
      )}

      <p className="gallery-counter">
        {currentIndex + 1} / {block.images.length}
      </p>
    </div>
  )
}

function renderBlock(block: Block, index: number): React.ReactNode {
  switch (block.blockType) {
    case 'heading':
      return renderHeading(block, index)
    case 'paragraph':
      return renderParagraph(block, index)
    case 'image':
      return renderImage(block, index)
    case 'textWithImage':
      return renderTextWithImage(block, index)
    case 'gallery':
      return renderGallery(block, index)
    default:
      return null
  }
}

export function BlockRenderer({ blocks }: { blocks: any }) {
  // Handle legacy richText format (Lexical)
  if (isLexicalContent(blocks)) {
    return renderLexicalDoc(blocks)
  }

  // Handle new blocks format
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return <div className="blocks-container empty">Žádný obsah</div>
  }

  return <div className="blocks-container">{blocks.map((block, index) => renderBlock(block, index))}</div>
}
