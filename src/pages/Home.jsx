import React from 'react';
import Hero from '@/components/Hero';
import Todo from '@/components/Todo';
import { Toaster } from 'react-hot-toast';

const Home = () => {
  return (
    <div className="dark bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Hero />
      <Todo />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default Home;