import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <WhyChooseUs />
      <Testimonials />
      <CTASection />
    </>
  );
};

export default Index;
