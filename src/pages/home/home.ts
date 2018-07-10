import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
declare var window;

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	constructor(public navCtrl: NavController) {

		new Promise<any>(resolve => window.addEventListener("beforeinstallprompt", resolve))
			.then(ev => {
				console.log('beforeinstallprompt out');
				ev.preventDefault();
				this.prompt = ev;
			})
	}
	prompt;
	position;
	@ViewChild('videoId') video: ElementRef;

	addHome() {
		if (!this.prompt) return;
		this.prompt.prompt();
	}

	getLoc() {
		new Promise<any>((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject))
			.then(pos => { console.log(pos); this.position = `lat : ${pos.coords.latitude}, lng : ${pos.coords.longitude}`; })
			.catch(err => console.error(err));
	}

	takePhoto() {
		navigator.mediaDevices.getUserMedia({ video: { width: { max: 1000 }, height: { max: 1000 } } })
			.then(mStream => {
				this.video.nativeElement.src = window.URL.createObjectURL(mStream);
				this.video.nativeElement.play();
			})
			.catch(error => console.error('getUserMedia() error:', error));
	}
}