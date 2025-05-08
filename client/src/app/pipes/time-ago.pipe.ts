import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: number): string {
    const now = Date.now();
    const seconds = Math.floor((now - value) / 1000);

    if (seconds < 60) {
      return this.translateService.instant('chat.lessThanMinuteAgo');
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return minutes === 1 
        ? this.translateService.instant('chat.minuteAgo') 
        : this.translateService.instant('chat.minutesAgo', { minutes });
    }

    const hours = Math.floor(minutes / 60);
    return hours === 1
      ? this.translateService.instant('chat.hourAgo')
      : this.translateService.instant('chat.hoursAgo', { hours });
  }
}
