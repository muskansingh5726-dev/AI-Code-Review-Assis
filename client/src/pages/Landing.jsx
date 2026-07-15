import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TechStack from "../components/TechStack";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";

function Landing() {
  return (
    <>
<Navbar />

<section id="home">
    <Hero />
</section>

<section id="features">
    <TechStack />
    <Features />
</section>

<section id="contact">
    <Footer />
</section>

</>
  );
}

export default Landing;