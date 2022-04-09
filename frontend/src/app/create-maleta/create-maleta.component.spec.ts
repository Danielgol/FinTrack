import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateMaletaComponent } from './create-maleta.component';

describe('CreateMaletaComponent', () => {
  let component: CreateMaletaComponent;
  let fixture: ComponentFixture<CreateMaletaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMaletaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMaletaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
