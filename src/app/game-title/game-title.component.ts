import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-game-title',
  templateUrl: './game-title.component.html',
  styleUrls: ['./game-title.component.scss']
})
export class GameTitleComponent implements OnInit {
  @Input() darkMode;

  constructor() { }

  ngOnInit() {
  }

}
