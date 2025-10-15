import '../styles/globals.css';

export const metadata = {
  title: 'My App',
  description: 'Electron + Next.js + Tailwind',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}