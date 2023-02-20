import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  private versionInfo: any = { tag: '', semverString: '', raw: '', hash: 'local' };
  public get version(): string {
    return this.versionInfo.tag
        || this.versionInfo.semverString
        || this.versionInfo.raw
        || this.versionInfo.hash;
  }

  constructor(private store: Store) { }

  async init(): Promise<void> {
    try {
      const versionFile = await fetch('assets/version.json');
      const versionData = await versionFile.json();
      this.versionInfo = versionData;
    } catch {
      console.error('Could not load version.json - probably on local.');
    }
  }

  exportCharacter(slot: number = 0) {
    this.store.selectOnce(data => data).subscribe(data => {
      const ignoredKeys: string[] = ['options'];

      const charData = data.charselect.characters[slot];
      const charName = charData.name;

      const saveData = Object.keys(data).filter(key => !ignoredKeys.includes(key)).reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {} as any);

      const fileName = `${charName}.ws`;
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(saveData));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href',     dataStr);
      downloadAnchorNode.setAttribute('download', fileName);
      downloadAnchorNode.click();
    });
  }
}
