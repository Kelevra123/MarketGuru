import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ISubTask, ITask, SelectEmit } from "../../../types";



@Component({
  selector: '.select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectComponent implements OnInit {
  @Output('onFilter') public EventEmitter: EventEmitter<SelectEmit> = new EventEmitter<SelectEmit>();
  @Input('sub') public sub: Array<ISubTask> = [];
  @Input('title') public title: string = '';
  @Input('valueSelect') public valueSelect: string = '';


  public task: ITask = {
    name: '',
    value: '',
    completed: false,
    color: 'primary',
    subtasks: []
  };

  constructor() { }

  ngOnInit(): void {
    this.task.subtasks = this.sub;
    this.task.name = this.title;
    this.task.value = this.valueSelect;
  }

  public updateAllComplete() {
    const filterValue = this.task.subtasks
      .filter((t: any) => t.completed)
      .map((t: any) => t.todo);

    this.EventEmitter.emit({field: this.task.value, arr : filterValue});
  }

}
