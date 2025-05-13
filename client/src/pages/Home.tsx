import React from 'react';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import TranscriptionTool from '@/components/TranscriptionTool';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import GlobalUsage from '@/components/GlobalUsage';
import Pricing from '@/components/Pricing';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>TranscribeAI - Video Transcription Service</title>
        <meta name="description" content="Convert YouTube, TikTok, and Instagram videos to text with our AI-powered transcription service. Fast, accurate, and completely free." />
        <meta property="og:title" content="TranscribeAI - Instant Video Transcription" />
        <meta property="og:description" content="Transcribe any video from YouTube, TikTok, or Instagram instantly and for free." />
        <meta property="og:type" content="website" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Helmet>
      <NavBar />
      <Hero />
      <TranscriptionTool />
      <Features />
      <HowItWorks />
      <Testimonials />
      <GlobalUsage />
      <Pricing />
      <CallToAction />
      <Footer />
    </>
  );
};

export default Home;
