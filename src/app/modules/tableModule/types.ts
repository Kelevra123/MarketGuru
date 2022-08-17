import { FilterMethod } from "./table.enum";

export interface IItem {
  id: string,
  wbRating: number,
  reviewsCount: number,
  nomenclature: number,
  sku: string,
  "name": string,
  "brandName": string,
  "brandId": string,
  "image": string,
  "preview": string,
  "ordered": number,
  "soldQuantity": number,
  "soldAmount": number,
  "orderedAmount": number,
  "availability": number
}

export interface ISubTask {
  name: string,
  completed: boolean,
  color: string,
  todo: number | string
}

export interface ITask {
  name: string,
  value: string,
  completed: boolean,
  color: string,
  subtasks: Array<ISubTask>
}

export type SelectOptions = {
  filterMethod: FilterMethod,
  subtask: ISubTask[]
}

export type SelectEmit = {
  field: string,
  arr: Array<ISubTask>
}

export type FilterOptions = {
  T: Array<any>
}
