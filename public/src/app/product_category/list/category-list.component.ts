import { AfterViewInit, Component, OnDestroy,
  OnInit, ViewChild }                           from '@angular/core';
import { MdSidenav }                      from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable }   from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../user/auth.service';
import { CategoryChangeService } from '../category-change.service';
import { DialogService } from '../../core/dialog.service';
import { ProdCatService }  from '../prodcat.service';

import { ProdCat } from '../prodcat.class';

import 'hammerjs';

@Component({
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CatListComponent implements OnInit, AfterViewInit, OnDestroy {
  public categories: ProdCat[];
  public isAdmin: boolean;

  @ViewChild('sidenav') public sidenav: MdSidenav;

  private changeSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private categoryService: ProdCatService,
    private changeService: CategoryChangeService,
    private dialog: DialogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /**
   * Initialize the listing component by getting categories from the database
   */
  public ngOnInit(): void {
    this.getCategories();

    this.changeSubscription = this.changeService.catChange$
      .subscribe(() => {
        this.getCategories();
        this.sidenav.close();
      });

    this.isAdmin = this.authService.user.isAdmin;
  }

  public ngOnDestroy(): void {
    this.changeSubscription.unsubscribe();
  }

  /**
   * Open the sidenav after it has been initialized, if there are any children
   */
  public ngAfterViewInit(): void {
    // Open the sidenav if there are any children (which are all displayed in the sidenav)
    if (this.route.children.length > 0) {
      this.sidenav.open();
    }
  }

  /**
   * Listener for sidenav closing
   */
  public onSidenavClose(): void {
    this.router.navigate(['categories']);
  }

  /**
   * Request confirmation before deleting a product
   * @param {ProdCat} category Category to be deleted
   */
  public confirmDelete(category: ProdCat): void {
    this.dialog.confirm(`Are you sure you want to delete ${category.name}?`)
      .then(confirmed => {
        if (confirmed) { return this.deleteCategory(category); }
      });
  }

  /**
   * TODO Show error for deleting populated category
   * Calls CategoryService to delete a category
   * @param {ProdCat} category Category to be deleted
   */
  public deleteCategory(category: ProdCat): void {
    if (!category) { return; }
    this.categoryService.deleteCategory(category.id)
      .subscribe(
        () => this.categories = this.categories.filter(arrayCat => arrayCat !== category),
        (error: Error) => console.error('Error: ' + error),
      );
  }

  /**
   * Opens the category detail page for the given category
   * @param {ProdCat} category Category to be shown
   */
  public openCategoryDetails(category: ProdCat): void {
    this.router.navigate(['detail', category.id], { relativeTo: this.route });
    this.sidenav.open();
  }

  /**
   * Called by the category create button. Navigates to the create sidenav
   */
  public openCreateCategory(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
    this.sidenav.open();
  }

  /**
   * Called by the category edit button. Navigates to the edit sidenav
   */
  public openEditCategory(category: ProdCat): void {
    this.router.navigate(['edit', category.id], { relativeTo: this.route });
    this.sidenav.open();
  }

  /**
   * Get categories when initializing and refreshing component
   */
  private getCategories(): void {
    this.categoryService.listCategories()
      .subscribe(
        categories => this.categories = categories,
        (error: Error) => console.error('Error: ' + error),
      );
  }

}
