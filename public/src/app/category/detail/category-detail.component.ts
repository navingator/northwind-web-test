/* Angular */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params }       from '@angular/router';

/* Components */
import { NoticeComponent } from '../../shared/notice/notice.component';

/* Services */
import { CategoryService } from '../category.service';
import { ErrorService } from '../../core/error.service';

/* Classes */
import { Category } from '../category.class';

@Component({
  templateUrl: './category-detail.component.html'
})
export class CategoryDetailComponent implements OnInit {
  public category: Category;

  @ViewChild(NoticeComponent) private notice: NoticeComponent;

  constructor(
    private categoryService: CategoryService,
    private errorService: ErrorService,
    private route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.categoryService.getCategory(+params.categoryId))
      .subscribe(
        category => this.category = category,
        error => this.errorService.handleError(error, this.notice)
      );
  }
}
