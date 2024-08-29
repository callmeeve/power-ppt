'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2 } from 'lucide-react'
import { uploadFile, getFile } from "@/lib/storage"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Slide, Presentation, ContentType } from '@/types'

export default function SlideForm() {
  const [loading, setLoading] = useState(false)

  const [slides, setSlides] = useState<Slide[]>([
    { id: crypto.randomUUID(), title: '', contentType: ['TEXT'], content: '', fileUrl: '', presentationId: undefined, createdAt: new Date(), updatedAt: new Date() }
  ])
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [selectedPresentation, setSelectedPresentation] = useState<string>('')

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('')
  const [dialogDescription, setDialogDescription] = useState('')

  useEffect(() => {
    async function fetchPresentations() {
      const response = await fetch('/api/presentations')
      const data = await response.json()
      setPresentations(data)
    }

    fetchPresentations()
  }, [])

  const addSlide = (count: number = 1) => {
    if (!selectedPresentation) {
      console.error('No presentation selected')
      return
    }

    const newSlides: Slide[] = Array.from({ length: count }, () => ({
      id: crypto.randomUUID(),
      title: '',
      contentType: ['TEXT'],
      content: '',
      fileUrl: '',
      presentationId: selectedPresentation,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    setSlides([...slides, ...newSlides])
  }

  const removeSlide = (index: number) => {
    setSlides(slides.filter((_, i) => i !== index))
  }

  const updateSlide = async (index: number, field: keyof Slide, value: any) => {
    const newSlides = [...slides]
    if (field === 'fileUrl' && value instanceof File) {
      const fileUrl = await handleFileUpload(value, newSlides[index].title)
      newSlides[index][field] = fileUrl
    } else {
      newSlides[index][field] = value
    }
    newSlides[index].presentationId = selectedPresentation
    newSlides[index].updatedAt = new Date()
    setSlides(newSlides)
  }

  const handleFileUpload = async (file: File, title: string) => {
    const filePath = await uploadFile(file, `slides/${title}-${Date.now()}`)
    return await getFile(filePath)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      for (const slide of slides) {
        // Validasi contentType sebelum mengirim data
        if (!['TEXT', 'IMAGE', 'VIDEO', 'BULLETS'].includes(slide.contentType[0])) {
          throw new Error(`Invalid content type: ${slide.contentType[0]}`)
        }

        // Pastikan presentationId tidak kosong
        if (!slide.presentationId) {
          throw new Error('Presentation ID is required')
        }

        const slideData = {
          ...slide,
          contentType: slide.contentType[0], // Ubah contentType menjadi string
          presentationId: slide.presentationId || selectedPresentation,
        }

        console.log('Sending slide data:', slideData)

        const response = await fetch('/api/slides', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(slideData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          setDialogTitle("Failed to create slide")
          setDialogDescription(`Error: ${errorData.message}`)
          setDialogOpen(true)
          throw new Error(`Failed to create slide: ${errorData.message}`)
        } else {
          const data = await response.json()
          setSlides([{ id: crypto.randomUUID(), title: '', contentType: ['TEXT'], content: '', fileUrl: '', presentationId: undefined, createdAt: new Date(), updatedAt: new Date() }])
          setDialogTitle("Slide created")
          setDialogDescription("Slide created successfully")
          setDialogOpen(true)
          console.log('Slide created successfully:', data)
        }
      }
    } catch (error : unknown) {
      console.error('Error creating slides:', error)
      setDialogTitle("Error")
      setDialogDescription(`An error occurred while creating slides: ${error}`)
      setDialogOpen(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold">Create Slides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="presentation-select">Select Presentation</Label>
              <Select
                value={selectedPresentation}
                onValueChange={(value) => setSelectedPresentation(value)}
              >
                <SelectTrigger id="presentation-select">
                  <SelectValue placeholder="Select presentation" />
                </SelectTrigger>
                <SelectContent>
                  {presentations.map((presentation) => (
                    <SelectItem key={presentation.id} value={presentation.id}>
                      {presentation.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {slides.map((slide, slideIndex) => (
              <Card key={slide.id}>
                <CardHeader>
                  <CardTitle className="text-lg">Slide {slideIndex + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`slide-title-${slideIndex}`}>Slide Title</Label>
                    <Input
                      id={`slide-title-${slideIndex}`}
                      value={slide.title}
                      onChange={(e) => updateSlide(slideIndex, 'title', e.target.value)}
                      placeholder="Enter slide title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`content-type-${slideIndex}`}>Content Type</Label>
                    <Select
                      value={slide.contentType[0]}
                      onValueChange={(value: ContentType) => updateSlide(slideIndex, 'contentType', [value])}
                    >
                      <SelectTrigger id={`content-type-${slideIndex}`}>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TEXT">Text</SelectItem>
                        <SelectItem value="IMAGE">Image</SelectItem>
                        <SelectItem value="VIDEO">Video</SelectItem>
                        <SelectItem value="BULLETS">Bullet Points</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {slide.contentType.includes('TEXT') && (
                    <div className="space-y-2">
                      <Label htmlFor={`slide-content-${slideIndex}`}>Slide Content</Label>
                      <Textarea
                        id={`slide-content-${slideIndex}`}
                        value={slide.content}
                        onChange={(e) => updateSlide(slideIndex, 'content', e.target.value)}
                        placeholder="Enter slide content"
                        required
                      />
                    </div>
                  )}
                  {slide.contentType.includes('IMAGE') && (
                    <div className="space-y-2">
                      <Label htmlFor={`slide-image-${slideIndex}`}>Image</Label>
                      <Input
                        id={`slide-image-${slideIndex}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            updateSlide(slideIndex, 'fileUrl', file)
                          }
                        }}
                        placeholder="Upload image"
                        required
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSlide(slideIndex)}
                    disabled={slides.length === 1}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Slide
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => addSlide(1)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Slide
            </Button>
            <Button type="submit">
              {loading ? 'Creating...' : 'Create Slides'}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}