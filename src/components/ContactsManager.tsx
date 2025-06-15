
import { useState } from 'react';
import { ArrowLeft, Search, Plus, Edit, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCallsheet, Contact } from '@/contexts/CallsheetContext';

interface ContactsManagerProps {
  onBack: () => void;
}

export const ContactsManager = ({ onBack }: ContactsManagerProps) => {
  const { contacts, addContact, updateContact, deleteContact } = useCallsheet();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
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

  const handleCreateNew = () => {
    setFormData({
      name: '',
      role: '',
      phone: '',
      email: '',
      character: '',
      department: '',
    });
    setEditingContact(null);
    setShowForm(true);
  };

  const handleEdit = (contact: Contact) => {
    setFormData({
      name: contact.name,
      role: contact.role,
      phone: contact.phone,
      email: contact.email,
      character: contact.character || '',
      department: contact.department || '',
    });
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.role || !formData.phone) {
      alert('Please fill in name, role, and phone number');
      return;
    }

    const contactData = {
      name: formData.name,
      role: formData.role,
      phone: formData.phone,
      email: formData.email,
      character: formData.character || undefined,
      department: formData.department || undefined,
    };

    if (editingContact) {
      updateContact(editingContact.id, contactData);
    } else {
      addContact(contactData);
    }

    setShowForm(false);
    setEditingContact(null);
  };

  const handleDelete = (contact: Contact) => {
    if (confirm(`Are you sure you want to delete ${contact.name}?`)) {
      deleteContact(contact.id);
    }
  };

  if (showForm) {
    return (
      <div className="p-8 max-w-2xl">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => setShowForm(false)} className="mr-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Contacts
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {editingContact ? 'Edit Contact' : 'Create New Contact'}
          </h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g., Director, Actor, DP"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="character">Character Name</Label>
                  <Input
                    id="character"
                    value={formData.character}
                    onChange={(e) => setFormData(prev => ({ ...prev, character: e.target.value }))}
                    placeholder="For cast members"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="e.g., Camera, Sound, Wardrobe"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingContact ? 'Update Contact' : 'Create Contact'}
                </Button>
              </div>
            </form>
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
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact Database</h1>
            <p className="text-gray-600 mt-1">Manage your cast, crew, and emergency contacts</p>
          </div>
        </div>
        <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-5 h-5 mr-2" />
          New Contact
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cast Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.character).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crew Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.department && !c.character).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search contacts by name, role, character, or department..."
          className="pl-10"
        />
      </div>

      {/* Contacts List */}
      <div className="space-y-4">
        {filteredContacts.length === 0 && !searchTerm && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No contacts yet</h3>
              <p className="text-gray-600 mb-4">Start building your contact database</p>
              <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-5 h-5 mr-2" />
                Create First Contact
              </Button>
            </CardContent>
          </Card>
        )}

        {filteredContacts.length === 0 && searchTerm && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-500">No contacts found matching your search.</div>
            </CardContent>
          </Card>
        )}

        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{contact.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <div className="font-medium">Role</div>
                      <div>{contact.role}</div>
                    </div>
                    {contact.character && (
                      <div>
                        <div className="font-medium">Character</div>
                        <div>{contact.character}</div>
                      </div>
                    )}
                    {contact.department && (
                      <div>
                        <div className="font-medium">Department</div>
                        <div>{contact.department}</div>
                      </div>
                    )}
                    <div>
                      <div className="font-medium">Phone</div>
                      <div>{contact.phone}</div>
                    </div>
                    {contact.email && (
                      <div>
                        <div className="font-medium">Email</div>
                        <div>{contact.email}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(contact)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(contact)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
