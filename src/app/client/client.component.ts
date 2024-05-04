import { Component, OnInit } from '@angular/core';
import { AppConfig, LayoutService } from '../layout/service/app.layout.service';
import { PrimeNGConfig } from 'primeng/api';
import { MenuService } from '../layout/app.menu.service';
import { MenuItem } from '../layout/api/menu-item';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
})
export class ClientComponent implements OnInit {
  /**
   *
   */
  constructor(
    private primengConfig: PrimeNGConfig,
    private layoutService: LayoutService,
    private menuService: MenuService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    const config: AppConfig = {
      ripple: true, //toggles ripple on and off
      inputStyle: 'outlined', //default style for input elements
      menuMode: 'static', //layout mode of the menu, valid values are "static" and "overlay"
      colorScheme: 'light', //color scheme of the template, valid values are "light" and "dark"
      theme: 'lara-light-blue', //default component theme for PrimeNG
      scale: 14, //size of the body font size to scale the whole application
    };
    this.layoutService.config.set(config);
    const model: MenuItem[] = [
      {
        label: 'Home',
        icon: 'pi pi-home',
      },
    ];
    this.menuService.menuItems.set(model);
  }
}
