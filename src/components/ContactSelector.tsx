
import { useState } from 'react';
import { ArrowLeft, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  const [newContact, setNewContact] = useState({
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
    (contact.character && contact.character.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateNewContact = () => {
    if (!newContact.name || !newContact.role || !newContact.phone) {
      alert('Please fill in name, role, and phone number');
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      role: newContact.role,
      phone: newContact.phone,
      email: newContact.email,
      character: newContact.character,
      department: newContact.department,
    };

    onSelectContact(contact);
  };

  if (showNewContactForm) {
    return (
      <div className="p-8 max-w-2xl">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => setShowNewContactForm(false)} className="mr-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Contacts
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Create New Contact</h1>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <Input
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <Input
                  value={newContact.role}
                  onChange={(e) => setNewContact(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g., Director, Actor, DP"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <Input
                  value={newContact.phone}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Character Name</label>
                <Input
                  value={newContact.character}
                  onChange={(e) => setNewContact(prev => ({ ...prev, character: e.target.value }))}
                  placeholder="For cast members"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <Input
                  value={newContact.department}
                  onChange={(e) => setNewContact(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="e.g., Camera, Sound, Wardrobe"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={() => setShowNewContactForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateNewContact} className="bg-blue-600 hover:bg-blue-700">
                Create & Add Contact
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">Select from existing contacts or create a new one</p>
        </div>
        <Button onClick={() => setShowNewContactForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-5 h-5 mr-2" />
          New Contact
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search contacts by name, role, or character..."
          className="pl-10"
        />
      </div>

      {/* Contacts List */}
      <div className="grid gap-4">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>{contact.role}</div>
                    {contact.character && <div>Character: {contact.character}</div>}
                    {contact.department && <div>Department: {contact.department}</div>}
                    <div>{contact.phone}</div>
                    {contact.email && <div>{contact.email}</div>}
                  </div>
                </div>
                <Button
                  onClick={() => onSelectContact(contact)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Select
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredContacts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-500">
                {searchTerm ? 'No contacts found matching your search.' : 'No contacts available.'}
              </div>
              <Button
                onClick={() => setShowNewContactForm(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Contact
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
