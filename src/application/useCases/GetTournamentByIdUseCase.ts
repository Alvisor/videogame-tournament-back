import { Tournament } from "../../domain/entities/Tournament";
import { TournamentRepository } from "../../domain/repositories/TournamentRepository";

export class GetTournamentByIdUseCase {
    constructor(private readonly tournamentRepository: TournamentRepository) {}
  
    async execute(id: string): Promise<Tournament | undefined> {
      return this.tournamentRepository.getById(id);
    }
  }