import { Poppins, Playfair_Display } from 'next/font/google';
import "./globals.css";

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: '400',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
});

const siteName = 'Guru Akanksha Foundation';
const siteUrl = 'https://guruakanksha.org';
const siteDescription =
  'Guru Akanksha Foundation is dedicated to creating sustainable change and empowering communities worldwide through education, healthcare, and emergency relief programs.';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Making a Difference Worldwide`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: `${siteName} | Making a Difference Worldwide`,
    description: siteDescription,
    siteName,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    description: siteDescription,
  };

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${playfairDisplay.variable} antialiased min-h-screen flex flex-col`}
      >
        <script
          type="application/ld+json"
          // JSON-LD helps search engines connect your site to the correct organization entity.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  );
}

