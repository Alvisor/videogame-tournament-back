import { Tournament } from '../entities/Tournament';

export interface TournamentRepository {
  create(tournament: Tournament): Promise<void>;
  getById(id: string): Promise<Tournament | undefined>;
  getByUserId(userId: string): Promise<Tournament[]>;
  // otros métodos del repositorio si son necesarios
}