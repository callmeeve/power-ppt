export type ContentType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'BULLETS'

export interface Slide {
    id: string
    title: string
    contentType: ContentType[]
    content: string
    fileUrl?: string
    presentationId?: string
    createdAt: Date
    updatedAt: Date
}

export interface Presentation {
    id: string
    title: string
    description: string
    slides: Slide[]
    createdAt: Date
    updatedAt: Date
}