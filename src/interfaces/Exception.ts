export interface Meta {
  reportError?: true
}

export interface Exception {
  message: string;
  code: number;
  meta: Meta;
  reportError?: boolean
}