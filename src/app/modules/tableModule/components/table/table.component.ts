import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TableService } from "../../table.service";
import { tap } from "rxjs/operators";
import { IItem, SelectEmit, SelectOptions } from "../../types";
import { MatPaginator } from "@angular/material/paginator";
import { FilterMethod, TableEnum } from "../../table.enum";
import { ViewportScroller } from "@angular/common";

@Component({
  selector: '.table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator)
  public paginator: MatPaginator | null = null;

  public data: Array<IItem> = [];
  public originalData: Array<IItem> = [];
  public sortedData: Array<IItem> = [];
  public originalSortedData: Array<IItem> = [];
  public filtredSortedData: Array<IItem> = [];

  public limit: number = 6;
  public size: number = 0;
  public actualPage: number = 0;
  public filterEmit: any = {};

  public filterByRating: SelectOptions = {
    filterMethod : FilterMethod.BY_RATING,
    subtask: [
      {name: '5', completed: false, color: 'warn', todo: 5},
      {name: '4', completed: false, color: 'warn', todo: 4},
      {name: '3', completed: false, color: 'warn', todo: 3}
    ]
  };

  public filterBySold: SelectOptions = {
    filterMethod: FilterMethod.BY_SOLD,
    subtask: [
      {name: 'Больше 10000', completed: false, color: 'warn', todo: 10000},
      {name: 'Больше 30000', completed: false, color: 'warn', todo: 30000},
      {name: 'Больше 50000', completed: false, color: 'warn', todo: 50000}
    ]
  };


  constructor(
    private readonly _tableService: TableService,
    private _viewPortScroller : ViewportScroller
  ) { }

  ngOnInit(): void {
    this._tableService.fetch().subscribe(data => {
      this.data = [...data];
      this.originalData = [...data];
      this.sortedData = [...this.data];
      this.filtredSortedData = [...this.data.slice(0, this.limit)];
      this.originalSortedData = [...this.sortedData];
      this.size = data.length;
    })
  }

  ngAfterViewInit(): void {
    this.paginator?.page
      .pipe(
        tap(() => this.paginatorHandler())
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.paginator?.page.unsubscribe()
  }

  private paginatorHandler(force: boolean = false) {
    if (this.paginator && typeof this.paginator.pageIndex === "number" && typeof this.paginator.pageSize === "number") {
      if (!force) {
        this.actualPage = this.paginator.pageIndex;
      }
      this.filtredSortedData = [...this.sortedData.slice(this.actualPage * this.paginator.pageSize, (this.actualPage + 1)* this.paginator.pageSize)];
    }


    if (!force) {
      this._viewPortScroller.scrollToPosition([0, 0]);
    }

  }

  public handleFilter(e: any) {
    if (e.value != TableEnum.NO_FILTER) {

      if (e.value === TableEnum.ALPHABET) {
        this.sortedData = [...this.sortedData.sort((a: IItem, b: IItem) => a.name > b.name ? 1 : -1)];
        this.originalSortedData = [...this.data.sort((a: IItem, b: IItem) => a.name > b.name ? 1 : -1)];
      }
      else if (e.value === TableEnum.RATING) {
        this.sortedData = [...this.sortedData.sort(function (a: IItem, b: IItem) {
          return b.wbRating - a.wbRating;
        })];
        this.originalSortedData = [...this.data.sort(function (a: IItem, b: IItem) {
          return b.wbRating - a.wbRating;
        })];
      }
      else if (e.value === TableEnum.REVIEWS_COUNT) {
        this.sortedData = [...this.sortedData.sort(function (a: IItem, b: IItem) {
          return b.reviewsCount - a.reviewsCount;
        })];
        this.originalSortedData = [...this.data.sort(function (a: IItem, b: IItem) {
          return b.reviewsCount - a.reviewsCount;
        })];
      }
    }
    else {
      this.sortedData = [...this.originalData];
      this.originalSortedData = [...this.originalData];
    }

    this.paginatorHandler()
  }

  private filter = (filterObj: any) => {
    let filtredArr = [...this.originalSortedData];

    for (let key in filterObj) {
      if (key === FilterMethod.BY_RATING) {
        const arr: any[] = filterObj[key];
        if (arr.length) {
          filtredArr = [...filtredArr.filter((i: IItem) => arr.includes(i[key as keyof IItem]))];
        }
        else {
            this.sortedData = [...filtredArr];
        }
      }
      if (key === FilterMethod.BY_SOLD) {
        const arr: any[] = filterObj[key];
        if (arr.length) {
          filtredArr = [...filtredArr.filter((i: IItem) => i[key as keyof IItem] > Math.min(...arr))];
        }
        else {
          this.sortedData = [...filtredArr];
        }
      }
    }

    this.sortedData = [...filtredArr];
  }

  public onFilter($event: SelectEmit) {
    if ($event) {
      this.filterEmit[$event.field] = $event.arr;
      this.filter(this.filterEmit);

      this.size = this.sortedData.length;
      this.paginator?.firstPage();
      this.paginatorHandler(true);
    }
  }
}
