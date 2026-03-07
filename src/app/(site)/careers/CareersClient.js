'use client';

import React, { useState, useRef } from 'react';
import { Briefcase, Users, Handshake, Award, Heart, Mail, Phone, User, FileText, MessageSquare, MapPin, Clock, ArrowRight, CheckCircle } from 'lucide-react';

const CareersClient = ({ initialVolunteerOpportunities, initialCareerOpportunities }) => {
  const [activeForm, setActiveForm] = useState('volunteer');
  const formRef = useRef(null);
  
  // Use props directly
  const volunteerOpportunities = initialVolunteerOpportunities || [];
  const careerOpportunities = initialCareerOpportunities || [];
  
  const [careerStats, setCareerStats] = useState([
    { number: '800+', label: 'Active Volunteers' },
    { number: '25+', label: 'Cities Served' },
    { number: '50+', label: 'Ongoing Projects' },
    { number: '8', label: 'Years Experience' },
  ]);
  
  // Volunteer form state
  const [volunteerFormData, setVolunteerFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    availability: '',
    skills: '',
    interestArea: '',
    message: '',
  });
  
  // Job application form state
  const [jobFormData, setJobFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    resume: null,
    coverLetter: '',
  });

  const handleApply = (opportunity, type) => {
    setActiveForm(type);
    
    if (type === 'volunteer') {
      setVolunteerFormData(prev => ({
        ...prev,
        interestArea: opportunity.title
      }));
    } else {
      setJobFormData(prev => ({
        ...prev,
        position: opportunity.title
      }));
    }
    
    // Scroll to form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleVolunteerFormSubmit = (e) => {
    e.preventDefault();
    console.log('Volunteer Form Data:', volunteerFormData);
    // Here you would typically send the data to your backend
    alert('Thank you for your volunteer application! We will contact you soon.');
    // Reset form
    setVolunteerFormData({
      fullName: '',
      email: '',
      phone: '',
      location: '',
      availability: '',
      skills: '',
      interestArea: '',
      message: '',
    });
  };

  const handleJobFormSubmit = (e) => {
    e.preventDefault();
    console.log('Job Application Data:', jobFormData);
    // Here you would typically send the data to your backend
    alert('Thank you for your job application! We will review your submission and contact you soon.');
    // Reset form
    setJobFormData({
      fullName: '',
      email: '',
      phone: '',
      position: '',
      experience: '',
      resume: null,
      coverLetter: '',
    });
  };

  const handleVolunteerInputChange = (e) => {
    const { name, value } = e.target;
    setVolunteerFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleJobInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setJobFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setJobFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Helper to render opportunity card
  const OpportunityCard = ({ item, type }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-[#222222] font-playfair">{item.title}</h3>
          {type === 'job' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {item.employmentType || 'Full-time'}
            </span>
          )}
        </div>
        
        <p className="text-gray-600 mb-6 font-poppins text-sm line-clamp-3">
          {item.description}
        </p>

        {type === 'job' && item.location && (
          <div className="flex items-center text-gray-500 mb-4 text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            {item.location}
          </div>
        )}

        <div className="space-y-2 mb-6">
          {item.requirements && item.requirements.slice(0, 3).map((req, idx) => (
            <div key={idx} className="flex items-start text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 mr-2 text-[#D4A71C] flex-shrink-0 mt-0.5" />
              <span>{req}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <button
          onClick={() => handleApply(item, type)}
          className="w-full flex items-center justify-center space-x-2 text-[#6D190D] font-semibold hover:text-[#5a140a] transition-colors font-poppins group"
        >
          <span>Apply Now</span>
          <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 min-h-[320px] bg-cover bg-center" style={{ backgroundImage: "url('/images/Png/getinvolvedpeople.png')" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-poppins uppercase text-sm font-semibold tracking-widest text-[#FFD700] mb-2">
              Join Our Team
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 font-playfair"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Build Your Career While Making A Difference
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto font-poppins">
              Be part of a passionate team working towards social impact. Whether you're looking for 
              volunteer opportunities or professional growth, we have roles that match your skills and interests.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {careerStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-[#6D190D] mb-2 font-playfair">{stat.number}</div>
                <div className="text-gray-600 font-poppins">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Toggle Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => setActiveForm('volunteer')}
              className={`px-8 py-4 rounded-lg font-semibold transition-colors font-poppins flex items-center justify-center space-x-2 ${
                activeForm === 'volunteer' 
                  ? 'bg-[#6D190D] text-white shadow-lg' 
                  : 'bg-white text-[#6D190D] border-2 border-[#6D190D] hover:bg-[#6D190D] hover:text-white'
              }`}
            >
              <Heart className="h-5 w-5" />
              <span>Volunteer Opportunities</span>
            </button>
            <button
              onClick={() => setActiveForm('job')}
              className={`px-8 py-4 rounded-lg font-semibold transition-colors font-poppins flex items-center justify-center space-x-2 ${
                activeForm === 'job' 
                  ? 'bg-[#6D190D] text-white shadow-lg' 
                  : 'bg-white text-[#6D190D] border-2 border-[#6D190D] hover:bg-[#6D190D] hover:text-white'
              }`}
            >
              <Briefcase className="h-5 w-5" />
              <span>Job Opportunities</span>
            </button>
          </div>

          {/* Opportunities Grid */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#222222] mb-4 font-playfair">
                {activeForm === 'volunteer' ? 'Open Volunteer Roles' : 'Current Job Openings'}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto font-poppins">
                {activeForm === 'volunteer' 
                  ? 'Join our community of volunteers and make a direct impact in people\'s lives.'
                  : 'Find your next career move with us and help shape the future of our organization.'}
              </p>
            </div>

            {activeForm === 'volunteer' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {volunteerOpportunities.length > 0 ? (
                  volunteerOpportunities.map(opp => (
                    <OpportunityCard key={opp.id} item={opp} type="volunteer" />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm">
                    <p className="text-gray-500 text-lg">No volunteer opportunities currently available.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {careerOpportunities.length > 0 ? (
                  careerOpportunities.map(job => (
                    <OpportunityCard key={job.id} item={job} type="job" />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm">
                    <p className="text-gray-500 text-lg">No job openings currently available.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Application Form */}
          <div ref={formRef} className="scroll-mt-24">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-[#6D190D] py-10 px-6 text-center">
                <h3 className="text-3xl font-bold text-white mb-2 font-playfair">
                  {activeForm === 'volunteer' ? 'Volunteer Application' : 'Job Application'}
                </h3>
                <p className="text-white/80 font-poppins">
                  Please fill out the form below to apply
                </p>
              </div>
              
              <div className="p-8 md:p-12">
                {activeForm === 'volunteer' && (
                  <form onSubmit={handleVolunteerFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="text"
                            name="fullName"
                            value={volunteerFormData.fullName}
                            onChange={handleVolunteerInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent font-poppins text-black"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="email"
                            name="email"
                            value={volunteerFormData.email}
                            onChange={handleVolunteerInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent font-poppins text-black"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Phone Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="tel"
                            name="phone"
                            value={volunteerFormData.phone}
                            onChange={handleVolunteerInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent font-poppins text-black"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Location *</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="text"
                            name="location"
                            value={volunteerFormData.location}
                            onChange={handleVolunteerInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent font-poppins text-black"
                            placeholder="City, State"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Availability *</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <select
                            name="availability"
                            value={volunteerFormData.availability}
                            onChange={handleVolunteerInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent font-poppins text-black appearance-none"
                          >
                            <option value="">Select availability</option>
                            <option value="weekends">Weekends only</option>
                            <option value="weekdays">Weekdays only</option>
                            <option value="flexible">Flexible schedule</option>
                            <option value="occasional">Occasional help</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Interest Area *</label>
                        <div className="relative">
                          <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <select
                            name="interestArea"
                            value={volunteerFormData.interestArea}
                            onChange={handleVolunteerInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent font-poppins text-black appearance-none"
                          >
                            <option value="">Select area of interest</option>
                            {/* Dynamic options from opportunities */}
                            {volunteerOpportunities.map(opp => (
                              <option key={opp.id} value={opp.title}>{opp.title}</option>
                            ))}
                            <option value="healthcare">Healthcare/Medical</option>
                            <option value="education">Education</option>
                            <option value="events">Event Management</option>
                            <option value="marketing">Digital Marketing</option>
                            <option value="fundraising">Fundraising</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Skills & Experience</label>
                      <div className="relative">
                        <Award className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                        <textarea
                          name="skills"
                          value={volunteerFormData.skills}
                          onChange={handleVolunteerInputChange}
                          rows="3"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent font-poppins text-black"
                          placeholder="Briefly describe your relevant skills and experience..."
                        ></textarea>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Why do you want to join us?</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                        <textarea
                          name="message"
                          value={volunteerFormData.message}
                          onChange={handleVolunteerInputChange}
                          rows="3"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent font-poppins text-black"
                          placeholder="Tell us about your motivation..."
                        ></textarea>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#6D190D] text-white py-4 rounded-lg font-bold hover:bg-[#5a140a] transition-colors shadow-lg font-poppins text-lg"
                    >
                      Submit Application
                    </button>
                  </form>
                )}

                {activeForm === 'job' && (
                  <form onSubmit={handleJobFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="text"
                            name="fullName"
                            value={jobFormData.fullName}
                            onChange={handleJobInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent font-poppins text-black"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="email"
                            name="email"
                            value={jobFormData.email}
                            onChange={handleJobInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent font-poppins text-black"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Phone Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="tel"
                            name="phone"
                            value={jobFormData.phone}
                            onChange={handleJobInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent font-poppins text-black"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Position Applied For *</label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="text"
                            name="position"
                            value={jobFormData.position}
                            onChange={handleJobInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent font-poppins text-black"
                            placeholder="e.g. Program Coordinator"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Years of Experience</label>
                      <div className="relative">
                        <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <select
                          name="experience"
                          value={jobFormData.experience}
                          onChange={handleJobInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent font-poppins text-black appearance-none"
                        >
                          <option value="">Select experience</option>
                          <option value="0-2">0-2 years</option>
                          <option value="3-5">3-5 years</option>
                          <option value="5-10">5-10 years</option>
                          <option value="10+">10+ years</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Resume/CV</label>
                        <div className="relative border border-gray-300 rounded-lg p-3 flex items-center bg-white">
                          <FileText className="h-5 w-5 text-gray-400 mr-2" />
                          <input
                            type="file"
                            name="resume"
                            onChange={handleJobInputChange}
                            accept=".pdf,.doc,.docx"
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Cover Letter (Optional)</label>
                        <textarea
                          name="coverLetter"
                          value={jobFormData.coverLetter}
                          onChange={handleJobInputChange}
                          rows="1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent font-poppins text-black"
                          placeholder="Paste your cover letter here..."
                        ></textarea>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#6D190D] text-white py-4 rounded-lg font-bold hover:bg-[#5a140a] transition-colors shadow-lg font-poppins text-lg"
                    >
                      Submit Job Application
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareersClient;
