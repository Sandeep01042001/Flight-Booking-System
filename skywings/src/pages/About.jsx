import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, ShieldCheck, Users, Globe, Clock, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1920&auto=format&fit=crop"
          alt="Airplane wing over the clouds"
          className="w-full h-72 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center text-white">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 backdrop-blur text-sm mb-4">
              <Sparkles className="h-4 w-4 mr-1" /> Trusted by travelers worldwide
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold">About Skywings</h1>
            <p className="mt-3 max-w-2xl mx-auto text-indigo-100">
              Connecting people and places with reliable, comfortable, and affordable air travel.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center"><ShieldCheck className="h-7 w-7 text-indigo-600 mr-2"/> Our Mission</h2>
            <p className="mt-4 text-lg text-gray-600">
              At Skywings, we are committed to making air travel seamless and delightful. From booking to boarding,
              our focus is on safety, punctuality, and service excellence.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              Founded in 2023, we have rapidly grown from a regional carrier to a global airline with a modern fleet
              and a passionate team dedicated to your journey.
            </p>
            <div className="mt-6">
              <Link to="/contact" className="inline-flex items-center px-5 py-3 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1600&auto=format&fit=crop"
              alt="Airport terminal"
              className="w-full h-80 object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-md px-4 py-2 shadow flex items-center">
              <Plane className="h-5 w-5 text-indigo-600 mr-2"/> Seamless journeys since 2023
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Destinations', value: '200+', icon: Globe },
            { label: 'On‑time rate', value: '94%', icon: Clock },
            { label: 'Fleet size', value: '120+', icon: Plane },
            { label: 'Team members', value: '5,000+', icon: Users },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-6 text-center shadow-sm">
              <s.icon className="h-6 w-6 text-indigo-600 mx-auto" />
              <div className="mt-2 text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-600">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Milestones</h3>
          <ol className="relative border-l border-gray-200 pl-6">
            {[
              { year: '2023', title: 'Skywings founded', desc: 'Started with a vision to elevate travel experiences.' },
              { year: '2024', title: '50 destinations', desc: 'Expanded across continents with a modern fleet.' },
              { year: '2025', title: 'Global loyalty program', desc: 'Launched rewards for our most frequent flyers.' },
            ].map((m) => (
              <li key={m.year} className="mb-8 ml-2">
                <div className="absolute -left-1.5 w-3 h-3 bg-indigo-600 rounded-full border border-white" />
                <time className="mb-1 text-sm font-medium text-indigo-600">{m.year}</time>
                <h4 className="text-lg font-semibold text-gray-900">{m.title}</h4>
                <p className="text-gray-600">{m.desc}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Values */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Values</h3>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Safety First', desc: 'We maintain the highest safety standards, always.', icon: ShieldCheck },
              { name: 'Customer Focus', desc: 'We go above and beyond for a delightful journey.', icon: Users },
              { name: 'Innovation', desc: 'We embrace technology to enhance travel experiences.', icon: Sparkles },
            ].map((v) => (
              <div key={v.name} className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 rounded-md bg-indigo-50 flex items-center justify-center">
                  <v.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <h4 className="mt-4 text-lg font-semibold text-gray-900">{v.name}</h4>
                <p className="mt-2 text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
