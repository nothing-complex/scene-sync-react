
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Film, Clock, Users, FileText, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Professional Callsheets",
      description: "Create detailed callsheets with project information, locations, and contact details in minutes."
    },
    {
      icon: Users,
      title: "Contact Management", 
      description: "Organize your cast and crew contacts with role assignments and easy access for future projects."
    },
    {
      icon: Clock,
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
      {/* Enhanced Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 gradient-sand rounded-2xl flex items-center justify-center shadow-lg">
              <Film className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground tracking-tight">CallTime</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/auth')} className="font-medium">
              Sign in
            </Button>
            <Button onClick={() => navigate('/auth')} className="btn-primary">
              Start for free
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="max-w-5xl mx-auto animate-fade-in-up">
          <h1 className="hero-text mb-8">
            Professional callsheets that{' '}
            <span className="text-primary interactive-underline">crews actually want</span>{' '}
            to use
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Create beautiful callsheets in minutes. Manage your contacts, customize your PDFs, and deliver professional-looking callsheets that crews can rely on.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="btn-primary text-lg animate-bounce-subtle"
            >
              Create your first callsheet
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/auth')}
              className="btn-secondary text-lg"
            >
              See how it works
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <h2 className="section-heading mb-6">
            Everything you need for professional callsheets
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From project setup to PDF generation, CallTime streamlines your callsheet creation process.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="feature-card border-0">
              <CardContent className="p-10">
                <div className="w-20 h-20 bg-primary/15 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <feature.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-6">{feature.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Enhanced Demo Preview */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="glass-effect rounded-3xl p-16 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-muted-foreground font-medium">Used by production teams</span>
            </div>
            
            <h2 className="section-heading mb-8">
              Simple. Professional. Reliable.
            </h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              CallTime brings order to your production workflow. Create callsheets with project details, location information, and cast & crew contacts. Generate beautiful PDFs that your team can depend on, shoot after shoot.
            </p>
            
            <div className="flex items-center justify-center space-x-3 text-muted-foreground">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-medium">Ready to use in minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="testimonial-card border-0">
              <CardContent className="p-10">
                <p className="text-xl text-foreground mb-8 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-lg">{testimonial.author}</p>
                    <p className="text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center">
          <h2 className="section-heading mb-8">
            Ready to create professional callsheets?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Join filmmakers who have streamlined their callsheet process with CallTime.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="btn-primary text-lg group"
          >
            Start creating callsheets
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="border-t border-border/40 bg-muted/50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 gradient-sand rounded-xl flex items-center justify-center shadow-md">
                <Film className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground text-xl">CallTime</span>
            </div>
            <div className="text-muted-foreground font-medium">
              © 2024 CallTime Studio Tools
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
