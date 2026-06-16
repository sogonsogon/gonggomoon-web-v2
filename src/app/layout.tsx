import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/app/globals.css';

const pretendard = localFont({
  src: '../shared/assets/fonts/PretendardVariable.woff2',
  display: 'swap',
  variable: '--font-pretendard',
  weight: '45 920',
});

export const metadata: Metadata = {
  title: '공고문 - 공고 맞춤 포트폴리오 전략 생성',
  description: '공고문에서 공고에 최적화된 포트폴리오 전략을 생성해보세요.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
