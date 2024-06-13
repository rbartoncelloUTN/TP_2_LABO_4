export interface Country {
  name: Name;
  tld?: string[];
  cca2: string;
  ccn3?: string;
  cca3: string;
  cioc?: string;
  independent?: boolean;
  status: Status;
  unMember: boolean;
  currencies?: Currencies;
  idd: Idd;
  capital?: string[];
  altSpellings: string[];
  region: Region;
  subregion?: string;
  languages?: { [key: string]: string };
  translations: { [key: string]: Translation };
  latlng: number[];
  landlocked: boolean;
  borders?: string[];
  area: number;
  demonyms?: Demonyms;
  flag: string;
  maps: Maps;
  population: number;
  gini?: { [key: string]: number };
  fifa?: string;
  car: Car;
  timezones: string[];
  continents: Continent[];
  flags: Flags;
  coatOfArms: CoatOfArms;
  startOfWeek: StartOfWeek;
  capitalInfo: CapitalInfo;
  postalCode?: PostalCode;
}

export interface CapitalInfo {
  latlng?: number[];
}

export interface Car {
  signs?: string[];
  side: Side;
}

export enum Side {
  Left = 'left',
  Right = 'right',
}

export interface CoatOfArms {
  png?: string;
  svg?: string;
}

export enum Continent {
  Africa = 'Africa',
  Antarctica = 'Antarctica',
  Asia = 'Asia',
  Europe = 'Europe',
  NorthAmerica = 'North America',
  Oceania = 'Oceania',
  SouthAmerica = 'South America',
}

export interface Currencies {
  MDL?: Aed;
  USD?: Aed;
  EUR?: Aed;
  AUD?: Aed;
  MZN?: Aed;
  BRL?: Aed;
  CVE?: Aed;
  XAF?: Aed;
  ALL?: Aed;
  NZD?: Aed;
  NGN?: Aed;
  GMD?: Aed;
  SOS?: Aed;
  YER?: Aed;
  MYR?: Aed;
  XCD?: Aed;
  GBP?: Aed;
  MGA?: Aed;
  DZD?: Aed;
  MAD?: Aed;
  MRU?: Aed;
  PYG?: Aed;
  LKR?: Aed;
  ZAR?: Aed;
  KWD?: Aed;
  SLL?: Aed;
  RWF?: Aed;
  SYP?: Aed;
  HNL?: Aed;
  JOD?: Aed;
  TVD?: Aed;
  NPR?: Aed;
  LRD?: Aed;
  GGP?: Aed;
  DJF?: Aed;
  FJD?: Aed;
  NOK?: Aed;
  FKP?: Aed;
  KZT?: Aed;
  TMT?: Aed;
  BGN?: Aed;
  XPF?: Aed;
  BBD?: Aed;
  STN?: Aed;
  BND?: Aed;
  SGD?: Aed;
  BTN?: Aed;
  INR?: Aed;
  ARS?: Aed;
  AZN?: Aed;
  MXN?: Aed;
  GTQ?: Aed;
  KES?: Aed;
  CZK?: Aed;
  GIP?: Aed;
  AWG?: Aed;
  AED?: Aed;
  SSP?: Aed;
  XOF?: Aed;
  SHP?: Aed;
  BWP?: Aed;
  UZS?: Aed;
  TND?: Aed;
  HKD?: Aed;
  MKD?: Aed;
  SRD?: Aed;
  SBD?: Aed;
  UAH?: Aed;
  BAM?: BAM;
  IRR?: Aed;
  CUC?: Aed;
  CUP?: Aed;
  ERN?: Aed;
  TRY?: Aed;
  PHP?: Aed;
  VUV?: Aed;
  BOB?: Aed;
  RON?: Aed;
  KHR?: Aed;
  ZWL?: Aed;
  JEP?: Aed;
  KGS?: Aed;
  GYD?: Aed;
  AMD?: Aed;
  LBP?: Aed;
  DKK?: Aed;
  PGK?: Aed;
  ZMW?: Aed;
  TTD?: Aed;
  PEN?: Aed;
  SEK?: Aed;
  SDG?: BAM;
  OMR?: Aed;
  TWD?: Aed;
  MNT?: Aed;
  TZS?: Aed;
  CAD?: Aed;
  CRC?: Aed;
  CNY?: Aed;
  COP?: Aed;
  MMK?: Aed;
  RUB?: Aed;
  KPW?: Aed;
  KYD?: Aed;
  BYN?: Aed;
  SZL?: Aed;
  PLN?: Aed;
  CHF?: Aed;
  VES?: Aed;
  PAB?: Aed;
  WST?: Aed;
  FOK?: Aed;
  THB?: Aed;
  BSD?: Aed;
  TOP?: Aed;
  BIF?: Aed;
  BHD?: Aed;
  IMP?: Aed;
  HTG?: Aed;
  AFN?: Aed;
  ILS?: Aed;
  LYD?: Aed;
  UYU?: Aed;
  NIO?: Aed;
  CKD?: Aed;
  LAK?: Aed;
  KID?: Aed;
  ANG?: Aed;
  JMD?: Aed;
  EGP?: Aed;
  CLP?: Aed;
  LSL?: Aed;
  GHS?: Aed;
  SCR?: Aed;
  AOA?: Aed;
  BMD?: Aed;
  PKR?: Aed;
  SAR?: Aed;
  KRW?: Aed;
  ETB?: Aed;
  BDT?: Aed;
  KMF?: Aed;
  BZD?: Aed;
  UGX?: Aed;
  HUF?: Aed;
  ISK?: Aed;
  TJS?: Aed;
  NAD?: Aed;
  RSD?: Aed;
  MUR?: Aed;
  MOP?: Aed;
  MVR?: Aed;
  IDR?: Aed;
  CDF?: Aed;
  VND?: Aed;
  GNF?: Aed;
  GEL?: Aed;
  MWK?: Aed;
  IQD?: Aed;
  JPY?: Aed;
  DOP?: Aed;
  QAR?: Aed;
}

export interface Aed {
  name: string;
  symbol: string;
}

export interface BAM {
  name: string;
}

export interface Demonyms {
  eng: Eng;
  fra?: Eng;
}

export interface Eng {
  f: string;
  m: string;
}

export interface Flags {
  png: string;
  svg: string;
  alt?: string;
}

export interface Idd {
  root?: string;
  suffixes?: string[];
}

export interface Maps {
  googleMaps: string;
  openStreetMaps: string;
}

export interface Name {
  common: string;
  official: string;
  nativeName?: { [key: string]: Translation };
}

export interface Translation {
  official: string;
  common: string;
}

export interface PostalCode {
  format: string;
  regex?: string;
}

export enum Region {
  Africa = 'Africa',
  Americas = 'Americas',
  Antarctic = 'Antarctic',
  Asia = 'Asia',
  Europe = 'Europe',
  Oceania = 'Oceania',
}

export enum StartOfWeek {
  Monday = 'monday',
  Saturday = 'saturday',
  Sunday = 'sunday',
}

export enum Status {
  OfficiallyAssigned = 'officially-assigned',
  UserAssigned = 'user-assigned',
}
