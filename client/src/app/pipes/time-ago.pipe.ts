import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'time-ago',
    standalone: true
})
export class TimeAgoPipe implements PipeTransform {
    transform(timestamp: number) {
        const diffInSeconds = Math.floor((new Date().getTime() - timestamp) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`;
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        return `${diffInHours} hours ago`;
    }
}