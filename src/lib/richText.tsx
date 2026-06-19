import React from 'react'

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

function renderChildren(children?: Node[]) {
  return children?.map((child, index) => renderNode(child, index)) ?? null
}

function renderText(node: Node, key: React.Key) {
  let content: React.ReactNode = node.text ?? ''

  // Lexical používá bitmask; tady řešíme základ: bold/italic/underline.
  if (node.format && (node.format & 1) > 0) content = <strong>{content}</strong>
  if (node.format && (node.format & 2) > 0) content = <em>{content}</em>
  if (node.format && (node.format & 8) > 0) content = <u>{content}</u>

  return <React.Fragment key={key}>{content}</React.Fragment>
}

function renderNode(node: Node, key: React.Key): React.ReactNode {
  switch (node.type) {
    case 'text':
      return renderText(node, key)
    case 'heading': {
      const Tag = (node.tag || 'h2') as keyof JSX.IntrinsicElements
      return <Tag key={key}>{renderChildren(node.children)}</Tag>
    }
    case 'quote':
      return <blockquote key={key}>{renderChildren(node.children)}</blockquote>
    case 'list': {
      const Tag = node.listType === 'number' ? 'ol' : 'ul'
      return <Tag key={key}>{renderChildren(node.children)}</Tag>
    }
    case 'listitem':
      return <li key={key}>{renderChildren(node.children)}</li>
    case 'paragraph':
      return <p key={key}>{renderChildren(node.children)}</p>
    default:
      return <div key={key}>{renderChildren(node.children)}</div>
  }
}

export function RichText({ content }: { content: LexicalDoc | null | undefined }) {
  const nodes = content?.root?.children ?? []
  return <div className="rich-text">{nodes.map((node, index) => renderNode(node, index))}</div>
}
