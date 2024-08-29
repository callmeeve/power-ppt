'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Presentation } from '@/types'

export default function PresentationForm() {
    const [loading, setLoading] = useState(false)
    const [formValues, setFormValues] = useState<Omit<Presentation, 'id' | 'createdAt' | 'updatedAt'>>({
        title: '',
        description: '',
        slides: []
    })

    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState('')
    const [dialogDescription, setDialogDescription] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/presentations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formValues,
                    id: crypto.randomUUID(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
            })
            if (res.ok) {
                const data = await res.json()
                setFormValues({ title: '', description: '', slides: [] })
                setDialogTitle("Presentation created")
                setDialogDescription("Presentation created successfully")
                setDialogOpen(true)
                console.log('Presentation created successfully:', data)
            } else {
                const errorData = await res.json()
                setDialogTitle("Failed to create presentation")
                setDialogDescription(`Error: ${errorData.message}`)
                setDialogOpen(true)
                throw new Error(`Failed to create presentation: ${errorData.message}`)
            }
        } catch (error: unknown) {
            console.error('Error creating presentation:', error)
            setDialogTitle("Error")
            setDialogDescription("An error occurred while creating the presentation. Please try again.")
            setDialogOpen(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="w-full max-w-xl lg:max-w-2xl mx-auto space-y-8 lg:space-y-12">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-bold">Create Presentation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Presentation Title</Label>
                            <Input
                                id="title"
                                value={formValues.title}
                                onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                                placeholder="Enter presentation title"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Presentation Description</Label>
                            <Textarea
                                id="description"
                                value={formValues.description}
                                onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                                placeholder="Enter presentation description"
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button type="submit">
                            {loading ? 'Creating...' : 'Create Presentation'}
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