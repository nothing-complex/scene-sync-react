import { EmergencyServiceApi } from '@/services/emergencyService';

export const getCountryCodeFromLocation = (location: string): string => {
  // Extract country from location string - this is a simplified approach
  const locationLower = location.toLowerCase();
  
  // European countries that use 112
  if (locationLower.includes('denmark') || locationLower.includes('copenhagen')) return 'DK';
  if (locationLower.includes('germany') || locationLower.includes('deutschland') || locationLower.includes('berlin') || locationLower.includes('munich')) return 'DE';
  if (locationLower.includes('france') || locationLower.includes('paris') || locationLower.includes('lyon') || locationLower.includes('marseille')) return 'FR';
  if (locationLower.includes('spain') || locationLower.includes('españa') || locationLower.includes('madrid') || locationLower.includes('barcelona')) return 'ES';
  if (locationLower.includes('italy') || locationLower.includes('italia') || locationLower.includes('rome') || locationLower.includes('milan')) return 'IT';
  if (locationLower.includes('netherlands') || locationLower.includes('holland') || locationLower.includes('amsterdam')) return 'NL';
  if (locationLower.includes('sweden') || locationLower.includes('sverige') || locationLower.includes('stockholm')) return 'SE';
  if (locationLower.includes('norway') || locationLower.includes('norge') || locationLower.includes('oslo')) return 'NO';
  if (locationLower.includes('finland') || locationLower.includes('suomi') || locationLower.includes('helsinki')) return 'FI';
  if (locationLower.includes('austria') || locationLower.includes('österreich') || locationLower.includes('vienna')) return 'AT';
  if (locationLower.includes('switzerland') || locationLower.includes('schweiz') || locationLower.includes('zurich')) return 'CH';
  if (locationLower.includes('belgium') || locationLower.includes('belgië') || locationLower.includes('brussels')) return 'BE';
  if (locationLower.includes('portugal') || locationLower.includes('lisbon')) return 'PT';
  if (locationLower.includes('greece') || locationLower.includes('ελλάδα') || locationLower.includes('athens')) return 'GR';
  if (locationLower.includes('poland') || locationLower.includes('polska') || locationLower.includes('warsaw')) return 'PL';
  if (locationLower.includes('czech') || locationLower.includes('czechia') || locationLower.includes('prague')) return 'CZ';
  if (locationLower.includes('slovakia') || locationLower.includes('slovensko') || locationLower.includes('bratislava')) return 'SK';
  if (locationLower.includes('hungary') || locationLower.includes('magyarország') || locationLower.includes('budapest')) return 'HU';
  if (locationLower.includes('romania') || locationLower.includes('românia') || locationLower.includes('bucharest')) return 'RO';
  if (locationLower.includes('bulgaria') || locationLower.includes('българия') || locationLower.includes('sofia')) return 'BG';
  if (locationLower.includes('croatia') || locationLower.includes('hrvatska') || locationLower.includes('zagreb')) return 'HR';
  if (locationLower.includes('slovenia') || locationLower.includes('slovenija') || locationLower.includes('ljubljana')) return 'SI';
  if (locationLower.includes('estonia') || locationLower.includes('eesti') || locationLower.includes('tallinn')) return 'EE';
  if (locationLower.includes('latvia') || locationLower.includes('latvija') || locationLower.includes('riga')) return 'LV';
  if (locationLower.includes('lithuania') || locationLower.includes('lietuva') || locationLower.includes('vilnius')) return 'LT';
  if (locationLower.includes('ireland') || locationLower.includes('éire') || locationLower.includes('dublin')) return 'IE';
  if (locationLower.includes('luxembourg')) return 'LU';
  if (locationLower.includes('malta')) return 'MT';
  if (locationLower.includes('cyprus') || locationLower.includes('κύπρος')) return 'CY_SOUTH';
  if (locationLower.includes('iceland') || locationLower.includes('ísland') || locationLower.includes('reykjavik')) return 'IS';
  
  // UK uses 999
  if (locationLower.includes('united kingdom') || locationLower.includes('england') || 
      locationLower.includes('scotland') || locationLower.includes('wales') || 
      locationLower.includes('northern ireland') || locationLower.includes('britain') ||
      locationLower.includes('london') || locationLower.includes('manchester') || 
      locationLower.includes('birmingham') || locationLower.includes('glasgow') ||
      locationLower.includes('edinburgh') || locationLower.includes('cardiff')) return 'GB';
  
  // North American countries that use 911
  if (locationLower.includes('canada') || locationLower.includes('toronto') || 
      locationLower.includes('vancouver') || locationLower.includes('montreal')) return 'CA';
  if (locationLower.includes('mexico') || locationLower.includes('méxico') || 
      locationLower.includes('mexico city') || locationLower.includes('guadalajara')) return 'MX';
  
  // Other countries
  if (locationLower.includes('australia') || locationLower.includes('sydney') || 
      locationLower.includes('melbourne') || locationLower.includes('perth')) return 'AU';
  if (locationLower.includes('new zealand') || locationLower.includes('auckland') || 
      locationLower.includes('wellington')) return 'NZ';
  if (locationLower.includes('japan') || locationLower.includes('日本') || 
      locationLower.includes('tokyo') || locationLower.includes('osaka')) return 'JP';
  if (locationLower.includes('south korea') || locationLower.includes('korea') || 
      locationLower.includes('seoul') || locationLower.includes('busan')) return 'KR';
  if (locationLower.includes('china') || locationLower.includes('中国') || 
      locationLower.includes('beijing') || locationLower.includes('shanghai')) return 'CN';
  if (locationLower.includes('india') || locationLower.includes('mumbai') || 
      locationLower.includes('delhi') || locationLower.includes('bangalore')) return 'IN';
  if (locationLower.includes('brazil') || locationLower.includes('brasil') || 
      locationLower.includes('são paulo') || locationLower.includes('rio de janeiro')) return 'BR';
  if (locationLower.includes('argentina') || locationLower.includes('buenos aires')) return 'AR';
  if (locationLower.includes('chile') || locationLower.includes('santiago')) return 'CL';
  if (locationLower.includes('colombia') || locationLower.includes('bogotá')) return 'CO';
  if (locationLower.includes('south africa') || locationLower.includes('cape town') || 
      locationLower.includes('johannesburg')) return 'ZA';
  
  // Default to US if country can't be determined
  return 'US';
};

export const getEmergencyNumberFromLocation = (location: string): string => {
  const countryCode = getCountryCodeFromLocation(location);
  const emergencyNumbers = EmergencyServiceApi.getEmergencyNumbers(countryCode);
  return emergencyNumbers.general;
};
