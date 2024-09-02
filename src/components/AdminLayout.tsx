'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Bell, ChevronDown, LayoutGrid, Menu, User, X, Folder, File  } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const [sidebarOpen, setSidebarOpen] = useState(false)

    const router = usePathname()
    
    const isActive = (href: string) => router === href
    
    const NavLink = ({ href, children }: Readonly<{ href: string; children: React.ReactNode }>) => (
        <Link href={href} legacyBehavior>
            <a className={`text-sm font-medium block py-2.5 px-4 rounded transition duration-200 ${isActive(href) ? 'bg-gray-700 text-white' : 'hover:bg-gray-700 hover:text-white'}`}>
                {children}
            </a>
        </Link>
    );

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
                <div className="flex items-center px-4">
                    <span className="text-2xl font-semibold">Dashboard</span>
                    <div className="ml-auto md:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
                <nav className="space-y-2">
                    <NavLink href="/">
                        <LayoutGrid className="inline-block h-6 w-6 mr-2" />
                        Dashboard
                    </NavLink>
                    <NavLink href="/presentations">
                        <Folder className="inline-block h-6 w-6 mr-2" />
                        Presentations
                    </NavLink>
                    <NavLink href="/slides">
                        <File className="inline-block h-6 w-6 mr-2" />
                        Slides
                    </NavLink>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm border border-gray-100">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <div className="flex items-center">
                            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                <Menu className="h-6 w-6" />
                            </Button>
                            <h2 className="font-semibold text-xl text-gray-800">Dashboard</h2>
                        </div>
                        <div className="flex items-center">
                            <Button variant="ghost" size="icon">
                                <Bell className="h-5 w-5" />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="ml-2">
                                        <User className="h-5 w-5 mr-2" />
                                        John Doe
                                        <ChevronDown className="h-4 w-4 ml-2" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Settings</DropdownMenuItem>
                                    <DropdownMenuItem>Logout</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
