import { NgModule } from "@angular/core";
import { TableComponent } from "./components/table/table.component";
import { ItemComponent } from './components/item/item.component';
import { TableService } from "./table.service";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MatSelectModule } from "@angular/material/select";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule } from "@angular/forms";
import { SelectComponent } from './components/UI/select/select.component';



@NgModule({
  declarations: [
    TableComponent,
    ItemComponent,
    SelectComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FontAwesomeModule,
    MatSelectModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatCheckboxModule,
    FormsModule
  ],
  providers: [TableService],
  exports: [
    TableComponent
  ]
})
export class TableModule { }
