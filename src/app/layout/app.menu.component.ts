import { Component, OnInit } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { MenuService } from './app.menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  constructor(public menuService: MenuService) {}

  ngOnInit() {
    this.model = this.menuService.menuItems();
    console.log(this.menuService);
  }
}
