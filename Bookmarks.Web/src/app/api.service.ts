import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl: string = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }
  getJsonData(apiEndpoint: string, includeHeaders: boolean = false) {
    var observe: any = includeHeaders ? "response" : "body";
    return this.httpClient.get(this.baseUrl + apiEndpoint, { observe: observe });
  }

  postJsonData(apiEndpoint: string, data: any) {
    return this.httpClient.post(this.baseUrl + apiEndpoint, data);
  }
}
