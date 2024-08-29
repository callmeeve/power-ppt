import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadFile } from "@/lib/storage"; // Adjust the import path as necessary

// Ensure the enum type matches your Prisma schema
type ContentType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'BULLETS';

interface Slide {
    id: string;
    title: string;
    contentType: ContentType;
    content: string;
    fileUrl: string;
    presentationId?: string;
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const presentationId = searchParams.get('presentationId');

        let slides;
        if (presentationId) {
            slides = await prisma.slide.findMany({
                where: { presentationId },
            });
        } else {
            slides = await prisma.slide.findMany();
        }

        return NextResponse.json(slides);
    } catch (error: unknown) {
        return new NextResponse(
            JSON.stringify({
                status: "error",
                message: (error instanceof Error) ? error.message : 'Unknown error occurred',
            }),
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const { title, contentType, content, fileUrl, presentationId } = (await req.json()) as Slide;

        // Validate that contentType matches one of the enum values
        if (!contentType || !['TEXT', 'IMAGE', 'VIDEO', 'BULLETS'].includes(contentType)) {
            return new NextResponse(
                JSON.stringify({
                    status: "error",
                    message: "Invalid content type",
                }),
                { status: 400 }
            );
        }

        // If a file URL is provided, upload the file to Firebase Storage
        let uploadedFileUrl = fileUrl;
        if (fileUrl && !fileUrl.startsWith('http')) {
            const base64Data = fileUrl.split(',')[1];
            if (!base64Data) {
                return new NextResponse(
                    JSON.stringify({
                        status: "error",
                        message: "Invalid file URL",
                    }),
                    { status: 400 }
                );
            }

            try {
                const fileBuffer = Buffer.from(base64Data, 'base64');
                const file = new File([fileBuffer], `${title}-${Date.now()}`, { type: 'application/octet-stream' });
                uploadedFileUrl = await uploadFile(file, 'slides/');
            } catch (uploadError) {
                return new NextResponse(
                    JSON.stringify({
                        status: "error",
                        message: "Failed to upload file",
                    }),
                    { status: 500 }
                );
            }
        }

        const slide = await prisma.slide.create({
            data: {
                title,
                contentType: [contentType] as [ContentType],
                content,
                fileUrl: uploadedFileUrl,
                presentationId,
            },
        });

        return NextResponse.json(slide);
    } catch (error: unknown) {
        console.error(error);
        return new NextResponse(
            JSON.stringify({
                status: "error",
                message: (error instanceof Error) ? error.message : 'Unknown error occurred',
            }),
            { status: 500 }
        );
    }
}