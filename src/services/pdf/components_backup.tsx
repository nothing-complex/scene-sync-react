
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

// Enhanced SafeText component with better validation and error handling
export const SafeText: React.FC<{ children: string | undefined | null; style?: any }> = ({ children, style }) => {
  // Strict validation: only render if we have actual content
  if (children === null || children === undefined) {
    return null;
  }
  
  if (typeof children !== 'string') {
    console.warn('SafeText: Received non-string children:', typeof children, children);
    return null;
  }
  
  const cleanText = children.trim();
  if (cleanText === '') {
    return null;
  }
  
  try {
    return <Text style={style}>{cleanText}</Text>;
  } catch (error) {
    console.error('SafeText: Error rendering text:', error, 'Content:', cleanText);
    return null;
  }
};
