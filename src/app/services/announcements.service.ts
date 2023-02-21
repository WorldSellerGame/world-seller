import { Injectable } from '@angular/core';

import Parser from 'rss-parser/dist/rss-parser';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  public get latestAnnouncement() {
    const announcement = this.allAnnouncements[0];
    if (!announcement) {
      return null;
    }

    return {
      title: announcement.title,
      link: announcement.link,
      author: announcement.author,
      summary: announcement.summary
    };
  }

  private allAnnouncements: any[] = [];

  constructor() {
    this.init();
  }

  private async init() {
    const parser = new Parser();
    try {
      const feed = await parser.parseURL('https://blog.worldsellergame.com/feed.xml');

      this.allAnnouncements = feed.items;
      console.log(feed.items);
    } catch {
      console.error('Could not fetch announcements.');
    }
  }

}
