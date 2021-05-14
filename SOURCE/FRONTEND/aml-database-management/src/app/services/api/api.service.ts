/**
 * Copyright (c) 2021
 *
 * This file contains the api service which provides the application with an API endpoint connection.
 *
 * @author NurNils <inf19161@lehre.dhbw-stuttgart.de>
 * @author NamidM <inf19054@lehre.dhbw-stuttgart.de>
 *
 * Last modified  : 14.05.2021
 */
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { IResponse, IResponseStatus } from '../../interfaces/response.interface';
import { SnackBarService } from '../snack-bar/snack-bar.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  /** The API's base URL including protocol, port etc */
  public readonly baseUrl = env.api.baseUrl;

  /** Default request options */
  private readonly defaultOptions: any = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  /** Allowed request methods */
  private readonly allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

  /** Constructor */
  public constructor(public http: HttpClient, private snackBarService: SnackBarService) {}

  /** Request wrapper */
  public async request(method: string, endpoint: string, options?: object): Promise<IResponse> {
    try {
      if (!this.allowedMethods.includes(method)) {
        throw new Error(`Method "${method}" is not allowed`);
      }

      const response = await this.http
        .request<IResponse>(method, `${this.baseUrl}${endpoint}`, options)
        .toPromise();

      if (response.status !== IResponseStatus.success) {
        /**
        const message = response.message ? `: ${response.message}` : '';
        throw new Error(`${response.status}${message}`);
         */
        if (response.message) {
          this.snackBarService.openSnackbarError(response.message, false);
        }
      }

      return response;
    } catch (error) {
      const message =
        error instanceof HttpErrorResponse
          ? `${error.statusText} (${error.status})`
          : error.message;
      throw new Error(`Request failed (${message})`);
    }
  }

  /** Generate a GET request for a given endpoint */
  public async get(endpoint: string, params?: any, reqOpts?: any): Promise<IResponse> {
    const options = {
      ...this.defaultOptions,
      ...reqOpts,
      params: params ? new HttpParams() : null,
    };

    if (params) {
      Object.entries(params).forEach(
        ([key, value]) => (options.params = options.params.set(key, value))
      );
    }

    return this.request('GET', endpoint, options);
  }

  /** Generate a POST request for a given endpoint */
  public async post(endpoint: string, body: any, reqOpts?: any): Promise<IResponse> {
    return this.request('POST', endpoint, { ...reqOpts, body });
  }

  /** Generate a PUT request for a given endpoint */
  public async put(endpoint: string, body: any, reqOpts?: any): Promise<IResponse> {
    return this.request('PUT', endpoint, { ...reqOpts, body });
  }

  /** Generate a DELETE request for a given endpoint */
  public async delete(endpoint: string, reqOpts?: any): Promise<IResponse> {
    return this.request('DELETE', endpoint, reqOpts);
  }

  /** Generate a PATCH request for a given endpoint */
  public async patch(endpoint: string, body: any, reqOpts?: any): Promise<IResponse> {
    return this.request('PATCH', endpoint, { ...reqOpts, body });
  }
}
