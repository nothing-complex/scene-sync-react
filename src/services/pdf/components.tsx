
import React from 'react';
import { Text } from '@react-pdf/renderer';

export const SectionIcon: React.FC<{ type: string; color: string }> = ({ type, color }) => {
  const iconText = {
    calendar: '◯',
    location: '◆',
    users: '▲',
    clock: '◐',
    notes: '◢',
    emergency: '⬟'
  }[type] || '●';

  return (
    <Text style={{ 
      color: color, 
      fontSize: 12,
      marginRight: 8,
      fontWeight: 600 
    }}>
      {iconText}
    </Text>
  );
};

// Enhanced SafeText component with strict validation
export const SafeText: React.FC<{ children: string | undefined | null; style?: any }> = ({ children, style }) => {
  // Strict validation: only render if we have actual non-empty content
  if (!children || typeof children !== 'string' || children.trim().length === 0) {
    return null;
  }
  
  const cleanText = children.trim();
  // Additional check to ensure we don't pass empty strings
  if (cleanText === '') {
    return null;
  }
  
  return <Text style={style}>{cleanText}</Text>;
};
