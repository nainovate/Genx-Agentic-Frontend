// import { Separator } from '@/components/ui/separator'
// import { UIState } from '@/lib/chat/actions'
// import { Session } from '@/lib/types'
// import Link from 'next/link'
// import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
// import { BotCard } from './stocks'
// import { dotStream } from 'ldrs'
// import { useTheme } from 'next-themes'




// dotStream.register()

// export interface ChatList {
//   messages: UIState
//   show: boolean
//   session?: Session
//   isShared: boolean
// }

// export function ChatList({ messages, show, session, isShared }: ChatList) {
//   if (!messages.length) {
//     return null
//   }
// const { theme } = useTheme()
//   return (
//     <div className="relative mx-auto max-w-2xl px-4">
//       {!isShared && !session ? (
//         <>
//           <div className="group relative mb-4 flex items-start md:-ml-12">
//             <div className="bg-background flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border shadow-sm">
//               <ExclamationTriangleIcon />
//             </div>
//             <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
//               <p className="text-muted-foreground leading-normal">
//                 Please{' '}
//                 <Link href="/login" className="underline">
//                   log in
//                 </Link>{' '}
//                 or{' '}
//                 <Link href="/signup" className="underline">
//                   sign up
//                 </Link>{' '}
//                 to save and revisit your chat history!
//               </p>
//             </div>
//           </div>
//           <Separator className="my-4" />
//         </>
//       ) : null}

//       {messages.map((message, index) => (
//         <div key={message.id}>
//           {message.display}
//           {index < messages.length - 1 && <Separator className="my-4" />}
//         </div>
//       ))}
//       {show && (<div>
//         <Separator className="my-4" />
//         <BotCard >
//           <l-dot-stream
//             size="40"
//             speed="2.5"
//             color={theme?.includes('dark')?'white':'black'}
//           ></l-dot-stream>
//         </BotCard>
//       </div>)}
//     </div>
//   )
// }



// Enhanced ChatList.tsx
import { Separator } from '@/components/ui/separator'
import { UIState } from '@/lib/chat/actions'
import { Session } from '@/lib/types'
import Link from 'next/link'
import { ExclamationTriangleIcon, FileTextIcon, DownloadIcon, CopyIcon, Cross2Icon } from '@radix-ui/react-icons'
import { BotCard } from './stocks'
import { dotStream } from 'ldrs'
import { useTheme } from 'next-themes'
import { useState, useRef, useEffect } from 'react'
import { useSidebar } from '@/lib/hooks/use-sidebar'
import { ChatPanel } from '@/components/chat-panel'


// import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'


dotStream.register()

export interface ChatList {
  messages: UIState
  show: boolean
  session?: Session
  isShared: boolean
  sessionId: string
  taskInfo: any
  id?: any
  title?: string
  input: string
  setShow: (value: boolean) => void
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
  questions: any
}

interface DocumentData {
  id: string
  title: string
  content: string
  type: string
  messageId: string
  isOpen: boolean
}

// Document triggers for detection
const documentTriggers = [
  'write a document', 'write document', 'create document', 'draft document',
  'compose document', 'generate document', 'write', 'create', 'draft',
  'compose', 'generate', 'document', 'letter', 'email', 'report', 'article',
  'essay', 'story', 'script', 'code', 'template', 'proposal', 'summary',
  'outline', 'plan', 'invoice', 'contract', 'memo'
]

export function ChatList({ messages, show, session, isShared, sessionId,
  taskInfo,
  id,
  title,
  setShow,
  input,
  setInput,
  isAtBottom,
  scrollToBottom,
  questions }: ChatList) {
  const { theme } = useTheme()
  const { toggleSidebar } = useSidebar()

  const [documents, setDocuments] = useState<DocumentData[]>([])
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollTobottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollTobottom()
  }, [messages, documents])

  // Check if backend response contains document data
  const checkForDocumentInResponse = (content: string): any => {
    try {
      // Check if response contains document markers or specific patterns
      if (content.includes('DOCUMENT_CREATED:') || content.includes('document_data:')) {
        // Parse document data from response
        const docMatch = content.match(/DOCUMENT_CREATED:\s*({.*?})/s)
        if (docMatch) {
          return JSON.parse(docMatch[1])
        }
      }

      // Alternative: Check for document triggers in user message and auto-generate
      const contentLower = content.toLowerCase().trim()
      if (documentTriggers.some(trigger => contentLower.includes(trigger))) {
        return {
          title: generateDocumentTitle(content),
          content: generateDocumentContent(content),
          type: getDocumentType(content)
        }
      }
    } catch (error) {
      console.error('Error parsing document data:', error)
    }
    return null
  }

  const generateDocumentTitle = (content: string): string => {
    const contentLower = content.toLowerCase().trim()
    if (contentLower.includes('email')) return 'Email Draft'
    if (contentLower.includes('letter')) return 'Letter Draft'
    if (contentLower.includes('report')) return 'Report Draft'
    if (contentLower.includes('article')) return 'Article Draft'
    if (contentLower.includes('essay')) return 'Essay Draft'
    if (contentLower.includes('story')) return 'Story Draft'
    if (contentLower.includes('script')) return 'Script Draft'
    if (contentLower.includes('code')) return 'Code Document'
    if (contentLower.includes('template')) return 'Template Draft'
    if (contentLower.includes('proposal')) return 'Proposal Draft'
    if (contentLower.includes('plan')) return 'Plan Document'
    if (contentLower.includes('invoice')) return 'Invoice Draft'
    if (contentLower.includes('contract')) return 'Contract Draft'
    if (contentLower.includes('memo')) return 'Memo Draft'
    return `Document - ${new Date().toLocaleTimeString()}`
  }

  const getDocumentType = (content: string): string => {
    const contentLower = content.toLowerCase().trim()
    if (contentLower.includes('email')) return 'email'
    if (contentLower.includes('letter')) return 'letter'
    if (contentLower.includes('report')) return 'report'
    if (contentLower.includes('code')) return 'code'
    return 'document'
  }

  const generateDocumentContent = (content: string): string => {
    const contentLower = content.toLowerCase().trim()

    if (contentLower.includes('email')) {
      return `Subject: Your Subject Here

Dear Recipient,

I hope this email finds you well. I am writing to discuss...

Thank you for your time and consideration.

Best regards,
Your Name`
    } else if (contentLower.includes('report')) {
      return `# Report Title

## Executive Summary
Brief overview of the report's key findings...

## Introduction
Background information and purpose...

## Key Findings
- Finding 1
- Finding 2
- Finding 3

## Conclusion
Summary and final thoughts...`
    } else if (contentLower.includes('proposal')) {
      return `# Business Proposal

## Project Overview
Description of the proposed project...

## Problem Statement
Current challenge or opportunity...

## Proposed Solution
Detailed explanation of approach...

## Benefits
- Benefit 1
- Benefit 2
- Benefit 3`
    } else if (contentLower.includes('invoice')) {
      return `INVOICE

Invoice #: INV-001
Date: ${new Date().toLocaleDateString()}

Bill To:
[Client Name]
[Client Address]

Description                 Quantity    Rate    Amount
------------------------   ----------  ------  --------
[Service/Product]              1       $0.00   $0.00

                                      Total: $0.00`
    } else {
      return `# ${generateDocumentTitle(content)}

## Introduction
This document addresses: "${content}"

## Main Content
Main body of your document. Edit this section to include your specific content...

## Conclusion
Summary and closing thoughts...

## Additional Notes
Add any references or additional information here...`
    }
  }

  // Process messages to detect document creation
  useEffect(() => {
    messages.forEach((message) => {
      const content = extractMessageContent(message)
      const documentData = checkForDocumentInResponse(content)

      if (documentData && !documents.some(doc => doc.messageId === message.id)) {
        const newDocument: DocumentData = {
          id: `doc-${message.id}`,
          title: documentData.title,
          content: documentData.content,
          type: documentData.type || 'document',
          messageId: message.id,
          isOpen: false
        }

        setDocuments(prev => [...prev, newDocument])
      }
    })
  }, [messages])

  const extractMessageContent = (message: any): string => {
    if (typeof message.display === 'string') {
      return message.display
    }

    if (message.display?.props?.children) {
      if (typeof message.display.props.children === 'string') {
        return message.display.props.children
      }
      if (Array.isArray(message.display.props.children)) {
        return message.display.props.children.join(' ')
      }
    }

    return ''
  }

  const openDocument = (documentId: string) => {
    setDocuments(prev => prev.map(doc =>
      doc.id === documentId ? { ...doc, isOpen: true } : doc
    ))
    setActiveDocumentId(documentId)
    toggleSidebar()
  }

  const closeDocument = (documentId: string) => {
    setDocuments(prev => prev.map(doc =>
      doc.id === documentId ? { ...doc, isOpen: false } : doc
    ))
    if (activeDocumentId === documentId) {
      setActiveDocumentId(null)
      toggleSidebar()
    }
  }

  const updateDocumentContent = (documentId: string, content: string) => {
    setDocuments(prev => prev.map(doc =>
      doc.id === documentId ? { ...doc, content } : doc
    ))
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const downloadDocument = (doc: DocumentData) => {
    const element = document.createElement('a')
    const file = new Blob([doc.content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${doc.title}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const getDocumentForMessage = (messageId: string) => {
    return documents.find(doc => doc.messageId === messageId)
  }

  const activeDocument = documents.find(doc => doc.id === activeDocumentId && doc.isOpen)

  return (
    <div className="flex h-[92vh] bg-background">
      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="relative mx-auto max-w-2xl px-4 py-4">
            {!isShared && !session ? (
              <>
                <div className="group relative mb-4 flex items-start md:-ml-12">
                  <div className="bg-background flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border shadow-sm">
                    <ExclamationTriangleIcon />
                  </div>
                  <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
                    <p className="text-muted-foreground leading-normal">
                      Please{' '}
                      <Link href="/login" className="underline">
                        log in
                      </Link>{' '}
                      or{' '}
                      <Link href="/signup" className="underline">
                        sign up
                      </Link>{' '}
                      to save and revisit your chat history!
                    </p>
                  </div>
                </div>
                <Separator className="my-4" />
              </>
            ) : null}

            {messages.map((message, index) => {
              const documentForMessage = getDocumentForMessage(message.id)

              return (
                <div key={message.id}>
                  <div className="group relative">
                    {message.display}

                    {/* Document Box for messages with documents */}
                    {documentForMessage && (
                      <div className="mt-3 p-3 bg-card border rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileTextIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{documentForMessage.title}</span>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              {documentForMessage.type}
                            </span>
                          </div>
                          <button
                            onClick={() => openDocument(documentForMessage.id)}
                            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded transition-colors"
                          >
                            <FileTextIcon className="w-3 h-3" />
                            Open Editor
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {documentForMessage.content.substring(0, 100)}...
                        </p>
                      </div>
                    )}
                  </div>
                  {index < messages.length - 1 && <Separator className="my-4" />}
                </div>
              )
            })}

            {show && (
              <div>
                <Separator className="my-4" />
                <BotCard>
                  <l-dot-stream
                    size="40"
                    speed="2.5"
                    color={theme?.includes('dark') ? 'white' : 'black'}
                  ></l-dot-stream>
                </BotCard>
              </div>
            )}
            <div ref={messagesEndRef} />
            {/* <ButtonScrollToBottom
              isAtBottom={isAtBottom}
              scrollToBottom={scrollToBottom}
            /> */}
          </div>
          <ChatPanel
            sessionId={sessionId}
            taskInfo={taskInfo}
            id={id}
            input={input}
            setInput={setInput}
            setShow={setShow}
            isAtBottom={isAtBottom}
            scrollToBottom={scrollToBottom}
            show={show}
            questions={questions}
            activeDocument={activeDocument}
          />
        </div>
      </div>

      {/* Document Editor Sidebar */}
      {activeDocument && (
        <div className="w-[600px] bg-card shadow-lg border-l flex flex-col">
          {/* Editor Header */}
          <div className="bg-muted p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileTextIcon className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-medium">{activeDocument.title}</h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => copyToClipboard(activeDocument.content)}
                className="p-2 hover:bg-muted-foreground/10 rounded transition-colors"
                title="Copy to clipboard"
              >
                <CopyIcon className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => downloadDocument(activeDocument)}
                className="p-2 hover:bg-muted-foreground/10 rounded transition-colors"
                title="Download document"
              >
                <DownloadIcon className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => closeDocument(activeDocument.id)}
                className="p-2 hover:bg-muted-foreground/10 rounded transition-colors"
                title="Close document"
              >
                <Cross2Icon className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Editor Content */}
          <div className="flex-1 p-4">
            <textarea
              value={activeDocument.content}
              onChange={(e) => updateDocumentContent(activeDocument.id, e.target.value)}
              className="w-full h-full resize-none border border-input rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-background font-mono"
              placeholder="Edit your document here..."
            />
          </div>

          {/* Editor Footer */}
          {/* <div className="bg-muted p-4 border-t flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {activeDocument.content.length} characters
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(activeDocument.content)}
                className="px-3 py-2 bg-secondary text-secondary-foreground text-sm rounded hover:bg-secondary/80 transition-colors"
              >
                Copy
              </button>
              <button
                onClick={() => downloadDocument(activeDocument)}
                className="px-3 py-2 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90 transition-colors"
              >
                Download
              </button>
            </div>
          </div> */}
        </div>
      )}
    </div>
  )
}