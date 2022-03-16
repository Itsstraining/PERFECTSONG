import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Audio } from 'src/app/models/audio.model';
import { AudioService } from 'src/app/services/audio.service';
@Component({
  selector: 'app-music-bar',
  templateUrl: './music-bar.component.html',
  styleUrls: ['./music-bar.component.scss']
})
export class MusicBarComponent implements OnInit {
  constructor(public audioSV: AudioService) { }
  public _audio!: Audio
  private audio = new Audio();
  public isPlaying = false;
  public Audio = new Audio();
  public progress: any;
  public i = 0;
  public isLoop= false;
  public isPlay= false; 
  public speak = 100;
  public songs:any = [];
  public isMute=false;
  public isShuffle=false;

  ngOnInit(): void {
    this.audioSV._audioId.subscribe((_id: string) => {
      this.audioSV.getDetail(_id).subscribe((audio: any) => {
        this._audio = audio;
        if(audio){
          this.playSong(audio.path);
        }
      });
    })
    this.audioSV.getPerfectSong('audio/getAll').subscribe((res:any)=>{
      this.songs = res
      
    })
  }
  public getDetail(audioId: string) {
    this.audioSV.getDetail(audioId).subscribe((res: any) => {
      console.log(res);
    });
  }

  public durationTime() {
    if (this.Audio.duration) {
      let progressPercent = Math.floor(this.Audio.currentTime / this.Audio.duration * 100)
      // console.log(progressPercent)
      this.progress = progressPercent;
    }
  }
  public changeSong(actions: string) {
    if(actions == "next"){
      this.i++;
    }else{
      this.i--;
    }
    if(this.songs[this.i]==undefined) {
      this.i = 0
    }
    this._audio = this.songs[this.i];
    this.playSong(this.songs[this.i].path);
  }

  public playSong(path:string) {

    // if (this.isPlaying == false) {
      this.Audio.src = path;
      this.Audio.load();
      this.Audio.play();
      this.isPlay = true;

      
      this.Audio.addEventListener('timeupdate', (currentTime) => {
        //console.log(this.Audio.currentTime);
        this.durationTime();
        
      })
              
    // } else {
    //   this.isPlaying = false;
    //   this.Audio.pause();
    //   //this.Audio.currentTime;
    // }

  }

  public PlayandPause(){
    if (this.isPlay==false){
      this.isPlay=true;
      this.Audio.play();
    }else if (this.isPlay==true){
      this.Audio.pause();
      this.isPlay=false;
    }
    

  }


  public loopSong(){
    this.isLoop= !this.isLoop;
    if (this.isLoop == true){
      this.Audio.loop = this.isLoop;
      console.log("It's loop");
    }
  }

  public adjustVolume(e:any){
    console.log(e)
    this.speak = e.value;
    if(e.value == 0){
      this.isMute = true;
    }else if (e.value>0){
      this.isMute = false;
    }
    
    this.Audio.volume = e.value/100;
  }

  public muteVolume(){
    if (this.isMute==false){
      this.Audio.muted=true;
      this.isMute=true;
      console.log("Muted")
    }else if (this.isMute==true){
      this.Audio.muted=false;
      this.isMute=false;
      console.log("unmuted");
    }
  }

//   public shuffleSong(){
//     if(this.isShuffle==false){
//       let items = this.songs[Math.floor(Math.random()*this.songs.length)]
//       this.isShuffle=true;
//       console.log(items);
//     }else if ( this.isShuffle==true)
//     {
//       this.audioSV.getPerfectSong('audio/getAll').subscribe((res:any)=>{
//         this.songs = res;
//         console.log(res);
//         this.isShuffle=false;
//       })
//   }
// }

  @ViewChild('process') processRef!: ElementRef;

  public _endTime = 0;
  public _currentTime = 0;
  public _time = 0;

  changeTime(event: any) {
    let left = this.processRef.nativeElement.getBoundingClientRect().left;
    let right = this.processRef.nativeElement.getBoundingClientRect().right;
    let point = event.clientX;
    let percent = (point - left) / (right - left);
    let value = Math.floor(percent*100)
    this.Audio.currentTime = (value * this.Audio.duration) / 100;
    this._endTime = parseFloat((this.Audio.duration / 60).toFixed(2));
    this.Audio.addEventListener('timeupdate', (currentTime) => {
      this._currentTime = Math.floor(
        (this.Audio.currentTime / this.Audio.duration) * 100
      );
      this._time = parseFloat((this.Audio.currentTime / 60).toFixed(2));
    });
    console.log(this._currentTime);
  }

}
