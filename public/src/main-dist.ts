import { platformBrowser } from '@angular/platform-browser';
import { AppModuleNgFactory } from '../dist/src/app/app.module.ngfactory';

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
