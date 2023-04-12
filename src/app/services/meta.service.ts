import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { marked } from 'marked';
import * as credits from '../../assets/content/credits.json';
import { NotifyInfo } from '../../stores/game/game.actions';
import * as Migrations from '../../stores/migrations';
import { isInElectron } from '../helpers/electron';

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  private versionInfo: any = { tag: '', semverString: '', raw: 'v.local', hash: 'v.local', distance: -1 };
  public get version(): string {
    if(this.versionInfo.distance >= 0 && this.versionInfo.tag) {
      return `${this.versionInfo.tag} (${this.versionInfo.raw})`;
    }

    return this.versionInfo.tag
        || this.versionInfo.semverString
        || this.versionInfo.raw
        || this.versionInfo.hash;
  }

  private versionMismatch = false;

  private changelogCurrent = '';
  private changelogAll = '';

  public get shouldUpdateVersion() {
    return this.versionMismatch && isInElectron();
  }

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

    this.checkVersionAgainstLiveVersion();
  }

  private async checkVersionAgainstLiveVersion() {
    if(!isInElectron()) {
      return;
    }

    try {
      const liveVersionFile = await fetch('https://play.worldsellergame.com/assets/version.json');
      const liveVersionData = await liveVersionFile.json();

      if(this.versionInfo.hash !== liveVersionData.hash) {
        this.versionMismatch = true;
        this.store.dispatch(new NotifyInfo(`Version ${liveVersionData.tag} is available! Head to settings to update.`));
      }

    } catch {
      console.error('Could not load live version data. Probably not a big deal.');
    }
  }

  characterSavefile(slot: number = 0) {
    const data = this.store.snapshot();
    const ignoredKeys: string[] = ['options', 'mods'];

    const charData = data.charselect.characters[slot];
    if(!charData) {
      return { charName: '', charId: '', saveData: {} };
    }

    const charName = charData.name;
    const charId = charData.id;

    const saveData = Object.keys(data).filter(key => !ignoredKeys.includes(key)).reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {} as any);

    return { charName, charId, saveData };
  }

  exportCharacter(slot: number = 0) {
    const { charName, saveData } = this.characterSavefile(slot);

    const fileName = `${charName}.ws`;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(saveData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href',     dataStr);
    downloadAnchorNode.setAttribute('download', fileName);
    downloadAnchorNode.click();
  }

  importCharacter(data: any) {
    const currentOptions = this.store.snapshot().options;
    const currentMods = this.store.snapshot().mods;

    if(!data.options) {
      data.options = currentOptions;
    }

    if(!data.mods) {
      data.mods = currentMods;
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

  async showCredits() {
    const creditsList = (credits as any).default || credits;

    const html = creditsList.map(({ category, members }: any) => {
      const membersHtml = members.map(({ name, role, contribution }: any) => {
        const fullName = role ? `${name} (${role})` : name;

        return `
          <dt>${fullName}</dt>
          <dd>${contribution || ''}</dd>
        `;
      }).join('');

      return `
        <h3>${category}</h3>

        ${membersHtml}
      `;
    }).join('');

    const alert = await this.alertCtrl.create({
      header: 'Credits',
      cssClass: 'credits',
      message: html,
      buttons: ['OK']
    });

    await alert.present();

  }
}
