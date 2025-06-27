
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { Contact, ScheduleItem } from '@/types/callsheet';

interface InlineListManagerProps {
  items: (Contact | ScheduleItem)[];
  setItems: (items: (Contact | ScheduleItem)[]) => void;
  itemType: 'cast' | 'crew' | 'emergencyContact' | 'schedule';
}

export const InlineListManager = ({ items, setItems, itemType }: InlineListManagerProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const getEmptyItem = (): Contact | ScheduleItem => {
    if (itemType === 'schedule') {
      return {
        id: crypto.randomUUID(),
        sceneNumber: '',
        intExt: 'INT' as const,
        description: '',
        location: '',
        pageCount: '',
        estimatedTime: ''
      };
    } else {
      return {
        id: crypto.randomUUID(),
        name: '',
        role: '',
        phone: '',
        email: '',
        character: itemType === 'cast' ? '' : undefined,
        department: itemType === 'crew' ? '' : undefined
      };
    }
  };

  const [formData, setFormData] = useState(getEmptyItem());

  const handleAdd = () => {
    const newItem = { ...formData, id: crypto.randomUUID() };
    setItems([...items, newItem]);
    setFormData(getEmptyItem());
    setShowAddForm(false);
  };

  const handleEdit = (item: Contact | ScheduleItem) => {
    setFormData(item);
    setEditingId(item.id);
  };

  const handleSave = () => {
    setItems(items.map(item => item.id === editingId ? formData : item));
    setEditingId(null);
    setFormData(getEmptyItem());
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData(getEmptyItem());
  };

  const renderContactForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Name</Label>
          <Input
            value={(formData as Contact).name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter name"
          />
        </div>
        <div>
          <Label>Role</Label>
          <Input
            value={(formData as Contact).role || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            placeholder="Enter role"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Phone</Label>
          <Input
            value={(formData as Contact).phone || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Phone number"
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            value={(formData as Contact).email || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Email address"
          />
        </div>
      </div>
      {itemType === 'cast' && (
        <div>
          <Label>Character</Label>
          <Input
            value={(formData as Contact).character || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, character: e.target.value }))}
            placeholder="Character name"
          />
        </div>
      )}
      {itemType === 'crew' && (
        <div>
          <Label>Department</Label>
          <Input
            value={(formData as Contact).department || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
            placeholder="Department"
          />
        </div>
      )}
    </div>
  );

  const renderScheduleForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Scene Number</Label>
          <Input
            value={(formData as ScheduleItem).sceneNumber || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, sceneNumber: e.target.value }))}
            placeholder="Scene #"
          />
        </div>
        <div>
          <Label>Int/Ext</Label>
          <select
            value={(formData as ScheduleItem).intExt || 'INT'}
            onChange={(e) => setFormData(prev => ({ ...prev, intExt: e.target.value as 'INT' | 'EXT' }))}
            className="w-full p-2 border rounded"
          >
            <option value="INT">INT</option>
            <option value="EXT">EXT</option>
          </select>
        </div>
        <div>
          <Label>Location</Label>
          <Input
            value={(formData as ScheduleItem).location || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Location"
          />
        </div>
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={(formData as ScheduleItem).description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Scene description"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Page Count</Label>
          <Input
            value={(formData as ScheduleItem).pageCount || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, pageCount: e.target.value }))}
            placeholder="e.g., 2/8"
          />
        </div>
        <div>
          <Label>Estimated Time</Label>
          <Input
            value={(formData as ScheduleItem).estimatedTime || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
            placeholder="e.g., 30 min"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Items List */}
      {items.map((item) => (
        <Card key={item.id} className="p-4">
          {editingId === item.id ? (
            <div className="space-y-4">
              {itemType === 'schedule' ? renderScheduleForm() : renderContactForm()}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {itemType === 'schedule' ? (
                  <div>
                    <div className="font-medium">
                      Scene {(item as ScheduleItem).sceneNumber} - {(item as ScheduleItem).intExt} {(item as ScheduleItem).location}
                    </div>
                    <div className="text-sm text-muted-foreground">{(item as ScheduleItem).description}</div>
                    <div className="text-sm text-muted-foreground">
                      {(item as ScheduleItem).pageCount} pages, {(item as ScheduleItem).estimatedTime}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="font-medium">{(item as Contact).name}</div>
                    <div className="text-sm text-muted-foreground">{(item as Contact).role}</div>
                    {(item as Contact).character && (
                      <div className="text-sm text-muted-foreground">as {(item as Contact).character}</div>
                    )}
                    {(item as Contact).department && (
                      <div className="text-sm text-muted-foreground">{(item as Contact).department}</div>
                    )}
                    <div className="text-sm text-muted-foreground">{(item as Contact).phone}</div>
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      ))}

      {/* Add Form */}
      {showAddForm && (
        <Card className="p-4">
          <div className="space-y-4">
            {itemType === 'schedule' ? renderScheduleForm() : renderContactForm()}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Add Button */}
      {!showAddForm && editingId === null && (
        <Button variant="outline" onClick={() => setShowAddForm(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add {itemType === 'schedule' ? 'Scene' : itemType === 'cast' ? 'Cast Member' : itemType === 'crew' ? 'Crew Member' : 'Emergency Contact'}
        </Button>
      )}
    </div>
  );
};
