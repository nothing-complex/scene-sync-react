
import React, { useState } from 'react';
import { ArrowLeft, Plus, Search, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Contact } from '@/contexts/CallsheetContext';

interface ContactSelectorProps {
  onBack: () => void;
  onSelectContact: (contact: Contact) => void;
  contacts: Contact[];
  title: string;
}

export const ContactSelector = ({ onBack, onSelectContact, contacts, title }: ContactSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewContactForm, setShowNewContactForm] = useState(false);
  const [newContactData, setNewContactData] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    character: '',
    department: '',
  });

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.character && contact.character.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.department && contact.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateNewContact = () => {
    if (!newContactData.name || !newContactData.role || !newContactData.phone) {
      alert('Please fill in name, role, and phone number');
      return;
    }

    // Create a new contact with a temporary ID
    const newContact: Contact = {
      id: `temp_${Date.now()}`,
      name: newContactData.name,
      role: newContactData.role,
      phone: newContactData.phone,
      email: newContactData.email,
      character: newContactData.character || '',
      department: newContactData.department || '',
    };

    console.log('Creating new contact from ContactSelector:', newContact);
    
    // Pass the new contact back to the parent (which will handle saving to database)
    onSelectContact(newContact);
    
    // Reset form
    setNewContactData({
      name: '',
      role: '',
      phone: '',
      email: '',
      character: '',
      department: '',
    });
    setShowNewContactForm(false);
  };

  if (showNewContactForm) {
    return (
      <div className="p-8 max-w-2xl">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => setShowNewContactForm(false)} className="mr-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Contact List
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Create New Contact</h1>
        </div>

        <Card className="bg-card text-card-foreground border-border">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-foreground">Name *</Label>
                  <Input
                    id="name"
                    value={newContactData.name}
                    onChange={(e) => setNewContactData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role" className="text-foreground">Role *</Label>
                  <Input
                    id="role"
                    value={newContactData.role}
                    onChange={(e) => setNewContactData(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g., Director, Actor, DP"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-foreground">Phone *</Label>
                  <Input
                    id="phone"
                    value={newContactData.phone}
                    onChange={(e) => setNewContactData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newContactData.email}
                    onChange={(e) => setNewContactData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@example.com"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="character" className="text-foreground">Character Name</Label>
                  <Input
                    id="character"
                    value={newContactData.character}
                    onChange={(e) => setNewContactData(prev => ({ ...prev, character: e.target.value }))}
                    placeholder="For cast members"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="department" className="text-foreground">Department</Label>
                  <Input
                    id="department"
                    value={newContactData.department}
                    onChange={(e) => setNewContactData(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="e.g., Camera, Sound, Wardrobe"
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowNewContactForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleCreateNewContact}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Add Contact
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Callsheet
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground mt-1">Select an existing contact or create a new one</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowNewContactForm(true)} 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Contact
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search contacts by name, role, character, or department..."
          className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Contacts List */}
      <div className="space-y-4">
        {filteredContacts.length === 0 && !searchTerm && (
          <Card className="bg-card text-card-foreground border-border">
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No contacts found</h3>
              <p className="text-muted-foreground mb-4">Create your first contact to get started</p>
              <Button 
                onClick={() => setShowNewContactForm(true)} 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create First Contact
              </Button>
            </CardContent>
          </Card>
        )}

        {filteredContacts.length === 0 && searchTerm && (
          <Card className="bg-card text-card-foreground border-border">
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground mb-4">No contacts found matching your search.</div>
              <Button 
                onClick={() => setShowNewContactForm(true)} 
                variant="outline"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Contact
              </Button>
            </CardContent>
          </Card>
        )}

        {filteredContacts.map((contact) => (
          <Card 
            key={contact.id} 
            className="hover:shadow-md transition-shadow cursor-pointer bg-card text-card-foreground border-border"
            onClick={() => onSelectContact(contact)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{contact.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <div className="font-medium text-foreground">Role</div>
                      <div>{contact.role}</div>
                    </div>
                    {contact.character && (
                      <div>
                        <div className="font-medium text-foreground">Character</div>
                        <div>{contact.character}</div>
                      </div>
                    )}
                    {contact.department && (
                      <div>
                        <div className="font-medium text-foreground">Department</div>
                        <div>{contact.department}</div>
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-foreground">Phone</div>
                      <div>{contact.phone}</div>
                    </div>
                    {contact.email && (
                      <div>
                        <div className="font-medium text-foreground">Email</div>
                        <div>{contact.email}</div>
                      </div>
                    )}
                  </div>
                </div>
                <User className="w-6 h-6 text-muted-foreground ml-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
