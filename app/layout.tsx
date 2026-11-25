import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: {
    default: 'Bright Academy | Premier Tuition Centre – Learn Today. Lead Tomorrow.',
    template: '%s | Tuition Centre Platform',
  },
  description:
    'Premier educational coaching and tuition institution platform offering structured academic coaching for Classes 5 to 12, Board Examinations, and Competitive Entrance Tests.',
  keywords: [
    'Tech Academy',
    'Bright Academy',
    'Excellence Tutorials',
    'Tuition Centre',
    'Class 10 CBSE Tuition',
    'Plus One Tuition',
    'Plus Two Tuition',
    'JEE Entrance Coaching',
    'NEET Medical Coaching',
  ],
  authors: [{ name: 'Tech Academy Platform' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-[#334155] antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
