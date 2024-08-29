import AdminLayout from "@/components/AdminLayout";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AdminLayout>
          <div className="p-24">
            {children}
          </div>
        </AdminLayout>
      </body>
    </html>
  );
}
