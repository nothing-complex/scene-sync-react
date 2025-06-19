
import React from 'react';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { Calendar, Clock, MapPin, Phone, Mail, AlertTriangle } from 'lucide-react';

interface CallsheetPDFPreviewProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
  className?: string;
}

export const CallsheetPDFPreview: React.FC<CallsheetPDFPreviewProps> = ({
  callsheet,
  customization,
  className = ''
}) => {
  const {
    layout,
    typography,
    colors,
    branding
  } = customization;

  // CSS variables for customization
  const cssVariables = {
    '--pdf-font-family': typography.fontFamily === 'helvetica' ? 'Arial, sans-serif' : 
                        typography.fontFamily === 'inter' ? 'Inter, sans-serif' : 
                        typography.fontFamily === 'poppins' ? 'Poppins, sans-serif' :
                        typography.fontFamily === 'montserrat' ? 'Montserrat, sans-serif' :
                        'Arial, sans-serif',
    '--pdf-font-size': `${typography.fontSize.body}px`,
    '--pdf-primary-color': colors.primary,
    '--pdf-secondary-color': colors.secondary,
    '--pdf-text-color': colors.text,
    '--pdf-background-color': colors.background,
  } as React.CSSProperties;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isHeaderCentered = layout.headerStyle === 'minimal' || layout.headerStyle === 'creative';

  return (
    <div 
      className={`bg-white text-black min-h-[11in] w-[8.5in] mx-auto p-8 ${className}`}
      style={cssVariables}
      id="pdf-content"
    >
      {/* Header */}
      <div className={`mb-8 ${isHeaderCentered ? 'text-center' : 'text-left'}`}>
        {branding.logo && typeof branding.logo === 'object' && branding.logo.url && (
          <div className="mb-4">
            <img 
              src={branding.logo.url} 
              alt="Company Logo" 
              className="h-16 w-auto"
              style={{ 
                margin: isHeaderCentered ? '0 auto' : '0',
                display: isHeaderCentered ? 'block' : 'inline-block'
              }}
            />
          </div>
        )}
        {branding.logo && typeof branding.logo === 'string' && (
          <div className="mb-4">
            <img 
              src={branding.logo} 
              alt="Company Logo" 
              className="h-16 w-auto"
              style={{ 
                margin: isHeaderCentered ? '0 auto' : '0',
                display: isHeaderCentered ? 'block' : 'inline-block'
              }}
            />
          </div>
        )}
        <h1 
          className="text-4xl font-bold mb-2"
          style={{ 
            fontFamily: 'var(--pdf-font-family)',
            color: 'var(--pdf-primary-color)'
          }}
        >
          {callsheet.projectTitle}
        </h1>
        <h2 
          className="text-2xl font-semibold"
          style={{ 
            fontFamily: 'var(--pdf-font-family)',
            color: 'var(--pdf-secondary-color)'
          }}
        >
          CALL SHEET
        </h2>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" style={{ color: 'var(--pdf-primary-color)' }} />
            <div>
              <div className="font-semibold">Shoot Date</div>
              <div>{formatDate(callsheet.shootDate)}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" style={{ color: 'var(--pdf-primary-color)' }} />
            <div>
              <div className="font-semibold">General Call Time</div>
              <div>{callsheet.generalCallTime}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" style={{ color: 'var(--pdf-primary-color)' }} />
            <div>
              <div className="font-semibold">Location</div>
              <div>{callsheet.location}</div>
              {callsheet.locationAddress && (
                <div className="text-sm text-gray-600">{callsheet.locationAddress}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule */}
      {callsheet.schedule.length > 0 && (
        <div className="mb-8">
          <h3 
            className="text-xl font-bold mb-4"
            style={{ 
              fontFamily: 'var(--pdf-font-family)',
              color: 'var(--pdf-primary-color)'
            }}
          >
            SCHEDULE
          </h3>
          <div className="border border-gray-300">
            <div className="grid grid-cols-5 bg-gray-100 font-semibold text-sm">
              <div className="p-2 border-r border-gray-300">Scene</div>
              <div className="p-2 border-r border-gray-300">Int/Ext</div>
              <div className="p-2 border-r border-gray-300">Description</div>
              <div className="p-2 border-r border-gray-300">Location</div>
              <div className="p-2">Time</div>
            </div>
            {callsheet.schedule.map((item, index) => (
              <div key={item.id} className={`grid grid-cols-5 text-sm ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="p-2 border-r border-gray-300 font-medium">{item.sceneNumber}</div>
                <div className="p-2 border-r border-gray-300">{item.intExt}</div>
                <div className="p-2 border-r border-gray-300">{item.description}</div>
                <div className="p-2 border-r border-gray-300">{item.location}</div>
                <div className="p-2">{item.estimatedTime}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cast */}
      {callsheet.cast.length > 0 && (
        <div className="mb-8">
          <h3 
            className="text-xl font-bold mb-4"
            style={{ 
              fontFamily: 'var(--pdf-font-family)',
              color: 'var(--pdf-primary-color)'
            }}
          >
            CAST
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {callsheet.cast.map((member) => (
              <div key={member.id} className="border border-gray-300 p-3">
                <div className="font-semibold">{member.name}</div>
                {member.character && (
                  <div className="text-sm text-gray-600 mb-1">as {member.character}</div>
                )}
                <div className="flex items-center text-sm mb-1">
                  <Phone className="w-3 h-3 mr-1" />
                  {member.phone}
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="w-3 h-3 mr-1" />
                  {member.email}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crew */}
      {callsheet.crew.length > 0 && (
        <div className="mb-8">
          <h3 
            className="text-xl font-bold mb-4"
            style={{ 
              fontFamily: 'var(--pdf-font-family)',
              color: 'var(--pdf-primary-color)'
            }}
          >
            CREW
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {callsheet.crew.map((member) => (
              <div key={member.id} className="border border-gray-300 p-3">
                <div className="font-semibold">{member.name}</div>
                <div className="text-sm text-gray-600 mb-1">{member.role}</div>
                <div className="flex items-center text-sm mb-1">
                  <Phone className="w-3 h-3 mr-1" />
                  {member.phone}
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="w-3 h-3 mr-1" />
                  {member.email}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Contacts */}
      {callsheet.emergencyContacts.length > 0 && (
        <div className="mb-8">
          <h3 
            className="text-xl font-bold mb-4 flex items-center"
            style={{ 
              fontFamily: 'var(--pdf-font-family)',
              color: 'var(--pdf-primary-color)'
            }}
          >
            <AlertTriangle className="w-5 h-5 mr-2" />
            EMERGENCY CONTACTS
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {callsheet.emergencyContacts.map((contact) => (
              <div key={contact.id} className="border border-red-300 bg-red-50 p-3">
                <div className="font-semibold">{contact.name}</div>
                <div className="text-sm text-gray-600 mb-1">{contact.role}</div>
                <div className="flex items-center text-sm font-medium">
                  <Phone className="w-3 h-3 mr-1" />
                  {contact.phone}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div className="grid grid-cols-1 gap-6">
        {callsheet.parkingInstructions && (
          <div>
            <h4 className="font-semibold mb-2">Parking Instructions</h4>
            <p className="text-sm">{callsheet.parkingInstructions}</p>
          </div>
        )}

        {callsheet.basecampLocation && (
          <div>
            <h4 className="font-semibold mb-2">Basecamp Location</h4>
            <p className="text-sm">{callsheet.basecampLocation}</p>
          </div>
        )}

        {callsheet.weather && (
          <div>
            <h4 className="font-semibold mb-2">Weather</h4>
            <p className="text-sm">{callsheet.weather}</p>
          </div>
        )}

        {callsheet.specialNotes && (
          <div>
            <h4 className="font-semibold mb-2">Special Notes</h4>
            <p className="text-sm">{callsheet.specialNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
