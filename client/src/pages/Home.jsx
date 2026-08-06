import Testimonials from "../components/Testimonials";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
       <HowItWorks />
        <Testimonials />
      <Footer />
    </>
  );
}

export default Home;