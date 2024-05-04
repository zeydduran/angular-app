import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { ProductService } from '../demo/service/product.service';

@NgModule({
  declarations: [ClientComponent],
  imports: [CommonModule, ClientRoutingModule],
  providers: [ProductService],
  bootstrap: [ClientComponent],
})
export class ClientModule {}
