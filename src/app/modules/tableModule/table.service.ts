import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IItem } from "./types";
import { map } from "rxjs/operators";

@Injectable()
export class TableService {

  constructor(
    private _http: HttpClient
  ) { }

  public fetch(): Observable<IItem[]> {
    return this._http.get<Array<IItem>>('http://localhost:3000/some').pipe(
      map(data => {
        return data.map((item: IItem, index) => (
          {
            ...item,
            image: `https://picsum.photos/200/300?random=${index + 3}`,
            preview: `https://picsum.photos/200/300?random=${index + 3}`,
          }
        ))
      })
    )
  }

}
