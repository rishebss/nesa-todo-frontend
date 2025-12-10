import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Check, Zap, Calendar } from 'lucide-react';
import { Button } from './ui/button';

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    document.documentElement.classList.add('dark');
    setMounted(true);
  }, []);

  const scrollToTodoSection = () => {
    const todoSection = document.getElementById('todo-section');
    if (todoSection) {
      todoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    "Deadline tracking with overdue alerts",
    "Real-time status updates",
    "Pagination for large lists",
    "Search and filter capabilities",
    "RESTful API backend",
    "Mobile responsive design"
  ];

  const techStacks = [
    { 
      name: "React", 
      description: "Frontend UI Library",
      color: "from-cyan-500 to-blue-600",
      svg: "/images/reactjs.svg",
      size: "h-24 w-24"
    },
    { 
      name: "Express", 
      description: "Backend Framework",
      color: "from-yellow-500 to-yellow-600",
      svg: "/images/expressjs.svg",
      size: "h-12 w-12"
    },
    { 
      name: "MongoDB", 
      description: "NoSQL Database",
      color: "from-green-400 to-green-700",
      svg: "/images/mongodb.svg",
      size: "h-24 w-24"
    },
    { 
      name: "Tailwind", 
      description: "CSS Framework",
      color: "from-sky-500 to-blue-400",
      svg: "/images/tailwindcss2.svg",
      size: "h-24 w-24"
    }
  ];

  return (
    <div className="min-h-screen text-white">
      {/* Main Hero - Split Layout */}
      <section className="relative container mx-auto px-6 pt-16 pb-32">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start gap-16">
          
          {/* Left Column - Text Content */}
          <div className="flex-1">
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 mb-8 animate-float">
              <Zap className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-300">Todo app</span>
              <div className="h-1 w-1 rounded-full bg-blue-400 animate-pulse" />
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="block text-gray-300">Mern stack assignment</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-xl text-gray-400 mb-8 max-w-2xl">
              A minimal, powerful todo app with deadlines, real-time tracking, and smart organization. 
              Built for developers who value simplicity and performance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-3 gap-3 border-gray-700 hover:bg-gray-800 text-white"
                onClick={scrollToTodoSection}
              >
                Start Creating Todos
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="gap-3 border-gray-700 hover:bg-gray-800">
                <Calendar className="h-5 w-5" />
                View GitHub
              </Button>
            </div>

            {/* Features Grid */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-gray-300 mb-6">Everything You Need</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-400">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Tech Stack Boxes */}
          <div className="flex-1 lg:max-w-md">
            <div className="sticky top-24">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-300 mb-2">Tech Stack</h3>
                <p className="text-gray-500 text-sm">Technologies powering this application</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {techStacks.map((tech, index) => (
                  <div 
                    key={tech.name}
                    className="group relative p-5 rounded-xl bg-gray-900/40 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    {/* SVG Image */}
                    <div className="h-24 w-24 mb-[-20px] mt-[-20px] flex items-center justify-center">
                      <img 
                        src={tech.svg} 
                        alt={`${tech.name} logo`}
                        className={`${tech.size} object-contain filter brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity`}
                      />
                    </div>
                    
                    {/* Tech Name */}
                    
                    
                    {/* Description */}
                    <div className="text-sm text-gray-500">{tech.description}</div>
                    
                    {/* Glow effect on hover */}
                    <div className={`absolute -inset-0.5 rounded-xl bg-gradient-to-br ${tech.color} opacity-0 blur group-hover:opacity-20 transition-opacity duration-500 -z-10`} />
                  </div>
                ))}
              </div>
              
              {/* Stack Connection Visualization */}
              <div className="mt-8 p-5 rounded-xl bg-gray-900/30 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-gray-400 text-sm">Full Stack Architecture</div>
                  <div className="h-2 w-8 rounded-full bg-gradient-to-r from-cyan-500 via-green-500 to-sky-500"></div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Frontend</span>
                    <span className="text-cyan-400 font-medium">React</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Backend</span>
                    <span className="text-green-400 font-medium">Express</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Database</span>
                    <span className="text-green-300 font-medium">MongoDB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Styling</span>
                    <span className="text-sky-400 font-medium">Tailwind</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;