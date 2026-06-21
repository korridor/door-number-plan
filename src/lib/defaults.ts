import type { BuildingPlan, Locale } from './types';

const doorRanges = [
  ['25', '26', '27', '28'],
  ['19', '20', '21', '22', '23', '24'],
  ['13', '14', '15', '16', '17', '18'],
  ['7', '8', '9', '10', '11', '12'],
  ['1', '2', '3', '4', '5', '6'],
];

export function createDefaultPlan(locale: Locale): BuildingPlan {
  const names = locale === 'de'
    ? ['4. Stock', '3. Stock', '2. Stock', '1. Stock', 'Erdgeschoß']
    : ['4th floor', '3rd floor', '2nd floor', '1st floor', 'Ground floor'];

  return {
    title: locale === 'de' ? 'Türnummernplan' : 'Door Number Plan',
    street: 'Rettungsgasse 112',
    city: '1010 Wien',
    blackAndWhite: false,
    elevatorsEnabled: false,
    levels: names.map((name, index) => ({
      id: `level-${index + 1}`,
      name,
      items: doorRanges[index].map((label, doorIndex) => ({
        id: `level-${index + 1}-door-${doorIndex + 1}`,
        type: 'door' as const,
        label,
      })),
    })),
  };
}
