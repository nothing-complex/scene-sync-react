
import React from 'react';
import { Text, View } from '@react-pdf/renderer';

// FIXED: SafeText component now handles empty strings and null values properly
// This resolves the "Invalid '' string child outside <Text> component" error
export const SafeText: React.FC<{
  children: React.ReactNode;
  style?: any;
}> = ({ children, style }) => {
  // DEBUGGING: Log text content to identify problematic empty strings
  console.log('SafeText rendering:', children);
  
  // FIXED: Handle empty strings, null, undefined, and whitespace-only strings
  if (!children || 
      (typeof children === 'string' && children.trim() === '') ||
      children === null ||
      children === undefined) {
    console.log('SafeText: Skipping empty/null content');
    return null; // Don't render anything for empty content
  }

  // FIXED: Ensure we always render valid text content
  const textContent = String(children).trim();
  if (!textContent) {
    console.log('SafeText: Content became empty after trimming');
    return null;
  }

  return <Text style={style}>{textContent}</Text>;
};

// FIXED: SectionIcon component with proper error handling
export const SectionIcon: React.FC<{
  type: string;
  color: string;
  size?: number;
}> = ({ type, color, size = 12 }) => {
  console.log('SectionIcon rendering:', type, color);
  
  // FIXED: Simple text-based icons to avoid rendering issues
  const getIconText = (iconType: string): string => {
    switch (iconType) {
      case 'users': return '👥';
      case 'clock': return '🕐';
      case 'emergency': return '🚨';
      case 'notes': return '📝';
      case 'phone': return '📞';
      case 'email': return '📧';
      case 'location': return '📍';
      default: return '•';
    }
  };

  const iconText = getIconText(type);
  console.log('SectionIcon text:', iconText);

  return (
    <Text style={{ 
      fontSize: size, 
      color: color,
      marginRight: 4,
      lineHeight: 1
    }}>
      {iconText}
    </Text>
  );
};
