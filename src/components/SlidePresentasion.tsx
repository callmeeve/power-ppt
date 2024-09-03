'use client'

import { ref, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react"
import { storage } from "@/lib/firebase"
import Image from "next/image"
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Slide, Presentation } from "@/types";

export default function SlidesPresentation() {
    const [slides, setSlides] = useState<Slide[]>([])
    const [presentations, setPresentations] = useState<Presentation[]>([])
    const [selectedPresentation, setSelectedPresentation] = useState<string>('')

    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState('')
    const [dialogDescription, setDialogDescription] = useState('')

    useEffect(() => {
        // Fetch presentations from your backend
        async function fetchPresentations() {
            const response = await fetch('/api/presentations')
            const data = await response.json()
            setPresentations(data)
        }

        fetchPresentations()
    }, [])

    useEffect(() => {
        // Fetch slides when a presentation is selected
        async function fetchSlides() {
            if (selectedPresentation) {
                const response = await fetch(`/api/slides?presentationId=${selectedPresentation}`)
                const data = await response.json()

                // Use Firebase Storage to retrieve the file URL for each slide
                const slidesWithFileUrls = await Promise.all(data.map(async (slide: Slide) => {
                    if (slide.fileUrl) {
                        const fileRef = ref(storage, slide.fileUrl)
                        const fileUrl = await getDownloadURL(fileRef)
                        return { ...slide, fileUrl }
                    }
                    return slide
                }))

                setSlides(slidesWithFileUrls)
            }
        }

        fetchSlides()
    }, [selectedPresentation])

    async function generatePPT() {
        if (!selectedPresentation) {
            setDialogOpen(true);
            setDialogTitle('Error');
            setDialogDescription('Please select a presentation to generate the PPT.');
            return;
        }
    
        const presentation = presentations.find(presentation => presentation.id === selectedPresentation);
        if (!presentation) {
            setDialogOpen(true);
            setDialogTitle('Error');
            setDialogDescription('Selected presentation not found.');
            return;
        }
    
        const response = await fetch(`/api/ppt?presentationId=${selectedPresentation}`);
    
        if (response.ok) {
            const title = presentation.title;
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `${title.replace(/ /g, '_')}.pptx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
    
            setDialogOpen(true);
            setDialogTitle('Presentation Downloaded');
            setDialogDescription('The presentation has been downloaded successfully.');
        } else {
            const data = await response.json();
            setDialogOpen(true);
            setDialogTitle('Error');
            setDialogDescription(data.message);
            console.error('Error generating PPT:', data.message);
        }
    }

    return (
        <>
            <div className="w-full max-w-2xl mx-auto space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-bold">Presentations and Slides</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="presentation-select" className="block text-sm font-medium">Select Presentation</label>
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
                                                <div className="text-sm text-gray-500">{presentation.description}</div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {slides.length > 0 ? (
                                <Carousel>
                                    <CarouselContent>
                                        {slides.map((slide) => (
                                            <CarouselItem key={slide.id}>
                                                <Card className="flex flex-col justify-center items-center h-full">
                                                    <CardHeader>
                                                        <CardTitle className="text-lg text-center">{slide.title}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="flex flex-col justify-center items-center">
                                                        {slide.contentType.includes('TEXT') && (
                                                            <p className="text-center">{slide.content}</p>
                                                        )}
                                                        {slide.contentType.includes('IMAGE') && slide.fileUrl && (
                                                            <Image
                                                                src={slide.fileUrl}
                                                                alt={slide.title}
                                                                width={400}
                                                                height={300}
                                                                style={{ width: 'auto', height: 'auto' }}
                                                                className="mx-auto"
                                                            />
                                                        )}
                                                        {slide.contentType.includes('VIDEO') && slide.fileUrl && (
                                                            <video controls src={slide.fileUrl} className="w-full mx-auto" />
                                                        )}
                                                        {slide.contentType.includes('BULLETS') && (
                                                            <ul className="list-disc text-center">
                                                                {slide.content.split('\n').map((line, index) => (
                                                                    <li key={index}>{line}</li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="mx-2 lg:mx-4 absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded">Previous</CarouselPrevious>
                                    <CarouselNext className="mx-2 lg:mx-4 absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded">Next</CarouselNext>
                                </Carousel>
                            ) : (
                                <p>No slides available for the selected presentation.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <div className="flex justify-end">
                    <Button type="button" variant="outline" onClick={generatePPT} className="flex items-center hover:bg-gray-800 hover:text-white">
                        <FileDown className="w-4 h-4 mr-2" />
                        Generate PPT
                    </Button>
                </div>
            </div>
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