import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { delayFor } from '../utils';

export class DelayDataSource extends DataSource<string> {
  private cachedData: string[];
  private fetchedPages = new Set<number>();
  private readonly dataStream: BehaviorSubject<string[]>;
  private subscription: Subscription | null = null;

  constructor(
    private readonly totalLength: number,
    private readonly pageSize = 25,
    private readonly delayMs = 20
  ) {
    super();

    this.cachedData = Array.from({ length: totalLength });
    this.dataStream = new BehaviorSubject(this.cachedData);
  }

  override connect(
    collectionViewer: CollectionViewer
  ): Observable<readonly string[]> {
    this.subscription = collectionViewer.viewChange.subscribe((range) => {
      const startPage = this.getPageForIndex(range.start);
      const endPage = this.getPageForIndex(range.end - 1);

      for (let i = startPage; i <= endPage; i++) {
        this.fetchPage(i);
      }
    });

    return this.dataStream;
  }

  override disconnect(collectionViewer: CollectionViewer): void {
    this.subscription?.unsubscribe();
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private fetchPage(page: number) {
    if (this.fetchedPages.has(page)) {
      return;
    }
    this.fetchedPages.add(page);

    this.getPageData(page, this.pageSize).then((items) => {
      this.cachedData.splice(page * this.pageSize, this.pageSize, ...items);
      this.dataStream.next(this.cachedData);
    });
  }

  private async getPageData(page: number, pageSize: number): Promise<string[]> {
    await delayFor(this.delayMs);
    return Array.from({ length: pageSize }).map(
      (_, index) => `Item ${page * pageSize + index}`
    );
  }
}
