import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { IItem } from "../../types";
import { faStar } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: '.item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ItemComponent implements OnInit {
  @Input() public item: IItem | null = null;
  public faStar = faStar;

  constructor() { }

  ngOnInit(): void {

  }

}
