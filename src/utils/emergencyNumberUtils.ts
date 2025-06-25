export const getEmergencyNumberFromLocation = (location: string): string => {
  const locationLower = location.toLowerCase();
  
  // European countries that use 112
  if (locationLower.includes('denmark') || locationLower.includes('copenhagen')) return '112';
  if (locationLower.includes('germany') || locationLower.includes('deutschland')) return '112';
  if (locationLower.includes('france') || locationLower.includes('paris')) return '112';
  if (locationLower.includes('spain') || locationLower.includes('españa')) return '112';
  if (locationLower.includes('italy') || locationLower.includes('italia')) return '112';
  if (locationLower.includes('netherlands') || locationLower.includes('holland')) return '112';
  if (locationLower.includes('sweden') || locationLower.includes('sverige')) return '112';
  if (locationLower.includes('norway') || locationLower.includes('norge')) return '112';
  if (locationLower.includes('finland') || locationLower.includes('suomi')) return '112';
  if (locationLower.includes('austria') || locationLower.includes('österreich')) return '112';
  if (locationLower.includes('switzerland') || locationLower.includes('schweiz')) return '112';
  if (locationLower.includes('belgium') || locationLower.includes('belgië')) return '112';
  if (locationLower.includes('portugal')) return '112';
  if (locationLower.includes('greece') || locationLower.includes('ελλάδα')) return '112';
  if (locationLower.includes('poland') || locationLower.includes('polska')) return '112';
  if (locationLower.includes('czech') || locationLower.includes('czechia')) return '112';
  if (locationLower.includes('slovakia') || locationLower.includes('slovensko')) return '112';
  if (locationLower.includes('hungary') || locationLower.includes('magyarország')) return '112';
  if (locationLower.includes('romania') || locationLower.includes('românia')) return '112';
  if (locationLower.includes('bulgaria') || locationLower.includes('българия')) return '112';
  if (locationLower.includes('croatia') || locationLower.includes('hrvatska')) return '112';
  if (locationLower.includes('slovenia') || locationLower.includes('slovenija')) return '112';
  if (locationLower.includes('estonia') || locationLower.includes('eesti')) return '112';
  if (locationLower.includes('latvia') || locationLower.includes('latvija')) return '112';
  if (locationLower.includes('lithuania') || locationLower.includes('lietuva')) return '112';
  if (locationLower.includes('ireland') || locationLower.includes('éire')) return '112';
  if (locationLower.includes('luxembourg')) return '112';
  if (locationLower.includes('malta')) return '112';
  if (locationLower.includes('cyprus') || locationLower.includes('κύπρος')) return '112';
  if (locationLower.includes('iceland') || locationLower.includes('ísland')) return '112';
  
  // UK uses 999
  if (locationLower.includes('united kingdom') || locationLower.includes('england') || 
      locationLower.includes('scotland') || locationLower.includes('wales') || 
      locationLower.includes('northern ireland') || locationLower.includes('britain')) return '999';
  
  // North American countries that use 911
  if (locationLower.includes('canada')) return '911';
  if (locationLower.includes('mexico') || locationLower.includes('méxico')) return '911';
  
  // Other countries
  if (locationLower.includes('australia')) return '000';
  if (locationLower.includes('new zealand')) return '111';
  if (locationLower.includes('japan') || locationLower.includes('日本')) return '110';
  if (locationLower.includes('south korea') || locationLower.includes('korea')) return '112';
  if (locationLower.includes('china') || locationLower.includes('中国')) return '110';
  if (locationLower.includes('india')) return '108';
  if (locationLower.includes('brazil') || locationLower.includes('brasil')) return '190';
  if (locationLower.includes('argentina')) return '911';
  if (locationLower.includes('chile')) return '133';
  if (locationLower.includes('colombia')) return '123';
  if (locationLower.includes('south africa')) return '10111';
  
  // Default to US if country can't be determined
  return '911';
};

export const getCountryCodeFromLocation = (location: string): string => {
  const locationLower = location.toLowerCase();
  
  // European countries that use 112
  if (locationLower.includes('denmark') || locationLower.includes('copenhagen')) return 'DK';
  if (locationLower.includes('germany') || locationLower.includes('deutschland')) return 'DE';
  if (locationLower.includes('france') || locationLower.includes('paris')) return 'FR';
  if (locationLower.includes('spain') || locationLower.includes('españa')) return 'ES';
  if (locationLower.includes('italy') || locationLower.includes('italia')) return 'IT';
  if (locationLower.includes('netherlands') || locationLower.includes('holland')) return 'NL';
  if (locationLower.includes('sweden') || locationLower.includes('sverige')) return 'SE';
  if (locationLower.includes('norway') || locationLower.includes('norge')) return 'NO';
  if (locationLower.includes('finland') || locationLower.includes('suomi')) return 'FI';
  if (locationLower.includes('austria') || locationLower.includes('österreich')) return 'AT';
  if (locationLower.includes('switzerland') || locationLower.includes('schweiz')) return 'CH';
  if (locationLower.includes('belgium') || locationLower.includes('belgië')) return 'BE';
  if (locationLower.includes('portugal')) return 'PT';
  if (locationLower.includes('greece') || locationLower.includes('ελλάδα')) return 'GR';
  if (locationLower.includes('poland') || locationLower.includes('polska')) return 'PL';
  if (locationLower.includes('czech') || locationLower.includes('czechia')) return 'CZ';
  if (locationLower.includes('slovakia') || locationLower.includes('slovensko')) return 'SK';
  if (locationLower.includes('hungary') || locationLower.includes('magyarország')) return 'HU';
  if (locationLower.includes('romania') || locationLower.includes('românia')) return 'RO';
  if (locationLower.includes('bulgaria') || locationLower.includes('българия')) return 'BG';
  if (locationLower.includes('croatia') || locationLower.includes('hrvatska')) return 'HR';
  if (locationLower.includes('slovenia') || locationLower.includes('slovenija')) return 'SI';
  if (locationLower.includes('estonia') || locationLower.includes('eesti')) return 'EE';
  if (locationLower.includes('latvia') || locationLower.includes('latvija')) return 'LV';
  if (locationLower.includes('lithuania') || locationLower.includes('lietuva')) return 'LT';
  if (locationLower.includes('ireland') || locationLower.includes('éire')) return 'IE';
  if (locationLower.includes('luxembourg')) return 'LU';
  if (locationLower.includes('malta')) return 'MT';
  if (locationLower.includes('cyprus') || locationLower.includes('κύπρος')) return 'CY_SOUTH';
  if (locationLower.includes('iceland') || locationLower.includes('ísland')) return 'IS';
  
  // UK uses 999
  if (locationLower.includes('united kingdom') || locationLower.includes('england') || 
      locationLower.includes('scotland') || locationLower.includes('wales') || 
      locationLower.includes('northern ireland') || locationLower.includes('britain')) return 'GB';
  
  // North American countries that use 911
  if (locationLower.includes('canada')) return 'CA';
  if (locationLower.includes('mexico') || locationLower.includes('méxico')) return 'MX';
  
  // Other countries
  if (locationLower.includes('australia')) return 'AU';
  if (locationLower.includes('new zealand')) return 'NZ';
  if (locationLower.includes('japan') || locationLower.includes('日本')) return 'JP';
  if (locationLower.includes('south korea') || locationLower.includes('korea')) return 'KR';
  if (locationLower.includes('china') || locationLower.includes('中国')) return 'CN';
  if (locationLower.includes('india')) return 'IN';
  if (locationLower.includes('brazil') || locationLower.includes('brasil')) return 'BR';
  if (locationLower.includes('argentina')) return 'AR';
  if (locationLower.includes('chile')) return 'CL';
  if (locationLower.includes('colombia')) return 'CO';
  if (locationLower.includes('south africa')) return 'ZA';
  
  // Default to US if country can't be determined
  return 'US';
};
