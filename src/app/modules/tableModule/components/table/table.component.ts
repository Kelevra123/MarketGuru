import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TableService } from "../../table.service";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { IItem } from "../../types";
import { MatPaginator } from "@angular/material/paginator";
import { TableEnum } from "../../table.enum";
import { ViewportScroller } from "@angular/common";

@Component({
  selector: '.table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator)
  public paginator: MatPaginator | null = null;

  public $allItems: Observable<IItem[]> = new Observable<any>();
  public $tableItems: Observable<IItem[]> = new Observable<any>();
  public $sortedItems: Observable<IItem[]> = new Observable<any>();
  public limit: number = 6;
  public size: number = 0;
  public actualPage: number = 0;
  public isFilter: boolean = false;

  allComplete: boolean = false;

  task: any = {
    name: 'Rating',
    completed: false,
    color: 'primary',
    subtasks: [
      {name: '5', completed: false, color: 'warn', todo: 5},
      {name: '4', completed: false, color: 'warn', todo: 4},
      {name: '3', completed: false, color: 'warn', todo: 3},
    ],
  };

  constructor(
    private readonly _tableService: TableService,
    private viewPortScroller : ViewportScroller
  ) { }

  ngOnInit(): void {
    this.$allItems = this.$tableItems = this._tableService.fetch().pipe(
      map(data => {
        return data.map((item: IItem, index) => (
          {
            ...item,
            image: `https://picsum.photos/200/300?random=${index + 3}`,
            preview: `https://picsum.photos/200/300?random=${index + 3}`,
          }
        ))
      }),
      map(data => {
        this.size = data.length;
        return data;
      } )
    )
    this.$tableItems = this.$allItems.pipe(
      map(data => data.slice(0, this.limit))
    )
    this.$sortedItems = this.$allItems;
  }

  ngAfterViewInit(): void {
    this.paginator?.page
      .pipe(
        tap(() => this.paginatorHandler())
      )
      .subscribe()
  }

  private paginatorHandler(force: boolean = false) {
    this.$tableItems = this.$sortedItems.pipe(
      map(data => {
        if (this.paginator && typeof this.paginator.pageIndex === "number" && typeof this.paginator.pageSize === "number") {
          if (!force) {
            this.actualPage = this.paginator.pageIndex
          }
          return data.slice(this.actualPage * this.paginator.pageSize, (this.actualPage + 1)* this.paginator.pageSize);
        }


        return data;
      })
    )
    if (!force) {
      this.viewPortScroller.scrollToPosition([0, 0])
    }

  }

  public handleFilter(e: any) {
    if (e.value != TableEnum.NO_FILTER) {
      this.isFilter = true;

      if (e.value === TableEnum.ALPHABET) {
        this.$sortedItems = this.$sortedItems.pipe(
          map(data => data.sort((a, b) => a.name > b.name ? 1 : -1)),
        )
      }
      else if (e.value === TableEnum.RATING) {
        this.$sortedItems = this.$sortedItems.pipe(
          map(data => data.sort(function (a, b) {
            return b.wbRating - a.wbRating
          }))
        )
      }
      else if (e.value === TableEnum.REVIEWS_COUNT) {
        this.$sortedItems = this.$sortedItems.pipe(
          map(data => data.sort(function (a, b) {
            return b.reviewsCount - a.reviewsCount
          }))
        )
      }
    }
    else {
      this.$sortedItems = this.$allItems
    }

    this.paginatorHandler()
  }

  public updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every((t: any) => t.completed);

    this.$sortedItems = this.$sortedItems.pipe(
      map(data => {
        const filterValue = this.task.subtasks
          .filter((t: any) => t.completed)
          .map((t: any) => t.todo)
        if (filterValue.length) {
          data = data.filter(item => filterValue.includes(item.wbRating))
        } else {
            data = data
        }
        this.size = data.length;
        this.actualPage = 0;
        return data
      })
    )

    this.paginator?.firstPage()
    this.paginatorHandler(true)
  }
}
