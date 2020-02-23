import { Component } from '@angular/core';
import {ChatService} from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[ChatService]
})
export class AppComponent {
  user:String;
  validUser: String;
    room:String = 'test';
    messageText:String;
    messageArray:Array<{user:String,message:String}> = [];
    constructor(private _chatService:ChatService){
      var _this = this;
      
        this._chatService.newUserJoined()
        .subscribe( {
          next(data) {
            console.log(data);
            if(data.is_valid) {
              _this.messageArray.push(data);
            } else {
              if(_this.user == data.user) {
                alert('Only')
              }
            }
          },
          error(data) {

          }
        });


        this._chatService.userLeftRoom()
        .subscribe(data=>this.messageArray.push(data));

        this._chatService.newMessageReceived()
        .subscribe(data=>this.messageArray.push(data));
    }

    ngOnInit() {
      console.log('init')
      this._chatService.checkValidUser({user:'', room:this.room, is_valid: false});
    }

    join(){
      this._chatService.checkValidUser1({user:'', room:this.room, is_valid: false}).then((response) => {
        if(response) {
          this.validUser = this.user;
          this._chatService.joinRoom({user:this.user, room:this.room, is_valid: false});
        } else {
          alert('Only tow user allowed!');
        }
      });
    }

    leave(){
      this.validUser = null;
        this._chatService.leaveRoom({user:this.user, room:this.room});
    }

    sendMessage()
    {
        this._chatService.sendMessage({user:this.user, room:this.room, message:this.messageText});
        this.messageText = '';
    }
}

