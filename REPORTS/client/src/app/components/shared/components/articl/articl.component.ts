import { Component, Input, OnInit } from '@angular/core';
import { NewsService } from '../../../../services/news.service';

@Component({
  selector: 'app-articl',
  templateUrl: './articl.component.html'
})
export class ArticlComponent implements OnInit {
  @Input() topic: string = '';
  articles: any[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    if (this.topic) {
      this.newsService.getArticles(this.topic).subscribe(response => {
        this.articles = response.articles || [];
      });
    }
  }
}
