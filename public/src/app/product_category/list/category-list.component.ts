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

  public ngOnInit(): void {
    this.categoryService.listCategories()
      .subscribe(
        categories => this.categories = categories,
        (error: Error) => console.error('Error: ' + error),
      );

    this.isAdmin = this.authService.user.isAdmin;
  }

  public ngAfterViewInit(): void {
    // Open the sidenav if there are any children (which are all displayed in the sidenav)
    if (this.route.children.length > 0) {
      this.sidenav.open();
    } else {
      this.sidenav.close();
    }
  }

  public onSidenavClose(): void {
    this.router.navigate(['category']);
  }

  public showCategory(category: ProdCat): void {
    this.router.navigate(['detail', category.id], { relativeTo: this.route });
    this.sidenav.open();
  }

  public confirmDelete(category: ProdCat): void {
    this.dialog.confirm(`Are you sure you want to delete ${category.name}?`)
      .then(confirmed => {
        if (confirmed) { this.deleteCategory(category); }
      });
  }

  public deleteCategory(category: ProdCat): void {
    if (!category) { return; }
    this.categoryService.deleteCategory(category.id)
      .subscribe(
        () => this.categories = this.categories.filter(arrayCat => arrayCat !== category),
        (error: Error) => console.error('Error: ' + error),
      );
  }

  public openCreateCategory(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
    this.sidenav.open();
  }

}
