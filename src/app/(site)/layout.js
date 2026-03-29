import Header from './Components/Header';
import Footer from './Components/Footer';

export const metadata = {
  description: "Dedicated to creating sustainable change and empowering communities worldwide through education, healthcare, and emergency relief programs.",
};

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}
