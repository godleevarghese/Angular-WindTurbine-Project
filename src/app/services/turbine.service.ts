import { Injectable } from '@angular/core';
import { Wtgs } from '../models/wtgs.model';
import {Inspection} from '../models/inspection.model';
import { wtgsList } from '../sample-data.helper';
import {inspectionList } from '../sample-inspection-data.helper';
@Injectable({
  providedIn: 'root'
})
export class TurbineService {

  wtgsList: Wtgs[] = wtgsList;
  inspectionList:Inspection[] = inspectionList;


  constructor() { }

 
}
