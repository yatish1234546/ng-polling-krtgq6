import { Injectable, OnDestroy } from '@angular/core';
import { Observable, timer, Subscription, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap, share, retry, takeUntil } from 'rxjs/operators';

export type Currency = 'EUR' | 'USD' | 'GBP';

export interface CurrencyInfo {
  currency: Currency;
  exchangeRate: number;
}

@Injectable()
export class CurrencyService implements OnDestroy {
  private allCurrencies$: Observable<CurrencyInfo[]>;

  private stopPolling = new Subject();

  constructor(private http: HttpClient) {
    this.allCurrencies$ = timer(1, 3000).pipe(
      switchMap(() =>
        http.get<CurrencyInfo[]>('https://api.zippopotam.us/us/33162')
      ),
      retry(),
      tap(console.log),
      share(),
      takeUntil(this.stopPolling)
    );
  }

  getAllCurrencies(): Observable<CurrencyInfo[]> {
    return this.allCurrencies$.pipe(
      tap(() => console.log('data sent to subscriber'))
    );
  }

  getTest() {
    return this.http.get('https://api.zippopotam.us/us/33162');
  }
  ngOnDestroy() {
    this.stopPolling.next();
  }
}
