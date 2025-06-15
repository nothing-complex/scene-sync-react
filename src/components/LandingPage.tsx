
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
            Create beautiful callsheets in minutes. Manage your contacts, customize your PDFs, and deliver professional-looking callsheets that crews can rely on.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-foreground text-background hover:bg-foreground/90 px-8 py-3 text-lg"
            >
              Create your first callsheet
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/auth')}
              className="px-8 py-3 text-lg border-2"
            >
              See how it works
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4">
            Everything you need for professional callsheets
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From project setup to PDF generation, CallTime streamlines your callsheet creation process.
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
              <span className="text-sm text-muted-foreground">Used by production teams</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6">
              Simple. Professional. Reliable.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 font-light">
              CallTime brings order to your production workflow. Create callsheets with project details, location information, and cast & crew contacts. Generate beautiful PDFs that your team can depend on, shoot after shoot.
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Ready to use in minutes</span>
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
            Ready to create professional callsheets?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto font-light">
            Join filmmakers who have streamlined their callsheet process with CallTime.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg group"
          >
            Start creating callsheets
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
