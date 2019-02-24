import { BbqPhase } from './BbqPhase';

export class ItemDefinition {
  public type: string;
  public defaultTargetTemp: number;
  public phases: BbqPhase;
}

export class ItemCatalog {

  private static donePhase: BbqPhase = {
    name: 'Done',
    isCooking: false,
    nextPhases: []
  };

  private items: { [name: string]: ItemDefinition; } = {};

  constructor() {
    this.addButt();
    this.addRibs();
  }

  public findItemByType(itemType: string) {
    return this.items[itemType];
  }

  private addButt() {
    this.items['Butt'] = {
      type: 'Butt',
      defaultTargetTemp: 195,
      phases: {
        name: 'Inject',
        isCooking: false,
        nextPhases: [{
          name: 'Rub',
          isCooking: false,
          nextPhases: [{
            name: 'On Smoker',
            isCooking: true,
            nextPhases: [{
              name: 'Wrap',
              isCooking: true,
              nextPhases: [{
                name: 'Unwrap',
                isCooking: true,
                nextPhases: [ ItemCatalog.donePhase ]
              },
              ItemCatalog.donePhase ]
            }]
          }]
        }]
      }
    };
  }

  private addRibs() {
    this.items['Ribs'] = {
      type: 'Ribs',
      defaultTargetTemp: 165,
      phases: {
        name: 'Marinade',
        isCooking: false,
        nextPhases: [{
          name: 'Rub',
          isCooking: false,
          nextPhases: [{
            name: 'On Smoker',
            isCooking: true,
            nextPhases: [{
              name: 'Wrap',
              isCooking: true,
              nextPhases: [{
                name: 'Unwrap',
                isCooking: true,
                nextPhases: [ ItemCatalog.donePhase ]
              }]
            }]
          }]
        }]
      }
    };
  }
}
