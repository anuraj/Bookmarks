import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { ToastrService } from 'ngx-toastr';
import { Preview } from '../shared/Preview';

@Component({
  selector: 'app-add-url',
  templateUrl: './add-url.component.html'
})
export class AddUrlComponent {
  constructor(private apiService: ApiService, private formBuilder: FormBuilder, private toastr: ToastrService) { }
  addUrlForm!: FormGroup;
  submitted: boolean = false;
  inProgress: boolean = false;
  preview: Preview | null = null;
  @ViewChild("url") element: ElementRef | undefined;
  links: Preview[] = [];
  ngOnInit(): void {
    this.addUrlForm = this.formBuilder.group({
      url: ['', [Validators.required, Validators.pattern('https?://.+')]],
      title: [''],
      description: [''],
      imageUrl: ['']
    });

    this.apiService.getJsonData('/Bookmarks').subscribe((response: any) => {
      let preview: Preview;
      response.forEach((element: any) => {
        preview = new Preview();
        preview.title = element.title;
        preview.description = element.description;
        preview.imageUrl = element.imageUrl;
        preview.url = element.url;
        this.links.push(preview);
      });
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.addUrlForm.controls;
  }

  fetchPreview() {
    if (this.addUrlForm.invalid) {
      return;
    }
    this.inProgress = true;
    this.apiService.getJsonData('/Bookmarks/preview?url=' + this.addUrlForm.controls['url'].value).subscribe((response: any) => {
      this.preview = response;
      this.addUrlForm.controls['title'].setValue(response.title);
      this.addUrlForm.controls['description'].setValue(response.description);
      this.addUrlForm.controls['imageUrl'].setValue(response.imageUrl);
      this.inProgress = false;
    });

  }

  onSubmit() {
    this.submitted = true;
    if (this.addUrlForm.invalid) {
      return;
    }
    this.apiService.postJsonData('/Bookmarks', this.addUrlForm.value).subscribe({
      next: (response: any) => {
        this.submitted = false;
        this.toastr.success('URL added successfully');
        this.preview = null;
        this.addUrlForm.reset();
        this.element?.nativeElement.focus();
      },
      error: (error: any) => {
        this.toastr.error('Unable to add URL. Please retry after sometime.');
      },
      complete: () => {
        this.inProgress = false;
      }
    });
  }
}
