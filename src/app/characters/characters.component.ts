import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit {
  characters: any[] = [];
  displayedCharacters: any[] = [];
  selectedCharacter: any = null;
  newCharacter: any = {};
  searchQuery: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.searchCharacters();
    });
    this.getCharacters();
  }

  getCharacters() {
    this.http.get<any>('http://localhost:3000/api/characters').subscribe(data => {
      this.characters = data;
      this.searchCharacters();
    });
  }

  searchCharacters() {
    if (this.searchQuery.trim() !== '') {
      this.displayedCharacters = this.characters.filter(character => {
        return character.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    } else {
      this.displayedCharacters = this.characters;
    }
  }

  showCharacterDetails(character: any) {
    this.selectedCharacter = character;
  }

  closeCharacterDetails() {
    this.selectedCharacter = null;
  }

  addCharacter() {
    this.http.post<any>('http://localhost:3000/api/characters', this.newCharacter).subscribe(data => {
      this.characters.push(data);
      this.newCharacter = {};
    });
  }

  deleteCharacter(characterId: number) {
    this.http.delete<any>(`http://localhost:3000/api/characters/${characterId}`).subscribe(() => {
      this.characters = this.characters.filter(character => character.id !== characterId);
      this.displayedCharacters = this.displayedCharacters.filter(character => character.id !== characterId);
    });
  }
}
