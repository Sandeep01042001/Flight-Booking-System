import { Link } from 'react-router-dom';

const About = () => {
  const teamMembers = [
    {
      name: 'John Doe',
      role: 'CEO & Founder',
      bio: 'With over 15 years of experience in the travel industry, John founded SkyWings to make air travel more accessible to everyone.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Jane Smith',
      role: 'Chief Operations',
      bio: 'Jane oversees all flight operations and ensures our customers have the smoothest travel experience possible.',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      name: 'Alex Johnson',
      role: 'Customer Experience',
      bio: 'Alex leads our customer support team, making sure every traveler gets the assistance they need, 24/7.',
      image: 'https://randomuser.me/api/portraits/men/75.jpg'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About SkyWings</h1>
          <p className="text-xl max-w-3xl mx-auto">Making air travel simple, comfortable, and affordable for everyone.</p>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">Our Story</h2>
            <div className="max-w-3xl mx-auto text-lg text-gray-600 space-y-6">
              <p>
                Founded in 2023, SkyWings was born out of a simple idea: air travel should be accessible to everyone. 
                What started as a small team of travel enthusiasts has grown into a leading flight booking platform 
                serving millions of travelers worldwide.
              </p>
              <p>
                Our mission is to provide a seamless booking experience, competitive prices, and exceptional 
                customer service. We partner with major airlines to bring you the best flight options to 
                destinations around the globe.
              </p>
              <p>
                At SkyWings, we believe that every journey matters. Whether you're traveling for business, 
                visiting loved ones, or exploring new horizons, we're here to make your trip memorable.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Meet Our Team</h2>
            <p className="mt-4 text-xl text-gray-600">The passionate people behind SkyWings</p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 font-medium">{member.role}</p>
                  <p className="mt-3 text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Values</h2>
            <p className="mt-4 text-xl text-gray-600">What drives us every day</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center p-6">
              <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mb-4">
                ✈️
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer First</h3>
              <p className="text-gray-600">Your satisfaction is our top priority. We go above and beyond to ensure you have the best travel experience.</p>
            </div>
            <div className="text-center p-6">
              <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mb-4">
                💡
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">We constantly improve our platform to make booking flights easier and more convenient for you.</p>
            </div>
            <div className="text-center p-6">
              <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mb-4">
                🌍
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Reach</h3>
              <p className="text-gray-600">Connecting you to over 1,000 destinations worldwide with our extensive network of airline partners.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">Ready to start your journey?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join millions of travelers who trust SkyWings for their flight bookings.
          </p>
          <Link
            to="/flights"
            className="px-6 py-3 bg-white text-blue-600 hover:bg-gray-100 font-medium rounded-md transition-colors duration-300 inline-block"
          >
            Search Flights
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
