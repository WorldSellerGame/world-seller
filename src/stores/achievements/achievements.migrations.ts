import { IGameAchievements } from '../../interfaces';

export const achievementStoreMigrations = [
  {
    version: 0,
    migrate: (state: IGameAchievements) => ({
      ...state,
      version: 1
    })
  }
].map(x => ({ ...x, key: 'achievements' }));
