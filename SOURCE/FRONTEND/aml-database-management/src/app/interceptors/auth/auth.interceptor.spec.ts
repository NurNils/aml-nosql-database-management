import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthInterceptor } from './auth.interceptor';
import { environment as env } from 'src/environments/environment';
import { IResponse } from 'src/app/interfaces';
import { ApiService } from '../../services/api/api.service';

const REGULAR_URL = 'https://example.org/image.jpg';
const API_IMAGE_URL = `${env.api.baseUrl}/images/638516-20190628-111301596-e2534ac3.jpg`;
const API_PROJECT_URL = `${env.api.baseUrl}/projects/53b1c579bde3de74f76bdac9`;

describe('AuthInterceptor', () => {
  const interceptor = new AuthInterceptor();
  const next = {
    handle: jasmine.createSpy('next.handle', (pipe) => pipe),
  };
  const request = (url: string) =>
    ({
      url,
      clone: jasmine
        .createSpy('request.clone', (opts) => ({ cloned: true, ...opts }))
        .and.callThrough(),
      headers: {
        set: jasmine
          .createSpy('request.headers.set', (key, value) => `header:${key}:${value}`)
          .and.callThrough(),
      },
    } as any);
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    next.handle.calls.reset();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      ],
    });

    service = TestBed.get(ApiService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('intercept()', () => {
    it('should not modify requests apart from our API', () => {
      [REGULAR_URL, '/images/test.jpg', `https://countly.schwarz/test`].forEach((test) => {
        const req = request(test);
        interceptor.intercept(req, next);

        expect(req.clone).not.toHaveBeenCalled();
        expect(req.headers.set).not.toHaveBeenCalled();
        expect(next.handle).toHaveBeenCalledWith(req);
      });
    });

    it('should add the `Authorization` header to any request targeting the API', () => {
      [API_IMAGE_URL, API_PROJECT_URL].forEach((test) => {
        const req = request(test);
        interceptor.intercept(req, next);

        const key = '123';

        expect(req.clone).toHaveBeenCalledWith({
          headers: req.headers.set('Authorization', `Bearer ` + key),
        });
        expect(req.headers.set).toHaveBeenCalledWith('Authorization', `Bearer ` + key);
        expect(next.handle).toHaveBeenCalledWith({
          cloned: true,
          headers: `header:Authorization:Bearer ` + key,
        });
      });
    });

    it('should transparently set the authorization header for any request using the ApiService', async (done) => {
      const res = { status: 'success' } as IResponse;

      service.get('/dummy').then((data) => {
        expect(data).toEqual(res);
        done();
      });

      const req = httpMock.expectOne(`${service.baseUrl}/dummy`);
      const authHeader = req.request.headers.get('Authorization');
      expect(authHeader).toBeTruthy();
      expect(authHeader).toMatch(/^Bearer ([a-z0-9]{64,})$/i);

      req.flush(res);
    });
  });
});
