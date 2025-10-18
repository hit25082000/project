import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { BusinessConfigService } from './app/shared/services/business-config.service';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

var project = new BusinessConfigService();
