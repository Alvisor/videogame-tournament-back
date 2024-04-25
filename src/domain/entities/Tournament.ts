export class Tournament {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly category: string,
    public readonly game: string,
    public readonly maxPlayers: number,
    public readonly responsible: string,
    public readonly additionalInfo: string,
    public readonly maxViewers: number,
    public readonly userId: string,
    public readonly paymentRequired: boolean,
    ) {}

  }