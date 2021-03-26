export interface Inspection {
  blade_id: string;
  inspection_date: string;
  blade_serial_num: string;
  blade_cat: any;
  notes: Note[];
  images: Images[];
}

export interface BladeCat {
  auto: number;
  validated: number;
}

export interface Note {
  text: string;
  date: number;
}
export interface Images {
  image_cat: BladeCat;
  image_hash: string;
  notes: Note[];
  URI: string;
}
