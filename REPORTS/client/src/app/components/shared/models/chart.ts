export interface Chart{
    type?: enumType,
    data?: any,
    options?: any
}


export enum enumType {
    line = 'line',
    bar='bar',
}
  