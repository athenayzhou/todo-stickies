import '../styles/globals.css';

export const metadata = {
  title: 'To Do Stickies',
  description: 'Electron + Next.js + Tailwind',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}