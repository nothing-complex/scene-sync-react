import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization } from '@/types/pdfTypes';
import { EmergencyNumbers } from '../EmergencyNumbers';
import { getEmergencyNumberFromLocation, getCountryCodeFromLocation } from '@/utils/emergencyNumberUtils';
import { EmergencyServiceApi } from '@/services/emergencyService';

interface CallsheetPDFPreviewProps {
  callsheet: CallsheetData;
  customization: PDFCustomization;
  className?: string;
}

interface ContactCardProps {
  contact: any;
  isEmergency?: boolean;
  customization: PDFCustomization;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, isEmergency = false, customization }) => {
  const isTraditional = customization.theme.name === 'Traditional';
  const isEvent = customization.theme.name === 'Event';
  const isDense = customization.theme.name === 'Dense';
  
  if (isTraditional) {
    return (
      <div className="border-2 border-black p-2" style={{
        fontSize: `${customization.typography.fontSize.body}px`,
        lineHeight: customization.typography.lineHeight.body
      }}>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="font-bold">{contact.name}</div>
          <div>{contact.character || contact.role}</div>
          <div>{contact.phone}</div>
        </div>
      </div>
    );
  }

  if (isDense) {
    return (
      <div className="border border-gray-600 bg-gray-50" style={{
        fontSize: `${customization.typography.fontSize.body}px`,
        color: customization.colors.text
      }}>
        <div className="grid grid-cols-4 gap-0">
          <div className="p-2 border-r border-gray-600 font-semibold text-xs">{contact.name}</div>
          <div className="p-2 border-r border-gray-600 text-xs">{contact.character || contact.role}</div>
          <div className="p-2 border-r border-gray-600 text-xs font-mono">{contact.phone}</div>
          <div className="p-2 text-xs">{contact.email ? '✓' : '-'}</div>
        </div>
      </div>
    );
  }

  const cardStyle: React.CSSProperties = {
    borderRadius: `${customization.visual.cornerRadius}px`,
    backgroundColor: customization.colors.surface,
    borderColor: customization.colors.border,
    color: customization.colors.text,
    fontFamily: getFontFamily(customization.typography.fontFamily)
  };

  if (customization.visual.cardStyle === 'gradient' && customization.colors.gradient) {
    const { from, to, direction } = customization.colors.gradient;
    const gradientDirection = direction === 'to-r' ? 'to right' :
                            direction === 'to-br' ? 'to bottom right' : 'to bottom';
    cardStyle.background = `linear-gradient(${gradientDirection}, ${from}40, ${to}40)`;
  }

  const shadowClass = customization.visual.shadowIntensity === 'medium' ? 'shadow-md' :
                     customization.visual.shadowIntensity === 'subtle' ? 'shadow-sm' : '';

  return (
    <Card className={`${shadowClass} ${isEmergency ? 'border-l-4 border-l-red-500' : ''}`} style={cardStyle}>
      <CardContent className="p-4">
        <div className="font-medium mb-1" style={{ 
          fontSize: `${customization.typography.fontSize.header}px`,
          fontWeight: getFontWeight(customization.typography.fontWeight.header),
          color: isEvent ? customization.colors.headerText : customization.colors.text
        }}>
          {contact.name}
        </div>
        {(contact.character || contact.role) && (
          <div className="mb-2 italic" style={{ 
            color: customization.colors.textLight,
            fontSize: `${customization.typography.fontSize.small}px`
          }}>
            {contact.character ? `as ${contact.character}` : contact.role}
          </div>
        )}
        <div className="mb-1" style={{ 
          fontSize: `${customization.typography.fontSize.body}px`,
          fontWeight: isEmergency ? '500' : 'normal',
          color: isEvent ? customization.colors.text : customization.colors.text
        }}>
          📞 {contact.phone}
        </div>
        {contact.email && !isEmergency && (
          <div style={{ 
            fontSize: `${customization.typography.fontSize.small}px`,
            color: customization.colors.textLight
          }}>
            📧 {contact.email}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ContactSection: React.FC<{
  title: string;
  contacts: any[];
  icon: string;
  isEmergency?: boolean;
  customization: PDFCustomization;
  emergencyNumber?: string;
}> = ({ title, contacts, icon, isEmergency = false, customization, emergencyNumber }) => {
  const isTraditional = customization.theme.name === 'Traditional';
  const isDense = customization.theme.name === 'Dense';
  const isMinimal = customization.theme.name === 'Minimal';
  
  const emergencyNumbers = emergencyNumber ? {
    general: emergencyNumber,
    police: emergencyNumber,
    fire: emergencyNumber,
    medical: emergencyNumber
  } : {
    general: '911',
    police: '911',
    fire: '911',
    medical: '911'
  };

  if (isTraditional) {
    return (
      <div className="mb-6">
        <div className="border-2 border-black bg-black text-white p-2 mb-2">
          <h3 className="font-bold text-center" style={{
            fontSize: `${customization.typography.fontSize.header + 2}px`
          }}>
            {title}
          </h3>
        </div>
        <div className="space-y-0">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              isEmergency={isEmergency}
              customization={customization}
            />
          ))}
        </div>
      </div>
    );
  }

  if (isDense) {
    return (
      <div className="mb-6">
        <div className="bg-black text-white p-3 border-2 border-black">
          <h3 className="font-bold text-center" style={{
            fontSize: `${customization.typography.fontSize.header + 2}px`
          }}>
            {title}
          </h3>
        </div>
        <div className="border-2 border-black border-t-0">
          <div className="grid grid-cols-4 bg-gray-200 border-b border-black">
            <div className="p-2 border-r border-black font-bold text-xs">NAME</div>
            <div className="p-2 border-r border-black font-bold text-xs">ROLE</div>
            <div className="p-2 border-r border-black font-bold text-xs">PHONE</div>
            <div className="p-2 font-bold text-xs">EMAIL</div>
          </div>
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              isEmergency={isEmergency}
              customization={customization}
            />
          ))}
        </div>
      </div>
    );
  }

  const gridClass = customization.visual.cardStyle === 'minimal' ? 'space-y-3' :
                   customization.theme.name === 'Event' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' :
                   'grid grid-cols-1 md:grid-cols-2 gap-4';

  return (
    <div className="mb-8 avoid-break">
      <h3 className="font-semibold mb-4 flex items-center gap-2" style={{
        color: customization.colors.text,
        fontSize: `${customization.typography.fontSize.header + 4}px`,
        fontWeight: getFontWeight(customization.typography.fontWeight.header)
      }}>
        {!isMinimal && <span className="text-xl">{icon}</span>}
        {title}
      </h3>
      
      {isEmergency && emergencyNumber && (
        <div className="mb-4 avoid-break">
          <EmergencyNumbers emergencyNumbers={emergencyNumbers} />
        </div>
      )}
      
      <div className={gridClass}>
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            isEmergency={isEmergency}
            customization={customization}
          />
        ))}
      </div>
    </div>
  );
};

const ScheduleSection: React.FC<{
  schedule: any[];
  customization: PDFCustomization;
}> = ({ schedule, customization }) => {
  const isTraditional = customization.theme.name === 'Traditional';
  const isEvent = customization.theme.name === 'Event';
  const isDense = customization.theme.name === 'Dense';

  if (isTraditional) {
    return (
      <div className="mb-6">
        <div className="border-2 border-black bg-black text-white p-2 mb-2">
          <h3 className="font-bold text-center">SCHEDULE</h3>
        </div>
        <div className="border-2 border-black border-t-0">
          <div className="grid grid-cols-5 bg-gray-200 border-b-2 border-black text-xs font-bold">
            <div className="p-1 border-r border-black">SCENE</div>
            <div className="p-1 border-r border-black">INT/EXT</div>
            <div className="p-1 border-r border-black">DESCRIPTION</div>
            <div className="p-1 border-r border-black">TIME</div>
            <div className="p-1">PAGES</div>
          </div>
          {schedule.map((item, index) => (
            <div key={index} className="grid grid-cols-5 text-xs border-b border-black">
              <div className="p-1 border-r border-black font-bold">{item.sceneNumber}</div>
              <div className="p-1 border-r border-black">{item.intExt}</div>
              <div className="p-1 border-r border-black">{item.description}</div>
              <div className="p-1 border-r border-black">{item.estimatedTime}</div>
              <div className="p-1">{item.pageCount || '-'}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isEvent) {
    return (
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-6 text-center" style={{
          color: customization.colors.accent,
          fontSize: `${customization.typography.fontSize.header + 8}px`
        }}>
          Event Schedule & Contact Details
        </h3>
        <div className="space-y-4">
          {schedule.map((item, index) => (
            <Card key={index} className="overflow-hidden" style={{
              background: `linear-gradient(135deg, ${customization.colors.surface}, ${customization.colors.surfaceHover})`,
              borderRadius: `${customization.visual.cornerRadius}px`,
              color: customization.colors.text
            }}>
              <CardContent className="p-6">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="font-bold text-lg" style={{ color: customization.colors.accent }}>
                      {item.estimatedTime}
                    </div>
                    <div className="text-sm opacity-80">{item.sceneNumber}</div>
                  </div>
                  <div>
                    <div className="font-semibold">{item.intExt}</div>
                    <div className="text-sm opacity-80">{item.location || 'Location TBD'}</div>
                  </div>
                  <div>
                    <div className="font-medium">{item.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold" style={{ color: customization.colors.accent }}>
                      {item.pageCount || '-'}
                    </div>
                    <div className="text-sm opacity-80">pages</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const tableStyle = {
    borderRadius: `${customization.visual.cornerRadius}px`,
    backgroundColor: customization.colors.surface,
    borderColor: customization.colors.border,
    fontFamily: getFontFamily(customization.typography.fontFamily)
  };

  return (
    <div className="mb-6 avoid-break">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{
        color: customization.colors.text,
        fontSize: `${customization.typography.fontSize.header + 4}px`,
        fontWeight: getFontWeight(customization.typography.fontWeight.header)
      }}>
        📋 SCHEDULE
      </h3>
      
      <Card style={tableStyle}>
        <div className="overflow-hidden">
          <div className="grid grid-cols-5 gap-0 font-medium border-b-2" style={{
            backgroundColor: customization.colors.surfaceHover,
            borderColor: customization.colors.border,
            fontSize: `${customization.typography.fontSize.header}px`,
            color: customization.colors.text
          }}>
            <div className="p-4 border-r" style={{ borderColor: customization.colors.border }}>Scene</div>
            <div className="p-4 border-r" style={{ borderColor: customization.colors.border }}>Int/Ext</div>
            <div className="p-4 border-r" style={{ borderColor: customization.colors.border }}>Description</div>
            <div className="p-4 border-r" style={{ borderColor: customization.colors.border }}>Time</div>
            <div className="p-4">Pages</div>
          </div>
          {schedule.map((item, index) => (
            <div key={index} className="grid grid-cols-5 gap-0 border-b" style={{
              backgroundColor: index % 2 === 1 ? customization.colors.surface : customization.colors.background,
              borderColor: customization.colors.borderLight,
              fontSize: `${customization.typography.fontSize.body}px`,
              color: customization.colors.text
            }}>
              <div className="p-3 font-medium border-r" style={{ borderColor: customization.colors.borderLight }}>
                {item.sceneNumber}
              </div>
              <div className="p-3 border-r" style={{ borderColor: customization.colors.borderLight }}>
                {item.intExt}
              </div>
              <div className="p-3 border-r" style={{ borderColor: customization.colors.borderLight }}>
                {item.description}
              </div>
              <div className="p-3 border-r" style={{ borderColor: customization.colors.borderLight }}>
                {item.estimatedTime}
              </div>
              <div className="p-3">
                {item.pageCount || '-'}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const getFontFamily = (fontFamily: string) => {
  switch (fontFamily) {
    case 'inter': return 'Inter, sans-serif';
    case 'helvetica': return 'Helvetica, Arial, sans-serif';
    case 'poppins': return 'Poppins, sans-serif';
    case 'montserrat': return 'Montserrat, sans-serif';
    default: return 'Inter, sans-serif';
  }
};

const getFontWeight = (weight: string) => {
  switch (weight) {
    case 'normal': return '400';
    case 'medium': return '500';
    case 'semibold': return '600';
    case 'bold': return '700';
    default: return '400';
  }
};

export const CallsheetPDFPreview: React.FC<CallsheetPDFPreviewProps> = ({ 
  callsheet, 
  customization,
  className = ""
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const emergencyNumber = callsheet.emergencyNumber || getEmergencyNumberFromLocation(callsheet.location);
  const countryCode = getCountryCodeFromLocation(callsheet.location);
  const emergencyNumbers = EmergencyServiceApi.getEmergencyNumbers(countryCode);

  const isEvent = customization.theme.name === 'Event';
  const isTraditional = customization.theme.name === 'Traditional';
  const isMinimal = customization.theme.name === 'Minimal';

  const containerStyles = {
    backgroundColor: customization.colors.background,
    color: customization.colors.text,
    fontFamily: getFontFamily(customization.typography.fontFamily),
    fontSize: `${customization.typography.fontSize.body}px`,
    lineHeight: customization.typography.lineHeight.body,
    padding: isTraditional ? '1rem' : '2rem',
    minHeight: '100vh',
    position: 'relative' as const,
    paddingBottom: '4rem'
  };

  const getHeaderBackgroundStyle = () => {
    const { headerBackground } = customization.visual;
    const baseStyle = {
      borderRadius: `${customization.visual.cornerRadius}px`,
      padding: isEvent ? '2rem' : '1.5rem',
      marginBottom: '2rem'
    };

    if (isEvent && customization.colors.gradient) {
      const { from, to, direction } = customization.colors.gradient;
      const gradientDirection = direction === 'to-r' ? 'to right' :
                              direction === 'to-br' ? 'to bottom right' : 'to bottom';
      return {
        ...baseStyle,
        background: `linear-gradient(${gradientDirection}, ${from}, ${to})`,
        color: customization.colors.headerText,
        borderRadius: '24px'
      };
    }

    switch (headerBackground) {
      case 'subtle':
        return { 
          ...baseStyle, 
          backgroundColor: customization.colors.surface,
          color: customization.colors.text
        };
      case 'solid':
        return { 
          ...baseStyle, 
          backgroundColor: customization.colors.headerBackground,
          color: customization.colors.headerText
        };
      case 'gradient':
        if (customization.colors.gradient) {
          const { from, to, direction } = customization.colors.gradient;
          const gradientDirection = direction === 'to-r' ? 'to right' :
                                  direction === 'to-br' ? 'to bottom right' : 'to bottom';
          return {
            ...baseStyle,
            background: `linear-gradient(${gradientDirection}, ${from}, ${to})`,
            color: customization.colors.headerText
          };
        }
        return { 
          ...baseStyle, 
          backgroundColor: customization.colors.headerBackground,
          color: customization.colors.headerText
        };
      default:
        return isTraditional ? {
          border: '3px solid black',
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: 'white',
          color: 'black'
        } : { 
          marginBottom: '1.5rem',
          color: customization.colors.text
        };
    }
  };

  const headerStyles = {
    textAlign: (isEvent || customization.layout.headerStyle === 'creative' ? 'center' : 'left') as 'center' | 'left',
    ...getHeaderBackgroundStyle()
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`} style={containerStyles}>
      {/* Header Section */}
      <div style={headerStyles}>
        <h1 className="font-bold mb-3" style={{
          fontSize: `${customization.typography.fontSize.title}px`,
          fontWeight: getFontWeight(customization.typography.fontWeight.title),
          color: headerStyles.color,
          lineHeight: customization.typography.lineHeight.title,
          margin: '0 0 12px 0'
        }}>
          {isEvent ? 'EVENT Call Sheet' : callsheet.projectTitle}
        </h1>
        <h2 className="font-semibold" style={{
          fontSize: `${customization.typography.fontSize.header}px`,
          fontWeight: getFontWeight(customization.typography.fontWeight.header),
          color: headerStyles.color,
          lineHeight: customization.typography.lineHeight.header,
          margin: 0
        }}>
          {isEvent ? callsheet.projectTitle : 'CALL SHEET'}
        </h2>
      </div>

      {/* Production Details Grid */}
      {!isTraditional && (
        <div className={`grid ${isEvent ? 'grid-cols-2' : 'grid-cols-3'} gap-4 mb-8 avoid-break`}>
          <Card style={{ 
            borderRadius: `${customization.visual.cornerRadius}px`,
            backgroundColor: customization.colors.surface,
            borderColor: customization.colors.border
          }}>
            <CardContent className="p-4 flex items-start gap-2">
              {!isMinimal && <span className="text-lg flex-shrink-0">📅</span>}
              <div className="flex-1">
                <div className="font-medium mb-1" style={{ 
                  color: customization.colors.text,
                  fontSize: `${customization.typography.fontSize.header}px`
                }}>
                  {isEvent ? 'Date' : 'Shoot Date'}
                </div>
                <div style={{ fontSize: `${customization.typography.fontSize.body}px`, color: customization.colors.text }}>
                  {formatDate(callsheet.shootDate)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ 
            borderRadius: `${customization.visual.cornerRadius}px`,
            backgroundColor: customization.colors.surface,
            borderColor: customization.colors.border
          }}>
            <CardContent className="p-4 flex items-start gap-2">
              {!isMinimal && <span className="text-lg flex-shrink-0">🕐</span>}
              <div className="flex-1">
                <div className="font-medium mb-1" style={{ 
                  color: customization.colors.text,
                  fontSize: `${customization.typography.fontSize.header}px`
                }}>
                  Call Time
                </div>
                <div style={{ fontSize: `${customization.typography.fontSize.body}px`, color: customization.colors.text }}>
                  {callsheet.generalCallTime}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ 
            borderRadius: `${customization.visual.cornerRadius}px`,
            backgroundColor: customization.colors.surface,
            borderColor: customization.colors.border
          }}>
            <CardContent className="p-4 flex items-start gap-2">
              {!isMinimal && <span className="text-lg flex-shrink-0">📍</span>}
              <div className="flex-1">
                <div className="font-medium mb-1" style={{ 
                  color: customization.colors.text,
                  fontSize: `${customization.typography.fontSize.header}px`
                }}>
                  Location
                </div>
                <div style={{ fontSize: `${customization.typography.fontSize.body}px`, color: customization.colors.text }}>
                  {callsheet.location}
                </div>
                {callsheet.locationAddress && (
                  <div className="text-sm" style={{ 
                    color: customization.colors.textLight,
                    fontSize: `${customization.typography.fontSize.small}px`
                  }}>
                    {callsheet.locationAddress}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Traditional Form Header */}
      {isTraditional && (
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-0 border-2 border-black">
            <div className="border-r border-black p-3">
              <div className="font-bold text-xs mb-2">PRODUCTION COMPANY:</div>
              <div className="font-bold text-xs mb-1">Exec. Producer:</div>
              <div className="font-bold text-xs mb-1">Producer:</div>
              <div className="font-bold text-xs mb-1">Director:</div>
              <div className="font-bold text-xs">1st AD:</div>
            </div>
            <div className="border-r border-black p-3 text-center">
              <div className="text-2xl font-bold mb-2">CALL TIME</div>
              <div className="text-3xl font-bold mb-2">{callsheet.generalCallTime}</div>
              <div className="text-xs">Check grid for individual call times</div>
            </div>
            <div className="p-3">
              <div className="font-bold text-xs mb-1">BKFST:</div>
              <div className="font-bold text-xs mb-1">LUNCH:</div>
              <div className="font-bold text-xs mb-1">SUNRISE:</div>
              <div className="font-bold text-xs mb-1">SUNSET:</div>
              <div className="font-bold text-xs">WEATHER:</div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule */}
      {callsheet.schedule.length > 0 && (
        <ScheduleSection 
          schedule={callsheet.schedule} 
          customization={customization}
        />
      )}

      {/* Cast */}
      {callsheet.cast.length > 0 && (
        <ContactSection
          title="CAST"
          contacts={callsheet.cast}
          icon="🎭"
          customization={customization}
        />
      )}

      {/* Crew */}
      {callsheet.crew.length > 0 && (
        <ContactSection
          title="CREW"
          contacts={callsheet.crew}
          icon="🎬"
          customization={customization}
        />
      )}

      {/* Emergency Contacts */}
      {callsheet.emergencyContacts.length > 0 && (
        <ContactSection
          title="EMERGENCY CONTACTS"
          contacts={callsheet.emergencyContacts}
          icon="⚠️"
          isEmergency={true}
          customization={customization}
          emergencyNumber={emergencyNumber}
        />
      )}
    </div>
  );
};
