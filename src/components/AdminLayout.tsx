'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Bell, ChevronDown, LayoutGrid, Menu, Settings, User, X, Folder, File  } from 'lucide-react'

import { Button } from "@/components/ui/button"

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// import { Input } from "@/components/ui/input"

// const data = [
//   { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
//   { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
//   { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
//   { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
//   { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
//   { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
// ]


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
                        {/* <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Revenue
                                    </CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">$45,231.89</div>
                                    <p className="text-xs text-muted-foreground">
                                        +20.1% from last month
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        New Users
                                    </CardTitle>
                                    <User className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">+2350</div>
                                    <p className="text-xs text-muted-foreground">
                                        +180.1% from last month
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">+12,234</div>
                                    <p className="text-xs text-muted-foreground">
                                        +19% from last month
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                                    <User className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">+573</div>
                                    <p className="text-xs text-muted-foreground">
                                        +201 since last hour
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-6 mb-8 md:grid-cols-2">
                            <Card className="col-span-2">
                                <CardHeader>
                                    <CardTitle>Revenue Overview</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={data}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="pv" fill="#8884d8" />
                                            <Bar dataKey="uv" fill="#82ca9d" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="mt-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Transactions</CardTitle>
                                    <CardDescription>You made 265 sales this month.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-8">
                                        
                                        {[1, 2, 3].map((item) => (
                                            <div key={item} className="flex items-center">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        Customer Name {item}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        customer{item}@example.com
                                                    </p>
                                                </div>
                                                <div className="ml-auto font-medium">+$1,999.00</div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div> */}
                    </div>
                </main>
            </div>
        </div>
    )
}
