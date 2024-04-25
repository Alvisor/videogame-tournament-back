// src/application/useCases/ValidateTournamentEntryUseCase.ts
import { TournamentEntryRepository } from '../../domain/repositories/TournamentEntryRepository';

export class ValidateTournamentEntryUseCase {
  constructor(private readonly tournamentEntryRepository: TournamentEntryRepository) {}

  async execute(code: string): Promise<boolean> {
    const entry = await this.tournamentEntryRepository.getByCode(code);

    if (!entry || entry.used) {
      return false;
    }

    await this.tournamentEntryRepository.markAsUsed(code);
    return true;
  }
}