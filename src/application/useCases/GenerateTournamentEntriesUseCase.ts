// src/application/useCases/GenerateTournamentEntriesUseCase.ts
import { TournamentEntry } from '../../domain/entities/TournamentEntry';
import { TournamentEntryRepository } from '../../domain/repositories/TournamentEntryRepository';
import { v4 as uuidv4 } from 'uuid';

export interface Participant {
  userId: string;
  email: string;
  phone: string;
}

export interface GenerateTournamentEntriesRequest {
  tournamentId: string;
  participants: Participant[];
}

export class GenerateTournamentEntriesUseCase {
  constructor(private readonly tournamentEntryRepository: TournamentEntryRepository,
  ) {}

  async execute(request: GenerateTournamentEntriesRequest): Promise<void> {
    const { tournamentId, participants } = request;
    console.log("variable de entorno DDB_TABLE: ", process.env.DDB_TABLE)
    console.log('Generating tournament entries... request: ', request);
    for (const participant of participants) {
      const code = this.generateUniqueCode();
      console.log('Generating entry for participant: ', participant);
      const entry = new TournamentEntry(
        uuidv4(),
        tournamentId,
        participant.userId,
        code,
        participant.email,
        false,
      );
      console.log('Creating entry: ', entry);
      await this.tournamentEntryRepository.create(entry);
      
    }
  }

  private generateUniqueCode(): string {
    // Generar un código único (por ejemplo, un UUID)
    return uuidv4();
  }

}

export interface GenerateTournamentEntriesRequest {
  tournamentId: string;
  userIds: string[];
  emails: string[];
}