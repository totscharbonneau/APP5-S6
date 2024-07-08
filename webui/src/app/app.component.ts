import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

function httpGet(theUrl: string)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'webui';

  onButtonClick() {
    console.log('Button clicked!');
    httpGet("http://localhost:8000");
  }
}