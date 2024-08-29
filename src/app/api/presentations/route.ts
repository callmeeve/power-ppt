import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const presentations = await prisma.presentation.findMany({
            include: {
                slides: true,
            },
        });

        return NextResponse.json(presentations);
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
        const { title, description } = (await req.json()) as { title: string, description: string };

        const presentation = await prisma.presentation.create({
            data: {
                title,
                description,
            },
        });

        return NextResponse.json(presentation);
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
