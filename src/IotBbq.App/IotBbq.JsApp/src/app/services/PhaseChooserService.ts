import { IBbqItem } from '../model/BbqItem';
import { BbqPhase } from '../model/BbqPhase';
import { ItemCatalog } from '../model/ItemCatalog';
import { MatDialogRef, MatDialog } from '@angular/material';
import { PhasePickerComponent } from '../components/phase-picker/phase-picker.component';
import { Inject } from '@angular/core';

export class PhaseChooserService {

  private catalog = new ItemCatalog();

  private dialogRef: MatDialogRef<PhasePickerComponent>;

  constructor(
    @Inject(MatDialog) private modalService: MatDialog) {
  }

  public async chooseNextPhase(item: IBbqItem): Promise<BbqPhase> {

    const definition = this.catalog.findItemByType(item.itemType);
    if (!definition) {
      throw new Error(`Could not find item definition for type ${item.itemType}`);
    }

    // special case for first phase
    if (!item.currentPhase) {
      item.currentPhase = definition.phases.name;
      return definition.phases;
    }

    // locate current phase in tree
    const currentPhase = BbqPhase.findPhaseByName(definition.phases, item.currentPhase);
    if (!currentPhase) {
      throw new Error(`Count not find phase with name ${item.currentPhase} on item.`);
    }

    // Don't allow going past the last phase
    if (currentPhase.nextPhases.length === 0) {
      return currentPhase;
    }

    if (currentPhase.nextPhases.length === 1) {
      item.currentPhase = currentPhase.nextPhases[0].name;
      return currentPhase.nextPhases[0];
    }

    // Show the dialog for more than one next phase
    const initialState = {
      phaseChoices: currentPhase.nextPhases
    };

    this.dialogRef = this.modalService.open(PhasePickerComponent, {
      data: initialState,
      minWidth: '75%',
    });

    const pickedPhaseName: string = await this.dialogRef.afterClosed().toPromise();
    if (pickedPhaseName) {
      const pickedPhase = currentPhase.nextPhases.find(p => p.name === pickedPhaseName);
      item.currentPhase = pickedPhase.name;
      return pickedPhase;
    }

    return null;
  }
}
