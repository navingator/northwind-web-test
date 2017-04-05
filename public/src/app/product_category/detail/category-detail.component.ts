import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ProdCat } from '../prodcat.class';
import { ProdCatService } from '../prodcat.service';

@Component({
  templateUrl: './category-detail.component.html'
})
export class CategoryDetailComponent implements OnInit {
  public category: ProdCat;

  constructor(
    private categoryService: ProdCatService,
    private route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.categoryService.getCategory(+params.categoryId))
      .subscribe(category => this.category = category);
  }
}
