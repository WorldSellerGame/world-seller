
export interface ICharacter {
  name: string;
  lastSavedAt: number;
  lastTotalLevel: number;
  resources: Record<string, number>;
}
