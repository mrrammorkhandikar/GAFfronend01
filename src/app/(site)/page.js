'use client';

import HeroSection from '@/components/Hero/HeroSection';
import HeroSlider from '@/components/Hero/HeroSlider';
import GetInvolved from '@/components/Hero/GetInvolved';
import AboutUs from '@/components/Hero/AboutUs';
import Campaigns from '@/components/Hero/Campaigns';
import Events from '@/components/Hero/Events';
import CallToAction from '@/components/Hero/CallToAction';

export default function Home() {
  const programs = [
    {
      title: 'Education for Underprivileged Children',
      description: 'Providing quality education, learning materials, and scholarships to children from economically weaker sections.',
      image: '/images/campains/Healthy_Smile_For_Underprivileged_Children/titleImage.jpg',
      link: '/campaigns',
    },
    {
      title: 'Healthcare and Medical Camps',
      description: 'Organizing free health check-ups, dental camps, and medical assistance for remote and underserved communities.',
      image: '/images/helppoor.jpg',
      link: '/campaigns',
    },
    {
      title: 'Hygiene and Sanitation Program',
      description: 'Promoting hygiene awareness and providing essential sanitation facilities to improve community health.',
      image: '/images/campains/Sponsor_for_Hygienic_Living_Program/titleimage.jpg',
      link: '/campaigns',
    },
    {
      title: 'Drug Awareness and Prevention',
      description: 'Educating youth about dangers of self-medication and drug abuse through awareness campaigns.',
      image: '/images/campains/Self_Medication_Drug_Abuse/titleImage.jpg',
      link: '/campaigns',
    },
  ];

  const testimonials = [
    {
      quote: 'Thanks to Guru Akanksha Foundation, my daughter can now attend school and dream of becoming a doctor. The scholarship program changed our lives.',
      author: 'Priya Sharma',
      location: 'Mumbai, India',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    },
    {
      quote: 'The free dental camp organized by Guru Akanksha Foundation saved my family hundreds of dollars in medical expenses. The healthcare services are exceptional.',
      author: 'Rajesh Kumar',
      location: 'Delhi, India',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    },
    {
      quote: 'The hygiene awareness program helped our community understand the importance of cleanliness. Our children are healthier and schools are cleaner now.',
      author: 'Meena Patel',
      location: 'Ahmedabad, India',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    },
  ];

  return (
    <div>
      <HeroSection />
      <HeroSlider />
      <GetInvolved />
      <AboutUs />
      <Campaigns />
      <Events />
      <CallToAction />
    </div>
  );
}
