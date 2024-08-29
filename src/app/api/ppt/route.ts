import pptxgen from 'pptxgenjs';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    let pptx = new pptxgen();

    try {
        const { searchParams } = new URL(req.url);
        const presentationId = searchParams.get('presentationId');

        const slides = await prisma.slide.findMany({
            where: { presentationId },
            include: { presentation: true },
        });

        slides.forEach((slide) => {
            const slideObj = pptx.addSlide();
        
            if (slide.contentType.includes('TEXT')) {
                slideObj.addText(slide.title, { x: 0.5, y: 0.5, fontSize: 32, bold: true, color: '000000' });
                slideObj.addText(slide.content, { x: 0.5, y: 1.5, fontSize: 20, color: '333333' });
            } else if (slide.contentType.includes('IMAGE') && slide.fileUrl) {
                slideObj.addText(slide.title, { x: 0.5, y: 0.5, fontSize: 32, bold: true, color: '000000' });
                slideObj.addImage({ path: slide.fileUrl, x: 0.5, y: 1, w: 8, h: 4 });
            }
        });

        const pptxBuffer = await pptx.stream();

        return new NextResponse(pptxBuffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'Content-Disposition': 'attachment; filename="presentation.pptx"',
            },
        });
    } catch (error: unknown) {
        return new NextResponse(
            JSON.stringify({
                status: 'error',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            }),
            { status: 500 }
        );
    }
    
}