export interface MenuItem {
  label: string;
  icon?: string;
  routerLink?: string[];
  items?: MenuItem[];
}
