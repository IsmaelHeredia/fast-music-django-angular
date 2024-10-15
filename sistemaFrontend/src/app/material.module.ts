import { NgModule } from '@angular/core';

import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';

import { TooltipPosition, MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        MatCard,
        MatCardTitle,
        MatCardContent,
        MatFormFieldModule,
        MatFormField,
        MatInputModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatTableModule,
        MatSliderModule,
        MatExpansionModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatDividerModule,
        MatPaginatorModule,
        MatPaginator,
        MatTooltipModule,
    ],
    exports: [
        MatCard,
        MatCardTitle,
        MatCardContent,
        MatFormFieldModule,
        MatFormField,
        MatInputModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatTableModule,
        MatSliderModule,
        MatExpansionModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatDividerModule,
        MatPaginatorModule,
        MatPaginator,
        MatTooltipModule,
    ]
})
export class MaterialModule { }