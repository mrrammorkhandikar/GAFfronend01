import SiteApiService from '@/app/services/site-api';
import CareersClient from './CareersClient';

export const metadata = {
  title: 'Careers & Volunteering | Guru Akanksha Foundation',
  description: 'Build your career while making a difference. Join our team as a volunteer or professional and contribute to our mission of social impact.',
};

export const dynamic = 'force-dynamic';

export default async function CareersPage() {
  let transformedVolunteerOpportunities = [];
  let transformedCareerOpportunities = [];
  let error = null;

  try {
    const [volunteerResponse, careerResponse] = await Promise.all([
      SiteApiService.getActiveVolunteerOpportunities(),
      SiteApiService.getActiveCareers()
    ]);

    if (volunteerResponse.success && volunteerResponse.data) {
      // Transform the volunteer opportunity data to match the expected format
      transformedVolunteerOpportunities = Array.isArray(volunteerResponse.data) ? volunteerResponse.data.map((opportunity) => ({
        id: opportunity.id,
        title: opportunity.title,
        description: opportunity.description,
        requirements: opportunity.requirements ? (typeof opportunity.requirements === 'string' ? JSON.parse(opportunity.requirements) : opportunity.requirements) : [],
        benefits: opportunity.benefits ? (typeof opportunity.benefits === 'string' ? JSON.parse(opportunity.benefits) : opportunity.benefits) : [],
        type: 'volunteer'
      })) : [];
    }

    if (careerResponse.success && careerResponse.data) {
      // Transform the career opportunity data
      transformedCareerOpportunities = Array.isArray(careerResponse.data) ? careerResponse.data.map((career) => ({
        id: career.id,
        title: career.title,
        description: career.description,
        location: career.location,
        employmentType: career.employmentType,
        requirements: career.requirements ? (typeof career.requirements === 'string' ? JSON.parse(career.requirements) : career.requirements) : [],
        type: 'job'
      })) : [];
    }
  } catch (err) {
    error = 'An error occurred while fetching career data';
    console.error(err);
  }

  return <CareersClient 
    initialVolunteerOpportunities={transformedVolunteerOpportunities} 
    initialCareerOpportunities={transformedCareerOpportunities}
  />;
}
