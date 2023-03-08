import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { marked } from 'marked';
import * as Migrations from '../../stores/migrations';
import { defaultOptions } from '../../stores/options/options.functions';

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  private versionInfo: any = { tag: '', semverString: '', raw: 'v.local', hash: 'v.local', distance: -1 };
  public get version(): string {
    if(this.versionInfo.distance >= 0 && this.versionInfo.tag) {
      return `${this.versionInfo.tag} (${this.versionInfo.hash})`;
    }

    return this.versionInfo.tag
        || this.versionInfo.semverString
        || this.versionInfo.raw
        || this.versionInfo.hash;
  }

  private changelogCurrent = '';
  private changelogAll = '';

  constructor(private store: Store, private alertCtrl: AlertController) { }

  async init(): Promise<void> {
    try {
      const versionFile = await fetch('assets/version.json');
      const versionData = await versionFile.json();
      this.versionInfo = versionData;
    } catch {
      console.error('Could not load version.json - probably on local.');
    }

    try {
      const changelog = await fetch('assets/CHANGELOG.md');
      const changelogData = await changelog.text();
      this.changelogAll = changelogData;
    } catch {
      console.error('Could not load changelog (all) - probably on local.');
    }

    try {
      const changelog = await fetch('assets/CHANGELOG-current.md');
      const changelogData = await changelog.text();
      this.changelogCurrent = changelogData;
    } catch {
      console.error('Could not load changelog (current) - probably on local.');
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

  importCharacter(data: any) {
    if(!data.options) {
      data.options = defaultOptions();
    }

    // gotta migrate potentially aged savefiles
    Object.values(Migrations).forEach(migrations => {
      migrations.forEach(migration => {
        data[migration.key] = migration.migrate(data[migration.key]);
      });
    });

    this.store.reset(data);
  }

  async showChangelog() {
    const alert = await this.alertCtrl.create({
      header: 'Changelog',
      cssClass: 'changelog',
      message: marked.parse(this.changelogAll),
      buttons: ['OK']
    });

    await alert.present();
  }
}
