import '../styles/globals.css';

export const metadata = {
  title: 'to do stickies',
  description: 'Electron + Next.js + Tailwind',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}