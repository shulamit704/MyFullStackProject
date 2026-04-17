import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-posts-carousel',
  templateUrl: './posts-carousel.component.html',
  styleUrl: './posts-carousel.component.css'
})
export class PostsCarouselComponent implements OnInit {
  posts: any[] = []; // רשימת הפרסומים
  currentIndex: number = 0; // אינדקס הפרסום הנוכחי

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchPosts(); // הבאת הפרסומים
    this.startCarousel(); // התחלת המעבר בין פרסומים
  }

  fetchPosts(): void {
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/posts') // דוגמה ל-API
      .subscribe(data => {
        this.posts = data.slice(0, 10); // שמירת 10 פרסומים ראשונים
      });
  }

  startCarousel(): void {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.posts.length; // מעבר לפרסום הבא
    }, 3000); // כל 3 שניות
  }
}
