import { JetBrains_Mono, Fira_Code } from 'next/font/google';
import MatrixRain from '@/components/MatrixRain';
import './globals.css';

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jetbrains',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-fira',
});

export const metadata = {
  title: '💕 feliz mes by Edwin Ortega',
  description: 'Una sorpresa especial',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${jetbrains.variable} ${firaCode.variable}`}>
      <body>
        <MatrixRain />
        <div className="scanlines" />
        <footer className="footer">
          by{' '}
          <a href="https://github.com/EdwinMaurizioOrtega/feliz-mes" target="_blank" rel="noopener">
            Edwin Ortega
          </a>
        </footer>
        {children}
      </body>
    </html>
  );
}
