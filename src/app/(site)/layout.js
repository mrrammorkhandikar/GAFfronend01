import Header from './Components/Header';
import Footer from './Components/Footer';

export const metadata = {
  title: "Guru Akanksha Foundation | Making a Difference Worldwide",
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
