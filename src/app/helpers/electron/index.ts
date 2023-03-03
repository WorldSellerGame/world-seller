import { IDiscordPresenceOpts } from '../../../interfaces';

export function isInElectron() {
  return navigator.userAgent.toLowerCase().includes(' electron/');
}

let discordMainStatus = '';
export function setMainDiscordStatus(status: string) {
  discordMainStatus = status;
}

export function setDiscordStatus(status: IDiscordPresenceOpts) {
  (window as any).discordRPCStatus = {
    ...status,
    details: discordMainStatus || status.details
  };
}
