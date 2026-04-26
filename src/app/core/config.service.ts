import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private _apiUrl: string = '';
  private _loaded = false;

  get apiUrl() {
    return this._apiUrl;
  }

  get loaded() {
    return this._loaded;
  }

  load(): Promise<void> {
    return fetch('/assets/runtime-config.json')
      .then(resp => {
        if (!resp.ok) throw new Error('config not found');
        return resp.json();
      })
      .then(json => {
        this._apiUrl = json.apiUrl || '';
        this._loaded = true;
      })
      .catch(() => {
        this._apiUrl = '';
        this._loaded = true;
      });
  }
}
