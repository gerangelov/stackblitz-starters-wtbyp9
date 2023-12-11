import { Component, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DelayDataSource } from '../datasource/delay-data-source';
import { delayFor } from '../utils';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // item card parameters
  readonly itemSize = 100;
  private readonly headerSize = 200;

  // DataSource parameters
  private readonly dsNumItems = 1000;
  private readonly dsPageSize = 20;
  private readonly dsDelayMs = 400;

  // DataSource definition
  items = new DelayDataSource(this.dsNumItems, this.dsPageSize, this.dsDelayMs);
  // ViewPort
  @ViewChild(CdkVirtualScrollViewport) viewPort!: CdkVirtualScrollViewport;
  // index we want to scroll to
  targetIndex = 0;

  private getGuess(index: number, offset: number, itemHeight: number) {
    const guess = offset + index * itemHeight;
    return guess;
  }

  // scroll to index programmatically
  public async scrollToIndex() {
    if (this.targetIndex >= 0 && this.targetIndex < 1000) {
      const found = await this.iterativeScroll(
        this.viewPort,
        this.targetIndex,
        this.headerSize,
        this.itemSize
      );
      console.log(`Found: ${found}`);
    } else {
      console.log(`Target index out of range`);
    }
  }

  public async iterativeScroll(
    viewPort: CdkVirtualScrollViewport,
    index: number,
    offset: number,
    itemHeight: number
  ) {
    let found = false;
    let guess = 0;
    const minOffsetDiff = 5 * itemHeight;

    let cnt = 0;
    do {
      if (cnt >= 10) {
        break;
      }

      // scroll to a guess
      guess = this.getGuess(index, offset, itemHeight);
      viewPort.scrollToOffset(guess);
      await delayFor(400);

      // check where we scrolled
      const renderedRange = viewPort.getRenderedRange();
      let offsetDiff = 0;
      if (index < renderedRange.start) {
        offsetDiff =
          -1 *
          Math.max(minOffsetDiff, (renderedRange.start - index) * itemHeight);
      } else if (index >= renderedRange.end) {
        offsetDiff = Math.max(
          minOffsetDiff,
          (index - renderedRange.end) * itemHeight
        );
      } else {
        found = true;
        const targetEl = document.getElementById(`card-by-id-${index}`);
        targetEl?.scrollIntoView();
        break;
      }

      offset += offsetDiff;
      cnt++;
    } while (!found);

    return found;
  }

  public getCssClass(index: number) {
    if (index % 5 === 0) {
      return 'item-card-B';
    }

    return 'item-card-A';
  }
}
