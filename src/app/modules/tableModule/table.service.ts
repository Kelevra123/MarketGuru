import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IItem } from "./types";

@Injectable()
export class TableService {

  constructor(private _http: HttpClient) {
  }

  public fetch(): Observable<IItem[]> {
    return this._http.get<Array<IItem>>('http://localhost:3000/some')
  }

}
