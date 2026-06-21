export type Locale = 'en' | 'de';

export interface DoorItem {
  id: string;
  type: 'door';
  label: string;
}

export interface ElevatorItem {
  id: string;
  type: 'elevator';
}

export type LevelItem = DoorItem | ElevatorItem;

export interface BuildingLevel {
  id: string;
  name: string;
  items: LevelItem[];
}

export interface BuildingPlan {
  title: string;
  street: string;
  city: string;
  blackAndWhite: boolean;
  elevatorsEnabled: boolean;
  levels: BuildingLevel[];
}
