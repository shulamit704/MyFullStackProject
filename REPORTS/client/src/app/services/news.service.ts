import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsService {
  constructor() {}

  getArticles(topic: string): Observable<any> {
    return of({
      articles: [
        {
          title: `כתבה על ${topic} - דמו`,
          description: `זוהי כתבה מדומה על הנושא: ${topic}`,
          url: 'https://example.com/demo-article'
        },
        {
          title: `כתבה נוספת על ${topic}`,
          description: `עוד קצת מידע מדומה`,
          url: 'https://example.com/another-demo'
        }
      ]
    });
  }
}
