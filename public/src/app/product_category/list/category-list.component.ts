import { AfterViewInit, Component, OnInit
  , ViewChild }                           from '@angular/core';
import { MdSidenav }                      from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable }    from 'rxjs/Observable';

import { AuthService } from '../../user/auth.service';
import { DialogService } from '../../core/dialog.service';
import { ProdCatService }  from '../prodcat.service';

import { ProdCat } from '../prodcat.class';

import 'hammerjs';

@Component({
  moduleId: module.id,
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CatListComponent implements OnInit, AfterViewInit {
  public categories: ProdCat[];
  public isAdmin: boolean;

  @ViewChild('sidenav') public sidenav: MdSidenav;

  constructor(
    private authService: AuthService,
    private categoryService: ProdCatService,
    private dialog: DialogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /**
   * Initialize the listing component by getting categories from the database
   */
  public ngOnInit(): void {
    this.categoryService.listCategories()
      .subscribe(
        categories => this.categories = categories,
        (error: Error) => console.error('Error: ' + error),
      );

    this.isAdmin = this.authService.user.isAdmin;
  }

  /**
   * Open the sidenav after it has been initialized, if there are any children
   */
  public ngAfterViewInit(): void {
    // Open the sidenav if there are any children (which are all displayed in the sidenav)
    if (this.route.children.length > 0) {
      this.sidenav.open();
    } else {
      console.log('closing sidenav');
      this.sidenav.close();
    }
  }

  /**
   * Listener for sidenav closing
   */
  public onSidenavClose(): void {
    this.router.navigate(['category']);
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

}
