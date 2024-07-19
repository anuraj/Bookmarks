import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Preview } from '../shared/Preview';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  constructor(private apiService: ApiService, private toastr: ToastrService) { }
  inProgress: boolean = true;
  links: Preview[] = [];
  pageNumber: number = 1;
  pageSize: number = 10;
  pageSizes: number[] = [5, 10, 20, 50];
  totalRecords: number = 0;
  ngOnInit(): void {
    this.getLinks();
  }

  onPageChange(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.links = [];
    this.getLinks();
  }

  numberOfPages() {
    if (this.totalRecords < this.pageSize) {
      return 1;
    }

    return Math.ceil(this.totalRecords / this.pageSize);
  }


  // Define the platforms array
  platforms: Platform[] = [
    { name: "facebook", icon: "facebook" },
    { name: "twitter", icon: "twitter" },
    { name: "linkedin", icon: "linkedin" },
    { name: "pinterest", icon: "pinterest" },
    { name: "whatsapp", icon: "whatsapp" },
    { name: "messenger", icon: "messenger" },
    { name: "reddit", icon: "reddit" },
    { name: "telegram", icon: "telegram" },
    { name: "email", icon: "envelope" },
    { name: "sms", icon: "chat" },
    { name: "line", icon: "line" },
    { name: "copy", icon: "copy" },
    { name: "print", icon: "printer" }
  ];

  getLinks() {
    this.apiService.getJsonData('/Bookmarks?pageSize=' + this.pageSize + '&pageNumber=' + this.pageNumber, true)
      .subscribe({
        next: (response: any) => {
          var links = response.body;
          if (links.length > 0) {
            this.totalRecords = response.headers.get('X-Total-Count');
            links.forEach((element: any) => {
              let preview = new Preview();
              preview.title = element.title;
              preview.description = element.description;
              preview.imageUrl = element.imageUrl;
              preview.url = element.url;
              preview.id = element.id;
              preview.createdOn = element.createdOn;
              this.links.push(preview);
            });
          } else {
            this.toastr.info('No links available. Please add some links to view here.');
          }
        },
        error: (error: any) => {
          this.toastr.error('Failed to get bookmarks');
        },
        complete: () => {
          this.inProgress = false;
        }
      });
  }

  onImageError(event: any, title: string | undefined) {
    var firstLetter = title!.charAt(0).toUpperCase();
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="625"><g><rect x="0" y="0" width="1200" height="625" style="stroke:black;fill:white;" /><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="40rem" fill="black">' + firstLetter + '</text></g></svg>';
    var blob = new Blob([svg], { type: 'image/svg+xml' });
    var url = URL.createObjectURL(blob);
    event.target.src = url;
  }

  onNavigate(id: string) {
    this.apiService.getJsonData('/Bookmarks/' + id).subscribe((response: any) => {
      var url = response.url;
      var winOpen = window.open(url, "_blank");
      if (winOpen) {
        winOpen.focus();
      }
      else {
        this.toastr.error('Popup blocked. Please allow popups and try again.');
      }
    });
  }
}

interface Platform {
  name: string;
  icon: string;
}
