export class BbqPhase {
  public name: string = null;
  public isCooking = false;
  public nextPhases: BbqPhase[] = [];

  public static findPhaseByName(searchRoot: BbqPhase, phaseName: string): BbqPhase {

    if (searchRoot.name === phaseName) {
      return searchRoot;
    }

    for (const current of searchRoot.nextPhases) {
      const result = this.findPhaseByName(current, phaseName);
      if (result) {
        return result;
      }
    }

    return null;
  }
}
