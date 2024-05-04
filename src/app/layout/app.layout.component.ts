import {
  Component,
  OnDestroy,
  Renderer2,
  ViewChild,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { LayoutService } from './service/app.layout.service';
import { AppSidebarComponent } from './app.sidebar.component';
import { AppTopBarComponent } from './app.topbar.component';

@Component({
  selector: 'app-layout',
  templateUrl: './app.layout.component.html',
})
export class AppLayoutComponent implements OnDestroy {
  overlayMenuOpenSubscription?: Subscription;

  menuOutsideClickListener: Function | null = null;

  profileMenuOutsideClickListener: Function | null = null;

  @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;

  @ViewChild(AppTopBarComponent) appTopbar!: AppTopBarComponent;

  constructor(
    public layoutService: LayoutService,
    public renderer: Renderer2,
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.overlayMenuOpenSubscription =
        this.layoutService.overlayOpen$.subscribe(() => {
          this.setupMenuOutsideClickListener();
        });

      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.hideMenu();
          this.hideProfileMenu();
        });
    }
  }

  private setupMenuOutsideClickListener(): void {
    if (!this.menuOutsideClickListener) {
      this.menuOutsideClickListener = this.renderer.listen(
        'document',
        'click',
        (event: Event) => {
          this.handleOutsideClick(event);
        }
      );
    }

    if (!this.profileMenuOutsideClickListener) {
      this.profileMenuOutsideClickListener = this.renderer.listen(
        'document',
        'click',
        (event: Event) => {
          this.handleProfileOutsideClick(event);
        }
      );
    }

    if (this.layoutService.state.staticMenuMobileActive) {
      this.blockBodyScroll();
    }
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event): void {
    const isOutsideClicked = !(
      this.appSidebar.el.nativeElement.isSameNode(event.target) ||
      this.appSidebar.el.nativeElement.contains(event.target) ||
      this.appTopbar.menuButton.nativeElement.isSameNode(event.target) ||
      this.appTopbar.menuButton.nativeElement.contains(event.target)
    );

    if (isOutsideClicked) {
      this.hideMenu();
    }
  }

  @HostListener('document:click', ['$event'])
  handleProfileOutsideClick(event: Event): void {
    const isOutsideClicked = !(
      this.appTopbar.menu.nativeElement.isSameNode(event.target) ||
      this.appTopbar.menu.nativeElement.contains(event.target) ||
      this.appTopbar.topbarMenuButton.nativeElement.isSameNode(event.target) ||
      this.appTopbar.topbarMenuButton.nativeElement.contains(event.target)
    );

    if (isOutsideClicked) {
      this.hideProfileMenu();
    }
  }

  hideMenu() {
    this.layoutService.state.overlayMenuActive = false;
    this.layoutService.state.staticMenuMobileActive = false;
    this.layoutService.state.menuHoverActive = false;
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
      this.menuOutsideClickListener = null;
    }
    this.unblockBodyScroll();
  }

  hideProfileMenu() {
    this.layoutService.state.profileSidebarVisible = false;
    if (this.profileMenuOutsideClickListener) {
      this.profileMenuOutsideClickListener();
      this.profileMenuOutsideClickListener = null;
    }
  }

  blockBodyScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.addClass(document.body, 'blocked-scroll');
    }
  }

  unblockBodyScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.removeClass(document.body, 'blocked-scroll');
    }
  }

  get containerClass() {
    return {
      'layout-theme-light': this.layoutService.config().colorScheme === 'light',
      'layout-theme-dark': this.layoutService.config().colorScheme === 'dark',
      'layout-overlay': this.layoutService.config().menuMode === 'overlay',
      'layout-static': this.layoutService.config().menuMode === 'static',
      'layout-static-inactive':
        this.layoutService.state.staticMenuDesktopInactive &&
        this.layoutService.config().menuMode === 'static',
      'layout-overlay-active': this.layoutService.state.overlayMenuActive,
      'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
      'p-input-filled': this.layoutService.config().inputStyle === 'filled',
      'p-ripple-disabled': !this.layoutService.config().ripple,
    };
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.overlayMenuOpenSubscription) {
        this.overlayMenuOpenSubscription.unsubscribe();
      }
    }
  }
}
