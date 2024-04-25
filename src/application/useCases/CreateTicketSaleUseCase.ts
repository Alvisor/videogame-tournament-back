import { TicketSale } from '../../domain/entities/TicketSale';
import { TicketSaleRepository } from '../../domain/repositories/TicketSaleRepository';
import { v4 as uuidv4 } from 'uuid';

export class CreateTicketSaleUseCase {
  constructor(private readonly ticketSaleRepository: TicketSaleRepository) {}

  async execute(request: CreateTicketSaleRequest): Promise<void> {
    const { tournamentId, responsibleId, price, commission, saleStage } = request;

    const ticketSale = new TicketSale(
      uuidv4(),
      tournamentId,
      responsibleId,
      price,
      commission,
      this.generateUniqueCode(),
      saleStage,
      new Date(),
    );

    await this.ticketSaleRepository.create(ticketSale);
  }

  private generateUniqueCode(): string {
    // Generar un código único (por ejemplo, un UUID)
    return uuidv4();
  }
}

export interface CreateTicketSaleRequest {
  tournamentId: string;
  responsibleId: string;
  price: number;
  commission: number;
  saleStage: string;
}