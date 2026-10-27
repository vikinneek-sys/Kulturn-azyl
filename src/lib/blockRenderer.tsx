'use client'

import Image from 'next/image'
import { useState } from 'react'
import type React from 'react'
import { formatPhotoCredit } from '@/lib/formatPhotoCredit'

type HeadingBlock = {
  blockType: 'heading'
  text: string
  level?: 'h2' | 'h3'
}

type ParagraphBlock = {
  blockType: 'paragraph'
  text: string | LexicalDoc
}

type ArticleImage = {
  url: string
  alt?: string
  credit?: string | null
  sizes?: {
    thumbnail?: {
      url?: string | null
    } | null
  } | null
}

type ImageBlock = {
  blockType: 'image'
  image: ArticleImage
  caption?: string
  width?: 'full' | 'normal' | 'small'
}

type TextWithImageBlock = {
  blockType: 'textWithImage'
  image: ArticleImage
  text: string | LexicalDoc
  imagePosition?: 'left' | 'right'
  imageWidth?: 'small' | 'medium' | 'large'
}

type GalleryBlock = {
  blockType: 'gallery'
  images: Array<{
    image: ArticleImage
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
  url?: string
  fields?: {
    url?: string
    newTab?: boolean
  }
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

function renderLexicalChildren(children?: Node[]) {
  return children?.map((child, idx) => renderLexicalNode(child, idx))
}

function getSafeLinkHref(node: Node) {
  const href = node.fields?.url || node.url
  if (!href) return null

  const trimmedHref = href.trim()
  if (/^(https?:|mailto:|tel:)/i.test(trimmedHref)) return trimmedHref
  if (/^[a-z][a-z\d+.-]*:/i.test(trimmedHref)) return null
  return trimmedHref
}

// Legacy richText renderer
function renderLexicalNode(node: Node, key: React.Key): React.ReactNode {
  if (!node) return null

  switch (node.type) {
    case 'text': {
      let content: React.ReactNode = node.text ?? ''
      if (node.format && (node.format & 1) > 0) content = <strong>{content}</strong>
      if (node.format && (node.format & 2) > 0) content = <em>{content}</em>
      if (node.format && (node.format & 4) > 0) content = <s>{content}</s>
      if (node.format && (node.format & 8) > 0) content = <u>{content}</u>
      if (node.format && (node.format & 16) > 0) content = <code>{content}</code>
      if (node.format && (node.format & 32) > 0) content = <sub>{content}</sub>
      if (node.format && (node.format & 64) > 0) content = <sup>{content}</sup>
      return <>{content}</>
    }

    case 'link':
    case 'autolink': {
      const href = getSafeLinkHref(node)
      const children = renderLexicalChildren(node.children)
      if (!href) return <>{children}</>
      return (
        <a
          key={key}
          href={href}
          target={node.fields?.newTab ? '_blank' : undefined}
          rel={node.fields?.newTab ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    }

    case 'heading': {
      const Tag = (node.tag || 'h2') as keyof React.JSX.IntrinsicElements
      return (
        <Tag key={key} className="block-heading">
          {renderLexicalChildren(node.children)}
        </Tag>
      )
    }

    case 'paragraph':
      return (
        <p key={key} className="block-paragraph">
          {renderLexicalChildren(node.children)}
        </p>
      )

    case 'quote':
      return (
        <blockquote key={key}>
          {renderLexicalChildren(node.children)}
        </blockquote>
      )

    case 'list': {
      const Tag = node.listType === 'number' ? 'ol' : 'ul'
      return (
        <Tag key={key}>
          {renderLexicalChildren(node.children)}
        </Tag>
      )
    }

    case 'listitem':
      return (
        <li key={key}>
          {renderLexicalChildren(node.children)}
        </li>
      )

    default:
      return null
  }
}

function renderLexicalDoc(doc: LexicalDoc) {
  const nodes = doc?.root?.children ?? []
  return <div className="blocks-container">{renderLexicalChildren(nodes)}</div>
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
  if (typeof block.text !== 'string' && isLexicalContent(block.text)) {
    return (
      <div key={index} className="block-paragraph">
        {renderLexicalChildren(block.text.root?.children)}
      </div>
    )
  }

  return (
    <p key={index} className="block-paragraph">
      {block.text}
    </p>
  )
}

function renderImage(block: ImageBlock, index: number) {
  const widthClass = block.width ? `image-width-${block.width}` : 'image-width-normal'
  const imageUrl = block.image.sizes?.thumbnail?.url || block.image.url
  const photoCredit = formatPhotoCredit(block.image.credit)

  return (
    <figure key={index} className={`block-image ${widthClass}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt={block.image.alt || 'Obrázek'} />
      {block.caption && <figcaption>{block.caption}</figcaption>}
      {photoCredit && <figcaption className="image-credit">Foto: {photoCredit}</figcaption>}
    </figure>
  )
}

function renderTextWithImage(block: TextWithImageBlock, index: number) {
  const positionClass = block.imagePosition === 'right' ? 'image-right' : 'image-left'
  const widthClass = block.imageWidth ? `image-width-${block.imageWidth}` : 'image-width-medium'
  const imageUrl = block.image.sizes?.thumbnail?.url || block.image.url
  const photoCredit = formatPhotoCredit(block.image.credit)

  return (
    <div key={index} className={`block-text-with-image ${positionClass} ${widthClass}`}>
      <figure className="float-image-figure">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={block.image.alt || 'Obrázek'} className="float-image" />
        {photoCredit && <figcaption className="image-credit">Foto: {photoCredit}</figcaption>}
      </figure>
      <div className="text-content">
        {typeof block.text === 'string' ? (
          <p>{block.text}</p>
        ) : (
          renderLexicalChildren(block.text.root?.children)
        )}
      </div>
    </div>
  )
}

function GalleryBlockRenderer({ block, index }: { block: GalleryBlock; index: number }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!block.images || block.images.length === 0) return null

  const current = block.images[currentIndex]
  const imageUrl = current.image.sizes?.thumbnail?.url || current.image.url
  const photoCredit = formatPhotoCredit(current.image.credit)

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
          src={imageUrl}
          alt={current.image.alt || `Fotografie ${currentIndex + 1}`}
          className="gallery-image"
        />
        {current.caption && <p className="gallery-caption">{current.caption}</p>}
        {photoCredit && <p className="image-credit">Foto: {photoCredit}</p>}
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
      return <GalleryBlockRenderer key={index} block={block} index={index} />
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
