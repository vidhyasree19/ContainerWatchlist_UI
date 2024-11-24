import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CosmosContainerComponent } from './container.component';

describe('ContainerComponent', () => {
  let component: CosmosContainerComponent;
  let fixture: ComponentFixture<CosmosContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CosmosContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CosmosContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
