import { Tournament } from '../../domain/entities/Tournament';
import { TournamentRepository } from '../../domain/repositories/TournamentRepository';
import { MAX_EVENTS_PER_USER, TOURNAMENT_CATEGORIES } from '../../utils/Constants';

export class CreateTournamentUseCase {
  constructor(private readonly tournamentRepository: TournamentRepository) {}

  async execute(request: CreateTournamentRequest): Promise<void> {
    const { userId, category, maxPlayers } = request;

    const userTournaments = await this.tournamentRepository.getByUserId(userId);
    if (userTournaments.length >= Number(MAX_EVENTS_PER_USER)) {
      throw new Error('User has reached the maximum number of free tournaments');
    }
    const categoryMaxParticipants = TOURNAMENT_CATEGORIES[category as keyof typeof TOURNAMENT_CATEGORIES]?.maxParticipants;
    if (maxPlayers > categoryMaxParticipants) {
      throw new Error(`Maximum number of participants for category ${category} is ${categoryMaxParticipants}`);
    }
    const tournament = new Tournament(
      request.id,
      request.name,
      request.category,
      request.game,
      request.maxPlayers,
      request.responsible,
      request.additionalInfo,      
      request.maxViewers,
      request.userId,
      request.paymentRequired,
    );

    await this.tournamentRepository.create(tournament);
  }
}



export interface CreateTournamentRequest {
  id: string;
  name: string;
  category: string;
  game: string;
  maxPlayers: number;
  responsible: string;
  additionalInfo: string;
  maxViewers: number;
  userId: string;
  paymentRequired: boolean;
}