import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TurbineService } from '../services/turbine.service';
import { Wtgs } from '../models/wtgs.model';
import { BladeCat, Inspection, Note } from '../models/inspection.model';
import { Observable } from 'rxjs';
import { map, max, shareReplay } from 'rxjs/operators';
import { CatColors } from '../app.constants';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss'],
})
export class DetailPageComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  rowDataList: Wtgs[] = JSON.parse(
    JSON.stringify(this.turbineService.wtgsList)
  );
  inspectionList: Inspection[] = JSON.parse(
    JSON.stringify(this.turbineService.inspectionList)
  );
  @Output() turbineEvent = new EventEmitter();
  isChange: boolean = false;
  data: any = [];
  displayRowList: Wtgs[] = [];
  displayInspectionList: Inspection[] = [];
  bladeA: any = {};
  bladeB: any = {};
  bladeC: any = {};
  wtg_idList: string[] = [];
  dateList: string[] = [];
  filterWtg_Id: string = '';
  filterDate: string = '';
  selectedImage: number = 0;
  selectedBlade: string = '';
  sidenavOpen: boolean = false;
  JSON = JSON;
  selectedDate: string = '';
  noteSet: Note[] = [];
  indexDelete: number = 0;
  indexEdit: number = 0;
  imgSrcCopy: string[] = [];

  noteForm = new FormGroup({
    notes: new FormControl('', Validators.required),
  });

  constructor(
    private breakpointObserver: BreakpointObserver,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private turbineService: TurbineService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.data = params;
      this.setSelectedRow();
      this.setFilters();
      // set filter initial values
      this.filterWtg_Id = this.data.id;
      this.filterDate = this.data.date;
    });
  }

  // setting data to detail page

  setSelectedRow() {
    this.turbineService.wtgsList.forEach((element) => {
      if (this.data.id == element.wtg_id) {
        JSON.stringify(this.displayRowList.push(element));
      }
    });
    this.turbineService.inspectionList.forEach((element) => {
      if (
        this.data.id == element.blade_id.slice(0, 4) &&
        this.data.date == element.inspection_date.slice(0, 10)
      ) {
        JSON.stringify(this.displayInspectionList.push(element));

        this.bladeA = this.displayInspectionList.find((el) => {
          return el.blade_id.slice(5, 6) == 'A';
        });
        this.bladeB = this.displayInspectionList.find((el) => {
          return el.blade_id.slice(5, 6) == 'B';
        });
        this.bladeC = this.displayInspectionList.find((el) => {
          return el.blade_id.slice(5, 6) == 'C';
        });
      }
    });
  }

  // binding cat images to detail page

  getImgSrc(imageCat: BladeCat): string {
    let imageSrc = '../../assets/images/blade-';

    const cat = imageCat.validated ?? imageCat.auto;
    imageSrc += CatColors[cat];

    const isValidated = imageCat.validated != null;
    imageSrc += isValidated ? '-filled.png' : '-unfilled.png';
    this.imgSrcCopy.push(imageSrc);
    return imageSrc;
  }

  // setting filter dropdownn and sorting
  private setFilters(): void {
    const wtg_idList: string[] = [];
    const dateList: string[] = [];
    this.rowDataList.forEach((element) => {
      wtg_idList.push(element.wtg_id);
      dateList.push(element.inspection_date.slice(0, 10));
    });

    wtg_idList.sort((a, b) => {
      const lowerA = a.trim().toLowerCase();
      const lowerB = b.trim().toLowerCase();

      return lowerA === lowerB ? 0 : lowerA > lowerB ? 1 : -1;
    });
    this.dateList.sort((a: any, b: any) => {
      var val1: any = new Date(a.inspection_date).getTime();
      var val2: any = new Date(b.inspection_date).getTime();
      return val1 > val2 ? -1 : 1;
    });
    this.dateList = Array.from(new Set(dateList));
    this.wtg_idList = Array.from(new Set(wtg_idList));
  }

  // used to pass the selected and data from filter dropdown

  onToggleFilter(e: MatSelectChange): void {
    // change url
    this.route.navigate(['detail', this.filterWtg_Id, this.filterDate]);
    this.displayRowList = [];
    this.displayInspectionList = [];
    this.bladeA = '';
    this.bladeB = '';
    this.bladeC = '';
  }

  // setting each blade note

  bladeClick(notes: Note[], label: string) {
    this.sidenavOpen = true;
    this.noteSet = notes;
    this.selectedBlade = label;
    this.selectedImage = 0;
  }

  // setting each image note

  imageClick(date: string, blade: string, index: number, notes: Note[]) {
    this.selectedImage = index;
    this.selectedBlade = blade;
    this.selectedDate = date;
    this.sidenavOpen = true;
    this.noteSet = notes;
  }

  // save form data and pushing to the related array

  saveNote() {
    this.dialog.closeAll();
    let date = new Date().getTime();
    let note: Note = {
      text: this.noteForm.controls['notes'].value,
      date: date,
    };
    this.noteSet.push(note);
    (document.getElementById('input') as HTMLInputElement).value = '';
    this.noteForm.reset();
  }

  // clear input

  clearInput() {
    (document.getElementById('input') as HTMLInputElement).value = '';
    this.noteForm.reset();
  }

  // edit box note showing

  edit(indexEdit: number) {
    this.indexEdit = indexEdit;
    this.noteForm.patchValue({
      notes: this.noteSet[indexEdit].text,
    });
  }

  // editing seleted note

  editNote() {
    this.dialog.closeAll();
    this.noteSet[this.indexEdit].text = this.noteForm.controls['notes'].value;
    this.noteForm.reset();
    (document.getElementById('input') as HTMLInputElement).value = '';
  }

  // delete note index passing

  delete(indexDel: number) {
    this.indexDelete = indexDel;
  }

  // deleting selected note

  deleteItem() {
    this.dialog.closeAll();
    if (this.indexDelete > -1) {
      this.noteSet.splice(this.indexDelete, 1);
    }
  }

  // closing dialog box

  closeDialog() {
    this.dialog.closeAll();
    this.noteForm.reset();
  }

  // close Button

  closeBtn() {
    this.dialog.closeAll();
    this.noteForm.reset();
  }

  // setting dialog box and handling

  openDialogAdd(templateRef: any): void {
    var dialogRef = this.dialog.open(templateRef, {
      width: '500px',
      height: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  // setting dialog box editing

  openDialogEdit(templateRef: any): void {
    var dialogRef = this.dialog.open(templateRef, {
      width: '500px',
      height: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  // setting dialog box delete confirmation

  openDialogDelete(templateRef: any): void {
    var dialogRef = this.dialog.open(templateRef, {
      width: '500px',
      height: '210px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  // setting blade image category

  bladeImgSet(data: any) {
    const bladeKey = 'blade' + data.bladeType;

    let bladeCat: number =
      this[bladeKey as keyof DetailPageComponent].images[0].image_cat
        .validated ??
      this[bladeKey as keyof DetailPageComponent].images[0].image_cat.auto;

    this[bladeKey as keyof DetailPageComponent].images.forEach(
      (element: any) => {
        const cat = element.image_cat.validated ?? element.image_cat.auto;
        if (cat > bladeCat) {
          bladeCat = cat;
        }
      }
    );
    this[bladeKey as keyof DetailPageComponent].blade_cat.auto = bladeCat;
    this.isChange = !this.isChange;
  }

  // setting turbine category

  setTurbineImg(bladeData: any) {
    let maxDate = this.dateList.reduce(function (a, b) {
      return a > b ? a : b;
    });
    if (maxDate == this.data.date) {
      this.rowDataList.forEach((el) => {
        if (el.wtg_id == bladeData.bladeId) {
          let turbineCat =
            el.blades[0].blade_cat.validated ?? el.blades[0].blade_cat.auto;
          el.blades.forEach((item: any) => {
            const turCat = item.blade_cat.validated ?? item.blade_cat.auto;
            if (turCat > turbineCat) {
              turbineCat = turCat;
            }
          });
          el.WTG_cat.auto = turbineCat;
          console.log(turbineCat);
        }
      });
    }
  }
}
