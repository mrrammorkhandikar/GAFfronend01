'use client';

import { useState, useEffect } from 'react';
import { Heart, Users, Globe, Award } from 'lucide-react';
import SiteApiService from '@/app/services/site-api';

const About = () => {
  const [stats, setStats] = useState([
    { icon: Heart, number: '15,000+', label: 'Children Educated' },
    { icon: Users, number: '800+', label: 'Volunteers' },
    { icon: Globe, number: '25+', label: 'Cities Served' },
    { icon: Award, number: '8', label: 'Years of Service' },
  ]);
  
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await SiteApiService.getActiveTeamMembers();
        if (response.success) {
          setTeamMembers(response.data);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const missionPoints = [
    {
      icon: Heart,
      title: 'Education First',
      description: 'We prioritize education as the foundation for breaking cycles of poverty and creating opportunities for future generations.',
    },
    {
      icon: Globe,
      title: 'Holistic Healthcare',
      description: 'Our healthcare programs address both immediate medical needs and long-term wellness through prevention and education.',
    },
    {
      icon: Users,
      title: 'Community Empowerment',
      description: 'We work hand-in-hand with local communities to build capacity and create sustainable solutions that last beyond our involvement.',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 min-h-[320px] bg-cover bg-center" style={{ backgroundImage: "url('/images/Aboutus/Aboutushome.jpg')" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-poppins uppercase text-sm font-semibold tracking-widest text-[#FFD700] mb-2">
              About Us
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 font-playfair"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Our Mission To Create Positive Change
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto font-poppins">
              Guru Akanksha Foundation is committed to creating sustainable change by addressing educational gaps 
              and healthcare needs in underserved communities. We believe that every child deserves quality education 
              and every family deserves access to basic healthcare services.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#222222] mb-6 font-playfair">Who We Are</h2>
              <p className="text-gray-600 mb-6 font-poppins">
                Guru Akanksha Foundation is a dedicated non-profit organization working towards holistic healthcare development 
                and educational empowerment in underserved communities across India.
              </p>
              <p className="text-gray-600 mb-6 font-poppins">
                Our vision is to create a world where every individual has access to quality healthcare and education, 
                regardless of their socio-economic background. We believe in evidence-based approaches and sustainable solutions 
                that create lasting impact.
              </p>
              <p className="text-gray-600 font-poppins">
                Through our various programs and initiatives, we strive to bridge the gap between communities and essential 
                services, empowering individuals to lead healthier, more fulfilling lives.
              </p>
            </div>
            <div className="relative">
              <img 
                src="/images/Aboutus/Aboutushome.jpg" 
                alt="Guru Akanksha Foundation Team" 
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-[#fcf9e3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#222222] mb-4 font-playfair">Our Story</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-poppins">
              The journey of Guru Akanksha Foundation began with a simple yet powerful vision - to make quality healthcare 
              and education accessible to all, especially those in underserved communities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-2xl font-bold text-[#6D190D] mb-4 font-playfair">The Beginning</div>
              <p className="text-gray-600 font-poppins">
                Founded in 2016 by Dr. Bushra Mirza, our journey began with small health camps in rural Maharashtra. 
                What started as a local initiative quickly grew into a comprehensive organization addressing healthcare 
                and educational needs across multiple states.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-2xl font-bold text-[#6D190D] mb-4 font-playfair">The Growth</div>
              <p className="text-gray-600 font-poppins">
                Over the years, we expanded our reach to 25+ cities, conducted over 50 health camps, and educated 
                thousands of children. Our programs evolved to include dental care, hygiene education, and 
                drug awareness campaigns.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-2xl font-bold text-[#6D190D] mb-4 font-playfair">Today & Tomorrow</div>
              <p className="text-gray-600 font-poppins">
                Today, we continue to grow with the support of 800+ volunteers and partners. 
                Our focus remains on sustainable development, community empowerment, and creating 
                lasting positive change through education and healthcare.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#222222] mb-4 font-playfair">What We Do</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-poppins">
              Our comprehensive approach addresses multiple aspects of community development
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {missionPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <div key={index} className="text-center p-6 bg-[#fcf9e3] rounded-xl">
                  <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-[#6D190D]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#222222] font-playfair">{point.title}</h3>
                  <p className="text-gray-600 font-poppins">{point.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#fcf9e3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFD700] rounded-full mb-4">
                    <Icon className="h-8 w-8 text-[#6D190D]" />
                  </div>
                  <div className="text-3xl font-bold text-[#6D190D] mb-2 font-playfair">{stat.number}</div>
                  <div className="text-gray-600 font-poppins">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Volunteers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#222222] mb-6 font-playfair">The Power of Volunteers</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-poppins">
            Our volunteers are the heart of everything we do. With over 800 dedicated volunteers, 
            we've been able to reach communities across India and create meaningful impact in countless lives.
          </p>
          <p className="text-gray-600 mb-10 font-poppins">
            Volunteers contribute their time, skills, and passion to help us deliver healthcare services, 
            educational programs, and community development initiatives. Whether it's conducting health camps, 
            teaching children, or organizing awareness campaigns, every volunteer makes a difference.
          </p>
          <a 
            href="/careers" 
            className="bg-[#6D190D] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8B2317] transition-colors font-poppins inline-block"
          >
            Join Us
          </a>
        </div>
      </section>

    </div>
  );
};

export default About;
