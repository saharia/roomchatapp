import { Injectable } from "@angular/core";
import * as io from 'socket.io-client';
import {Observable} from 'rxjs';


@Injectable()


export class ChatService{

    private socket = io('http://localhost:3000');

    joinRoom(data)
    {
        this.socket.emit('join',data, function(response) {
          console.log(response);
        });
    }

    checkValidUser(data) {
      this.socket.emit('init',data);
      this.socket.on('room full', (data)=>{
        console.log(data);
      });
    }

    checkValidUser1(data) {
      this.socket.emit('valid user',data);
      return new Promise((resolve, reject) => {
        this.socket.on('room valid', (data)=>{
          resolve(data.is_valid);
          // console.log(data);
        });
      });
    }

    newUserJoined()
    {
        let observable = new Observable<{user:String, message:String, is_valid: Boolean}>(observer=>{
            this.socket.on('new user joined', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }

    leaveRoom(data){
        this.socket.emit('leave',data);
        this.socket.emit('init',data);
    }

    userLeftRoom(){
        let observable = new Observable<{user:String, message:String}>(observer=>{
            this.socket.on('left room', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }

    sendMessage(data)
    {
        this.socket.emit('message',data);
    }

    newMessageReceived(){
        let observable = new Observable<{user:String, message:String}>(observer=>{
            this.socket.on('new message', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }
}