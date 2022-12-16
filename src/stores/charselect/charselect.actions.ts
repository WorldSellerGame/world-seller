
export class CreateCharacter {
  static type = '[CharSelect] Create Character';
  constructor(public name: string) {}
}

export class DeleteCharacter {
  static type = '[CharSelect] Delete Character';
  constructor(public slot: number) {}
}
