import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

  constructor(private http: HttpClient) { }

  init() {
    this.http.get('assets/version.json').subscribe((data: any) => {
      this.versionInfo = data;
      console.log({ data });
    });
  }
}
