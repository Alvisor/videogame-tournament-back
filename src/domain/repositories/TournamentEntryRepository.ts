import { TournamentEntry } from '../entities/TournamentEntry';

export interface TournamentEntryRepository {
  create(entry: TournamentEntry): Promise<void>;
  getByCode(code: string): Promise<TournamentEntry | undefined>;
  markAsUsed(code: string): Promise<void>;
}