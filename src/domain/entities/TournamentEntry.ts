export class TournamentEntry {
    constructor(
      public readonly id: string,
      public readonly tournamentId: string,
      public readonly userId: string,
      public readonly code: string,
      public readonly email: string,
      public readonly used: boolean,
    ) {}
  }