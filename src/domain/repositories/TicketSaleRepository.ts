import { TicketSale } from '../entities/TicketSale';

export interface TicketSaleRepository {
  create(ticketSale: TicketSale): Promise<void>;
  getByTournamentId(tournamentId: string): Promise<TicketSale[]>;
}