import {CommonModule} from "@angular/common";
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient, HttpParams} from "@angular/common/http";

interface WebinarRow {
    id?: number;
    type: 'WEBINAR' | 'LIVE';
    state: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    location_indirizzo1: string;
    location_indirizzo2: string;
    location_indirizzo3: string;
    title: string;
    description: string;
    utcDate: string;
    people: number;
    extra: string;
    price: number;
    form: number;
}

type WebinarDraft = Omit<WebinarRow, 'id' | 'form'> & {form: boolean};

@Component({
    selector: 'c-admin-webinar',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './c.html',
    styleUrls: ['./c.scss']
})
export class CAdminWebinar implements OnInit {
    private readonly apiUrl = '/php/crud/backend/api.php';
    webinars: WebinarRow[] = [];
    readonly webinarForm;
    loading = false;
    saving = false;
    error = '';
    success = '';
    editingId?: number;

    constructor(
        private http: HttpClient,
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder
    ) {
        this.webinarForm = this.fb.nonNullable.group({
            type: this.fb.nonNullable.control<WebinarRow['type']>('WEBINAR', Validators.required),
            state: this.fb.nonNullable.control<WebinarRow['state']>('DRAFT', Validators.required),
            location_indirizzo1: this.fb.nonNullable.control(''),
            location_indirizzo2: this.fb.nonNullable.control(''),
            location_indirizzo3: this.fb.nonNullable.control(''),
            title: this.fb.nonNullable.control('', Validators.required),
            description: this.fb.nonNullable.control('', Validators.required),
            utcDate: this.fb.nonNullable.control('', Validators.required),
            people: this.fb.nonNullable.control(0, Validators.required),
            extra: this.fb.nonNullable.control('', Validators.required),
            price: this.fb.nonNullable.control(0, Validators.required),
            form: this.fb.nonNullable.control(true)
        });
    }

    ngOnInit(): void {
        this.loadWebinars();
    }

    loadWebinars(): void {
        this.loading = true;
        this.error = '';
        const params = new HttpParams()
            .set('action', 'rows')
            .set('table', 'webinar')
            .set('limit', 500);

        this.http.get<Record<string, unknown>[]>(this.apiUrl, {params}).subscribe({
            next: (rows) => {
                this.webinars = rows.map((row) => this.mapRow(row));
                this.loading = false;
                this.cdr.markForCheck();
            },
            error: (err) => {
                this.loading = false;
                this.error = err?.error?.error ?? 'Errore caricamento webinar';
                this.cdr.markForCheck();
            }
        });
    }

    startCreate(): void {
        this.editingId = undefined;
        this.webinarForm.reset(this.createEmptyDraft());
        this.success = '';
        this.error = '';
    }

    startEdit(row: WebinarRow): void {
        this.editingId = row.id;
        this.webinarForm.setValue(this.toDraft(row));

        this.success = '';
        this.error = '';
        this.cdr.markForCheck();
    }

    cancelEdit(): void {
        this.startCreate();
    }

    save(): void {
        if (this.webinarForm.invalid) {
            this.webinarForm.markAllAsTouched();
            return;
        }

        this.saving = true;
        this.error = '';
        this.success = '';

        const payload = this.toPayload(this.webinarForm.getRawValue());
        const isEdit = this.editingId !== undefined;

        if (isEdit) {
            const params = new HttpParams()
                .set('action', 'row')
                .set('table', 'webinar')
                .set('id', String(this.editingId));

            this.http.put(this.apiUrl, payload, {params}).subscribe({
                next: () => {
                    this.saving = false;
                    this.success = 'Webinar aggiornato';
                    this.startCreate();
                    this.loadWebinars();
                    this.cdr.markForCheck();
                },
                error: (err) => {
                    this.saving = false;
                    this.error = err?.error?.error ?? 'Errore aggiornamento webinar';
                    this.cdr.markForCheck();
                }
            });
            return;
        }

        const params = new HttpParams()
            .set('action', 'rows')
            .set('table', 'webinar');

        this.http.post(this.apiUrl, payload, {params}).subscribe({
            next: () => {
                this.saving = false;
                this.success = 'Webinar creato';
                this.startCreate();
                this.loadWebinars();
                this.cdr.markForCheck();
            },
            error: (err) => {
                this.saving = false;
                this.error = err?.error?.error ?? 'Errore creazione webinar';
                this.cdr.markForCheck();
            }
        });
    }

    remove(row: WebinarRow): void {
        if (!row.id || !confirm(`Eliminare "${row.title}"?`)) {
            return;
        }

        this.error = '';
        this.success = '';
        const params = new HttpParams()
            .set('action', 'row')
            .set('table', 'webinar')
            .set('id', String(row.id));

        this.http.delete(this.apiUrl, {params}).subscribe({
            next: () => {
                this.success = 'Webinar eliminato';
                this.loadWebinars();
                if (this.editingId === row.id) {
                    this.startCreate();
                }
                this.cdr.markForCheck();
            },
            error: (err) => {
                this.error = err?.error?.error ?? 'Errore eliminazione webinar';
                this.cdr.markForCheck();
            }
        });
    }

    private toPayload(value: WebinarDraft): Record<string, unknown> {
        return {
            type: value.type,
            state: value.state,
            location_indirizzo1: value.location_indirizzo1,
            location_indirizzo2: value.location_indirizzo2,
            location_indirizzo3: value.location_indirizzo3,
            title: value.title,
            description: value.description,
            utcDate: this.toDbDate(value.utcDate),
            people: Number(value.people),
            extra: value.extra,
            price: Number(value.price),
            form: value.form ? 1 : 0
        };
    }

    private toDbDate(value: string): string {
        if (!value) {
            return value;
        }
        return value.length === 16 ? value.replace('T', ' ') + ':00' : value.replace('T', ' ');
    }

    private toInputDate(value: string): string {
        if (!value) {
            return value;
        }
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
            return value.slice(0, 16);
        }
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(value)) {
            return value.replace(' ', 'T').slice(0, 16);
        }
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) {
            const pad = (n: number) => String(n).padStart(2, '0');
            return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}T${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`;
        }
        return '';
    }

    private toDraft(row: WebinarRow): WebinarDraft {
        return {
            type: row.type,
            state: row.state,
            location_indirizzo1: row.location_indirizzo1,
            location_indirizzo2: row.location_indirizzo2,
            location_indirizzo3: row.location_indirizzo3,
            title: row.title,
            description: row.description,
            utcDate: this.toInputDate(row.utcDate),
            people: row.people,
            extra: row.extra,
            price: row.price,
            form: row.form === 1
        };
    }

    private mapRow(row: Record<string, unknown>): WebinarRow {
        return {
            id: Number(row['id']),
            type: (row['type'] as WebinarRow['type']) ?? 'WEBINAR',
            state: (row['state'] as WebinarRow['state']) ?? 'DRAFT',
            location_indirizzo1: String(row['location_indirizzo1'] ?? ''),
            location_indirizzo2: String(row['location_indirizzo2'] ?? ''),
            location_indirizzo3: String(row['location_indirizzo3'] ?? ''),
            title: String(row['title'] ?? ''),
            description: String(row['description'] ?? ''),
            utcDate: String(row['utcDate'] ?? ''),
            people: Number(row['people'] ?? 0),
            extra: String(row['extra'] ?? ''),
            price: Number(row['price'] ?? 0),
            form: Number(row['form'] ?? 0)
        };
    }

    private createEmptyDraft(): WebinarDraft {
        return {
            type: 'WEBINAR',
            state: 'DRAFT',
            location_indirizzo1: '',
            location_indirizzo2: '',
            location_indirizzo3: '',
            title: '',
            description: '',
            utcDate: '',
            people: 0,
            extra: '',
            price: 0,
            form: true
        };
    }
}
