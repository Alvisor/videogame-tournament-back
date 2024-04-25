export class TicketSale {
    constructor(
      public readonly id: string,
      public readonly tournamentId: string,
      public readonly responsibleId: string,
      public readonly price: number,
      public readonly commission: number,
      public readonly code: string,
      public readonly saleStage: string,
      public readonly createdAt: Date,
    ) {}
  }