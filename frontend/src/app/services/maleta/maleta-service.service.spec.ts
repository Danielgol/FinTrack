import { TestBed } from '@angular/core/testing';

import { MaletaService } from './maleta-service.service';

describe('MaletaService', () => {
  let service: MaletaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaletaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
