
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Star, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isScrolling, setIsScrolling] = useState(false);

  // Add debug logging to see auth state
  useEffect(() => {
    console.log('LandingPage - Auth state:', { user: user?.email, loading });
  }, [user, loading]);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const features = [
    {
      title: "Professional Callsheets",
      description: "Create detailed callsheets with project information, locations, and contact details in minutes."
    },
    {
      title: "Contact Management", 
      description: "Organize your cast and crew contacts with role assignments and easy access for future projects."
    },
    {
      title: "Beautiful PDFs",
      description: "Generate polished, industry-standard callsheet PDFs with customizable appearance and branding."
    }
  ];

  const testimonials = [
    {
      quote: "CallTime makes creating professional callsheets incredibly fast and straightforward.",
      author: "Sarah Chen",
      role: "Independent Filmmaker"
    },
    {
      quote: "Finally, a tool that generates beautiful callsheets without the spreadsheet headaches.",
      author: "Marcus Rodriguez", 
      role: "Production Manager"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Softer Header */}
      <header className="border-b border-border/30 bg-background/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-medium text-foreground tracking-tight">CallTime</span>
          </div>
          <div className="flex items-center space-x-3">
            {loading ? (
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <Button onClick={() => navigate('/')} className="btn-primary flex items-center space-x-2">
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')} className="font-normal">
                  Sign in
                </Button>
                <Button onClick={() => navigate('/auth')} className="btn-primary">
                  Start for free
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Softer Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <h1 className={`text-5xl md:text-7xl font-medium text-foreground leading-[1.1] tracking-tight mb-6 animate-scroll-follow ${isScrolling ? 'scrolling' : ''}`}>
            Professional callsheets crews{' '}
            <span className="text-foreground">actually</span>{' '}
            <span className="text-primary interactive-underline">want</span>{' '}
            <span className="text-primary">to</span> use.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Create beautiful and functional callsheets in minutes. Manage your contacts, customize your PDFs, and deliver professional-looking callsheets that crews can rely on.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="btn-primary text-base"
            >
              Create your first callsheet
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/auth')}
              className="btn-secondary text-base"
            >
              See how it works
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="section-heading mb-4">
            Everything you need for professional callsheets
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From project setup to PDF generation, CallTime streamlines your callsheet creation process.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="feature-card border-0">
              <CardContent className="p-8">
                <h3 className="text-xl font-medium text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="glass-effect rounded-2xl p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-muted-foreground font-normal">Used by production teams</span>
            </div>
            
            <h2 className="section-heading mb-6">
              Simple. Professional. Reliable.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              CallTime brings order to your production workflow. Create callsheets with project details, location information, and cast & crew contacts. Generate beautiful PDFs that your team can depend on, shoot after shoot.
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-normal">Ready to use in minutes</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="testimonial-card border-0">
              <CardContent className="p-8">
                <p className="text-lg text-foreground mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/15 rounded-full flex items-center justify-center">
                    <span className="text-primary font-medium text-sm">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.author}</p>
                    <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="section-heading mb-6">
            Ready to create professional callsheets?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join filmmakers who have streamlined their callsheet process with CallTime.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="btn-primary text-base group"
          >
            Start creating callsheets
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      <footer className="border-t border-border/30 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">CallTime</span>
            <div className="text-muted-foreground font-normal text-sm">
              © 2024 CallTime Studio Tools
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

