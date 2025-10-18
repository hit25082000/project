import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class BusinessConfigService {
  get projectName(): string {
    return environment.project_name;
  }

  get email(): string {
    return environment.email;
  }

  get phone(): string {
    return environment.phone;
  }

  get address(): string {
    return environment.address;
  }
}
