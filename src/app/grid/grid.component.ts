import { Component, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TurbineService } from '../services/turbine.service';
import { Wtgs } from '../models/wtgs.model';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {
  columnDefs: any[] = [];
  rowDataList: Wtgs[] = JSON.parse(
    JSON.stringify(this.turbineService.wtgsList)
  ); // Deep copy
  farmList: string[] = [];
  inspectionDateList: string[] = [];
  wtgIdList: string[] = [];
  wtgCatList: any[] = [];
  filterFarmList: string[] = [];
  filterInspectionDateList: string[] = [];
  filterWtgIdList: string[] = [];
  filterWtgCatList: string[] = [];

  constructor(private turbineService: TurbineService, private router: Router) {}

  ngOnInit() {
    this.setColoumDef();
    this.setFilters();
  }

  // passing id and date through url on clicking row element

  onRowClick(data: any) {
    this.router.navigate([
      '/detail',
      data.wtg_id,
      data.inspection_date.slice(0, 10),
    ]);
  }

  // 4 methods to reset filter

  resetFarm() {
    this.filterFarmList = [];
  }
  resetInspection() {
    this.filterInspectionDateList = [];
  }
  resetID() {
    this.filterWtgIdList = [];
  }
  resetCat() {
    this.filterWtgCatList = [];
  }

  // filter data and return

  onToggleFilter(isOpen: boolean): void {
    if (isOpen) {
      return;
    }

    if (
      this.filterFarmList.length +
        this.filterInspectionDateList.length +
        this.filterWtgIdList.length +
        this.filterWtgCatList.length >
      0
    ) {
      this.rowDataList = this.turbineService.wtgsList.filter((wtg) => {
        const isValidFarm =
          this.filterFarmList.length > 0
            ? this.filterFarmList.includes(wtg.farm)
            : true;

        const isValidInspectionDate =
          this.filterInspectionDateList.length > 0
            ? this.filterInspectionDateList.includes(
                wtg.inspection_date.slice(0, 4)
              )
            : true;

        const isValidWtgId =
          this.filterWtgIdList.length > 0
            ? this.filterWtgIdList.includes(wtg.wtg_id)
            : true;

        const wtgCat =
          wtg.WTG_cat.validated != null
            ? 'V' + wtg.WTG_cat.validated
            : 'A' + wtg.WTG_cat.auto;
        const isValidWtgCat =
          this.filterWtgCatList.length > 0
            ? this.filterWtgCatList.includes(wtgCat)
            : true;

        return (
          isValidFarm && isValidInspectionDate && isValidWtgId && isValidWtgCat
        );
      });
    } else {
      this.rowDataList = JSON.parse(
        JSON.stringify(this.turbineService.wtgsList) // Deep copy
      );
    }
  }

  // setting data to grid

  private setColoumDef(): void {
    this.columnDefs = [
      { headerName: 'WTG Class', field: 'wtg_class' },
      { headerName: 'Farms', field: 'farm' },
      { headerName: 'WTG ID', field: 'wtg_id' },
      { headerName: 'WTG Model', field: 'wtg_model' },
      { headerName: 'Blade Model', field: 'blade_model' },
      {
        headerName: 'Last Inspection',
        field: 'inspection_date',
        cellRenderer: (data: { value: string | number | Date }) => {
          return data.value ? new Date(data.value).toLocaleDateString() : '';
        },
      },
      {
        headerName: 'Next Inspection',
        field: 'next_inspection',
        cellRenderer: (data: { value: string | number | Date }) => {
          return data.value ? new Date(data.value).toLocaleDateString() : '';
        },
      },
      {
        headerName: 'WTG Category',
        field: 'WTG_cat.auto',
        valueGetter: (params: any) => {
          const wtg: Wtgs = params.data;
          return wtg.WTG_cat.validated != null
            ? 'V' + wtg.WTG_cat.validated
            : 'A' + wtg.WTG_cat.auto;
        },
      },

      {
        headerName: 'Blade 1',
        children: [
          {
            headerName: 'Serial_No',
            field: 'blades',
            valueGetter: 'data.blades[0].serial_number',
          },
          {
            field: 'Cat',
            valueGetter: (params: { data: any }) =>
              params.data.blades[0].blade_cat.auto,
          },
        ],
      },
      {
        headerName: 'Blade 2',
        children: [
          {
            field: 'Serial No',
            valueGetter: (params: { data: any }) =>
              params.data.blades[1].serial_number,
          },
          {
            field: 'Cat',
            valueGetter: (params: { data: any }) =>
              params.data.blades[1].blade_cat.auto,
          },
        ],
      },

      {
        headerName: 'Blade 3',
        children: [
          {
            field: 'Serial No',
            valueGetter: (params: { data: any }) =>
              params.data.blades[2].serial_number,
          },
          {
            field: 'Cat',
            valueGetter: (params: { data: any }) =>
              params.data.blades[2].blade_cat.auto,
          },
        ],
      },
    ];
  }

  // setting filter dropdown and sorting

  private setFilters(): void {
    const farmList: string[] = [];
    const inspectionDateList: string[] = [];
    const wtgIdList: string[] = [];

    this.rowDataList.forEach((element) => {
      farmList.push(element.farm);
      inspectionDateList.push(element.next_inspection.slice(0, 4));
      wtgIdList.push(element.wtg_id);
    });

    farmList.sort((a, b) => {
      const lowerA = a.trim().toLowerCase();
      const lowerB = b.trim().toLowerCase();

      return lowerA === lowerB ? 0 : lowerA > lowerB ? 1 : -1;
    });

    inspectionDateList.sort((a, b) => (a === b ? 0 : a > b ? 1 : -1));

    wtgIdList.sort((a, b) => {
      const lowerA = a.trim().toLowerCase();
      const lowerB = b.trim().toLowerCase();

      return lowerA === lowerB ? 0 : lowerA > lowerB ? 1 : -1;
    });

    this.farmList = Array.from(new Set(farmList));
    this.inspectionDateList = Array.from(new Set(inspectionDateList));
    this.wtgIdList = Array.from(new Set(wtgIdList));
    this.wtgCatList = [
      {
        label: 'cat. 5',
        value: 'V5',
        imgSrc: 'assets/images/category-red-filled.png',
      },
      {
        label: 'cat. 4',
        value: 'V4',
        imgSrc: 'assets/images/category-orange-filled.png',
      },
      {
        label: 'cat. 3',
        value: 'V3',
        imgSrc: 'assets/images/category-yellow-filled.png',
      },
      {
        label: 'cat. 2',
        value: 'V2',
        imgSrc: 'assets/images/category-green-filled.png',
      },
      {
        label: 'cat. 1',
        value: 'V1',
        imgSrc: 'assets/images/category-azure-filled.png',
      },
      {
        label: 'cat. 5',
        value: 'A5',
        imgSrc: 'assets/images/category-red-unfilled.png',
      },
      {
        label: 'cat. 4',
        value: 'A4',
        imgSrc: 'assets/images/category-orange-unfilled.png',
      },
      {
        label: 'cat. 3',
        value: 'A3',
        imgSrc: 'assets/images/category-yellow-unfilled.png',
      },
      {
        label: 'cat. 2',
        value: 'A2',
        imgSrc: 'assets/images/category-green-unfilled.png',
      },
      {
        label: 'cat. 1',
        value: 'A1',
        imgSrc: 'assets/images/category-azure-unfilled.png',
      },
    ];
  }
}
