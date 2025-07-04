
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCallsheet, Contact } from '@/contexts/CallsheetContext';
import { ContactConsentDialog } from '@/components/gdpr/ContactConsentDialog';
import { useDataProcessingLog } from '@/hooks/useDataProcessingLog';
import { ArrowLeft, Plus, Pencil, Trash2, Users, Shield, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ContactsManagerProps {
  onBack: () => void;
}

export const ContactsManager: React.FC<ContactsManagerProps> = ({ onBack }) => {
  const { contacts, addContact, updateContact, deleteContact } = useCallsheet();
  const { logActivity } = useDataProcessingLog();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    character: '',
    department: '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [pendingContactData, setPendingContactData] = useState<any>(null);

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      phone: '',
      email: '',
      character: '',
      department: '',
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.role || !formData.phone) {
      toast({
        title: "Missing required fields",
        description: "Please fill in name, role, and phone number.",
        variant: "destructive",
      });
      return;
    }

    // Check if we're adding a new contact (not editing)
    if (!editingId) {
      setPendingContactData(formData);
      setShowConsentDialog(true);
      return;
    }

    // If editing, proceed directly
    handleContactSave(false);
  };

  const handleContactSave = async (consentObtained: boolean) => {
    try {
      const contactData = {
        ...formData,
        consent_obtained: consentObtained,
        consent_date: consentObtained ? new Date().toISOString() : null,
        data_source: 'user_input',
      };

      if (editingId) {
        await updateContact(editingId, contactData);
        await logActivity('update', 'contact', editingId);
        toast({
          title: "Contact updated",
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        const newContact = await addContact(contactData);
        await logActivity('create', 'contact', newContact.id);
        toast({
          title: "Contact added",
          description: `${formData.name} has been added to your contacts.`,
        });
      }

      resetForm();
    } catch (error) {
      toast({
        title: "Error saving contact",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (contact: Contact) => {
    setFormData({
      name: contact.name,
      role: contact.role,
      phone: contact.phone,
      email: contact.email || '',
      character: contact.character || '',
      department: contact.department || '',
    });
    setEditingId(contact.id);
  };

  const handleDelete = async (contact: Contact) => {
    if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
      try {
        await deleteContact(contact.id);
        await logActivity('delete', 'contact', contact.id);
        toast({
          title: "Contact deleted",
          description: `${contact.name} has been removed from your contacts.`,
        });
      } catch (error) {
        toast({
          title: "Error deleting contact",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mr-4 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold flex items-center">
            <Users className="w-6 h-6 mr-2" />
            Contacts Manager
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add/Edit Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? 'Edit Contact' : 'Add New Contact'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="character">Character</Label>
                  <Input
                    id="character"
                    value={formData.character}
                    onChange={(e) => setFormData({ ...formData, character: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  {editingId ? 'Update Contact' : 'Add Contact'}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Contacts List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Contacts ({contacts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {contacts.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No contacts yet. Add your first contact to get started.
                </p>
              ) : (
                contacts.map((contact) => (
                  <div key={contact.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground">{contact.role}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {contact.consent_obtained ? (
                          <ShieldCheck className="w-4 h-4 text-green-600" />
                        ) : (
                          <Shield className="w-4 h-4 text-orange-500" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(contact)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(contact)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>📞 {contact.phone}</p>
                      {contact.email && <p>✉️ {contact.email}</p>}
                      {contact.character && <p>🎭 {contact.character}</p>}
                      {contact.department && <p>🏢 {contact.department}</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ContactConsentDialog
        isOpen={showConsentDialog}
        onClose={() => {
          setShowConsentDialog(false);
          setPendingContactData(null);
        }}
        onConfirm={handleContactSave}
        contactName={pendingContactData?.name || ''}
      />
    </div>
  );
};
