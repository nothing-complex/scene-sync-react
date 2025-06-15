
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Film, Clock, Users, FileText, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Clock,
      title: "Smart Scheduling",
      description: "Create detailed call sheets with automated time calculations and crew notifications."
    },
    {
      icon: Users,
      title: "Contact Management", 
      description: "Organize your cast and crew contacts with role assignments and availability tracking."
    },
    {
      icon: FileText,
      title: "Professional PDFs",
      description: "Generate beautiful, industry-standard callsheets that look polished and professional."
    }
  ];

  const testimonials = [
    {
      quote: "CallTime has transformed how we manage our film productions. Setup is incredibly fast and intuitive.",
      author: "Sarah Chen",
      role: "Independent Filmmaker"
    },
    {
      quote: "The clean interface and automated features save us hours on every shoot day preparation.",
      author: "Marcus Rodriguez", 
      role: "Production Manager"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-sand rounded-xl flex items-center justify-center">
              <Film className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">CallTime</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Sign in
            </Button>
            <Button onClick={() => navigate('/auth')} className="bg-primary hover:bg-primary/90">
              Start for free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-light text-foreground mb-6 leading-tight">
            Professional callsheets that <span className="text-primary font-medium underline decoration-primary/30">crews actually want</span> to use
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-light">
            Skip the spreadsheet chaos. CallTime delivers beautiful callsheets, streamlined contact management, and professional PDFs from day one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-foreground text-background hover:bg-foreground/90 px-8 py-3 text-lg"
            >
              Get CallTime free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/auth')}
              className="px-8 py-3 text-lg border-2"
            >
              Book a demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4">
            Everything you need for smooth productions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From pre-production planning to day-of-shoot coordination, CallTime keeps your team organized and informed.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="glass-effect border-0 card-hover">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground font-light">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Demo Preview */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="glass-effect rounded-3xl p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">Verified by production teams</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6">
              Company Wiki
            </h2>
            <p className="text-lg text-muted-foreground mb-8 font-light">
              Welcome to our production team! We are thrilled to have you join our group of dedicated professionals committed to excellence and innovation. This comprehensive guide helps you understand our culture, values, and workflow processes.
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Verified setup process</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass-effect border-0">
              <CardContent className="p-8">
                <p className="text-lg text-foreground mb-6 font-light italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-medium text-sm">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6">
            Ready to streamline your productions?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto font-light">
            Join hundreds of filmmakers who have simplified their workflow with CallTime.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg group"
          >
            Start your free account
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 gradient-sand rounded-lg flex items-center justify-center">
                <Film className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">CallTime</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 CallTime Studio Tools
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
