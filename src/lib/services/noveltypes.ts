/********************************************
 * This file is part of Novelist            *
 * Copyright (c) 2021 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

export type metadata_def = {
  id?: string;
  title?: string;
  series?: string;
  cover?: string
  sequence?: number;
  genre?: string;
  language?: string;    // de, en, fr etc.
  description?: string;
  contents?: string;
  tags?: string;
  author?: string;
  fileAs?: string;
  copyright?: string;
  publisher?: string;
  published?: string;     // year-month-day
  created?: Date;
  modified?: Date;
  expose?: string;
  chapters?: Array<string>;
  persons?: Array<string>;
  places?: Array<string>;
  // [propName: string]: any;
};

export type person_def = {
  name?: string;
  nicknames?: Array<string>;
  gender?: 'm' | 'f';
  height?: number | string;
  stature?: string
  hair?: string
  age?: number
  description?: string;
};
export type place_def = {
  name?: string;
  surround?: string;
  description?: string;
};
export type chapter_def = {
  name?: string;
  persons?: Array<string>;
  places?: Array<string>;
  summary?: string;
  time?: string;
  text?: string;
};
export type noveldef = {
  metadata?: metadata_def;
  cover?: Uint8Array;
  persons?: {
    [name: string]: person_def;
  };
  places?: {
    [name: string]: place_def;
  };
  timeline?: string;
  notes?: string;
  chapters?: {
    [name: string]: chapter_def;
  };
};

